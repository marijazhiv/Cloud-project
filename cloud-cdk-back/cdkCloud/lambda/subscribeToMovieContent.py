import boto3
import json
import time
from datetime import datetime

# Inicijalizacija DynamoDB i SES klijenata
dynamodb = boto3.resource('dynamodb')
ses = boto3.client('ses', region_name='eu-central-1')  # Dodaj region ako koristiš specifičan

table_name = "Subscriptions"  # Zameni sa imenom svoje tabele
table = dynamodb.Table(table_name)

feed_table_name = "FeedTable"  # Tabela koja čuva feed korisnika
films_table_name = "Test"  # Tabela koja čuva filmove
feed_table = dynamodb.Table(feed_table_name)
films_table = dynamodb.Table(films_table_name)


def subscribeToMovieContent(event, context):
    try:
        # Parsiranje JSON podataka direktno iz event objekta
        body = event  # Pretpostavlja se da je event direktno JSON

        username = body.get('username')
        subscription_type = body.get('subscription_type')
        subscription_value = body.get('subscription_value')
        email = body.get('email')  # Pretpostavljamo da se email šalje u JSON-u

        # Validacija
        if not username or not subscription_type or not subscription_value or not email:
            raise ValueError("Sva polja su obavezna: username, subscription_type, subscription_value i email")

        # Provera da li već postoji pretplata za dati subscription_type i subscription_value
        existing_subscription = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('username').eq(username) &
                             boto3.dynamodb.conditions.Attr('subscription_type').eq(subscription_type) &
                             boto3.dynamodb.conditions.Attr('subscription_value').eq(subscription_value)
        )

        if existing_subscription['Items']:
            raise ValueError(f"Korisnik je već pretplaćen na {subscription_value} za {subscription_type}.")

        # Generisanje jedinstvenog ID-a (npr. timestamp u sekundama)
        subscription_id = int(time.time())  # Koristimo trenutni timestamp kao ID (numerički tip)

        # Kreiranje stavke za čuvanje u DynamoDB
        item = {
            'id': subscription_id,  # `id` je sada numerički tip (N)
            'username': username,
            'subscription_type': subscription_type,
            'subscription_value': subscription_value,
            'email': email  # Dodajemo email u DynamoDB
        }

        # Čuvanje stavke u DynamoDB
        table.put_item(Item=item)

        # Ažuriraj feed
        update_feed(username, subscription_type, subscription_value)

        # Slanje verifikacionog emaila putem SES-a
        verify_email_with_ses(email)

        response = {
            'statusCode': 200,
            'body': json.dumps({'message': 'Uspešno ste se pretplatili. Verifikacioni email je poslan.',
                                'subscription_id': subscription_id}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        return response

    except ValueError as ve:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Došlo je do greške', 'error': str(ve)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Došlo je do greške', 'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }


def verify_email_with_ses(email):
    try:
        # Prvo proveravamo da li je email već verifikovan
        response = ses.list_verified_email_addresses()
        verified_emails = response.get('VerifiedEmailAddresses', [])

        if email in verified_emails:
            print(f"Email {email} je već verifikovan, nije potrebno slati novi zahtev.")
        else:
            # Ako email nije verifikovan, šaljemo zahtev za verifikaciju
            ses.verify_email_identity(EmailAddress=email)
            print(f"Verifikacioni email poslat na adresu {email}")

    except Exception as e:
        print(f"Greška pri slanju verifikacionog emaila: {str(e)}")


def update_feed(username, subscription_type, subscription_value):
    try:
        # Pronalaženje filmova koji odgovaraju kriterijumu pretplate
        response = films_table.scan()  # Pretražuje sve filmove, može biti potrebno optimizovati
        films = response.get('Items', [])

        # Rečnik za čuvanje skora filmova
        film_scores = {}

        print(f"Pretražujem filmove za pretplatu: {subscription_type} sa vrednošću: {subscription_value}")

        for film in films:
            score = 0
            # Proveri da li film odgovara pretplati
            if subscription_type == 'actor':
                if subscription_value in film.get('Actors', []):
                    score = 10  # Primer skora, prilagodite prema potrebi
            elif subscription_type == 'director':
                if subscription_value in film.get('Directors', []):
                    score = 10  # Primer skora, prilagodite prema potrebi
            elif subscription_type == 'genre':
                if subscription_value in film.get('Genres', []):
                    score = 10  # Primer skora, prilagodite prema potrebi

            if score > 0:
                print(f"Film '{film.get('Title')}' dobija score {score}")
                film_scores[film['VideoKey']] = score

        # Preuzmi postojeći feed za korisnika
        existing_feed_response = feed_table.get_item(Key={'username': username})
        existing_feed = existing_feed_response.get('Item', {})

        # Ažuriranje skora u feedu
        if 'Feed' in existing_feed:
            existing_film_scores = existing_feed['Feed']
        else:
            existing_film_scores = {}

        for film_key, new_score in film_scores.items():
            if film_key in existing_film_scores:
                # Dodaj novi skor postojećem skoru
                existing_film_scores[film_key] += new_score
            else:
                # Dodaj novi film sa početnim skorom
                existing_film_scores[film_key] = new_score

        # Ažuriraj feed sa novim skorenima
        feed_item = {
            'username': username,
            'Feed': existing_film_scores,
            'LastUpdate': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        feed_table.put_item(Item=feed_item)
        print(f"Feed ažuriran za korisnika {username} sa skorenima: {existing_film_scores}")

    except Exception as e:
        print(f"Error updating feed: {str(e)}")

