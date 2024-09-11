import json
import boto3
import urllib.parse
from datetime import datetime

s3 = boto3.client('s3')
S3_BUCKET_NAME = 'bucket-22'
dynamodb = boto3.resource('dynamodb')
S3_FOLDER_PATH = 'films/'
film_table = dynamodb.Table('Test')  # Tabela koja sadrži filmove
feed_table = dynamodb.Table('FeedTable')  # Tabela koja čuva feed korisnika


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


def update_feed_for_film(username, film_id, film_details):
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

        # Ažuriraj feed sa 5 poena za svaki sličan film
        for film in [film_id] + similar_films:
            if film in existing_film_scores:
                existing_film_scores[film] += 5
            else:
                existing_film_scores[film] = 5

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


def download_function(event, context):
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    # Handle preflight requests
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers
        }

    try:
        key = event['pathParameters']['id']
        decoded_key = urllib.parse.unquote(key)

        # Uzmite username iz path parametara
        username = event['pathParameters'].get('username')

        if not username:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Username is required'}),
                "headers": headers
            }

        object_key = f"films/{decoded_key}.mp4"

        # Dobijanje URL-a za preuzimanje
        response = s3.list_objects_v2(Bucket=S3_BUCKET_NAME, Prefix=object_key)
        if 'Contents' in response and any(obj['Key'] == object_key for obj in response['Contents']):
            url = s3.generate_presigned_url('get_object',
                                            Params={'Bucket': S3_BUCKET_NAME, 'Key': object_key},
                                            ExpiresIn=3600)

            # Dobijanje detalja filma
            film_details = get_film_details(object_key)
            if film_details:
                # Ažurirajte feed za preuzeti film i slične filmove
                update_feed_for_film(username, object_key, film_details)

            return {
                'statusCode': 200,
                'body': json.dumps({'url': url}),
                "headers": headers
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Object not found: ' + object_key}),
                "headers": headers
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': f'Error generating URL: {str(e)}'}),
            "headers": headers
        }
