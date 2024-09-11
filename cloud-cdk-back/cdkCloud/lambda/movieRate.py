import json
from datetime import datetime
import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
rating_table_name = "Reviews"
rating_table = dynamodb.Table(rating_table_name)
film_table = dynamodb.Table('Test')
feed_table = dynamodb.Table("FeedTable")


def get_film_details(film_id):
    """
    Dobija detalje filma iz tabele `Test` koristeći `Scan` za pretragu po `VideoKey`.
    """
    try:
        response = film_table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('VideoKey').eq(film_id)
        )
        return response.get('Items', [])[0] if response.get('Items') else {}
    except Exception as e:
        print(f"Error getting film details: {str(e)}")
        return {}


def find_similar_films(actors, directors, genres):
    """
    Pronalazi filmove koji imaju iste aktere, režisere ili žanrove.
    """
    try:
        response = film_table.scan()
        similar_films = []
        for film in response.get('Items', []):
            film_actors = set(film.get('Actors', []))
            film_directors = set(film.get('Directors', []))
            film_genres = set(film.get('Genres', []))

            if (film_actors & set(actors)) or (film_directors & set(directors)) or (film_genres & set(genres)):
                similar_films.append(film['VideoKey'])

        return similar_films
    except Exception as e:
        print(f"Error finding similar films: {str(e)}")
        return []


def update_feed_for_film(username, film_id, film_details, rating):
    """
    Ažurira feed za film sa zadatim `film_id` za korisnika, kao i za slične filmove.
    """
    try:
        existing_feed_response = feed_table.get_item(Key={'username': username})
        existing_feed = existing_feed_response.get('Item', {})

        if 'Feed' in existing_feed:
            existing_film_scores = existing_feed['Feed']
        else:
            existing_film_scores = {}

        # Pronađi slične filmove na osnovu glumaca, režisera ili žanrova
        actors = film_details.get('Actors', [])
        directors = film_details.get('Directors', [])
        genres = film_details.get('Genres', [])

        similar_films = find_similar_films(actors, directors, genres)

        # Izračunaj poene na osnovu ocene korišćenog filma
        score = calculate_score(rating)

        # Ažuriraj feed sa poenima na osnovu ocene za svaki film
        for film in [film_id] + similar_films:
            if film in existing_film_scores:
                existing_film_scores[film] += score
            else:
                existing_film_scores[film] = score

        # Sačuvaj feed za korisnika
        feed_item = {
            'username': username,
            'Feed': existing_film_scores,
            'LastUpdate': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        feed_table.put_item(Item=feed_item)
        print(f"Feed ažuriran za film: {film_id} i slične filmove: {similar_films}")

    except Exception as e:
        print(f"Greška pri ažuriranju feeda za film {film_id}: {str(e)}")


def rate_movie(event, context):
    try:
        print(f"Primljeni događaj: {event}")

        film_id = event.get('film_id')
        username = event.get('username')
        rating = event.get('rating')
        item_id = int(datetime.now().timestamp())

        if not film_id or not username or rating is None:
            raise ValueError("Film ID, korisničko ime i ocena su obavezni")

        # Provera da li je ocena validna (1-5)
        if rating < 1 or rating > 5:
            raise ValueError("Ocena mora biti između 1 i 5")

        existing_rating_response = rating_table.scan(
            FilterExpression=Attr('FilmID').eq(film_id) & Attr('Username').eq(username)
        )

        if existing_rating_response['Items']:
            # Ako ocena već postoji, ne dozvoljavamo duplo ocenjivanje
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Već ste ocenili ovaj film'}),
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }

        # Kreiranje unosa u tabeli ocena
        rating_item = {
            'id': item_id,
            'FilmID': film_id,
            'Username': username,
            'Rating': rating,
            'Timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        # Upis u DynamoDB
        rating_table.put_item(Item=rating_item)

        object_key = f"films/{film_id}.mp4"

        # Dobijanje detalja filma
        film_details = get_film_details(object_key)
        if film_details:
            # Ažurirajte feed za preuzeti film i slične filmove
            update_feed_for_film(username, object_key, film_details, rating)

        response = {
            'statusCode': 200,
            'body': json.dumps({'message': 'Ocena je uspešno sačuvana'}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        return response

    except ValueError as ve:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': str(ve)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }


# Funkcija za određivanje skora na osnovu ocene
def calculate_score(rating):
    if rating == 5:
        return 3
    elif rating == 4:
        return 2
    elif rating == 3:
        return 0
    elif rating == 2:
        return -1
    elif rating == 1:
        return -3
    else:
        return 0
