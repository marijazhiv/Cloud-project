import boto3
import json
from datetime import datetime

# Inicijalizacija S3 i DynamoDB
# s3 = boto3.client('s3')
# dynamodb = boto3.resource('dynamodb')
# table_name = "Test"
# table = dynamodb.Table(table_name)
#
# # Definiši ime S3 bucket-a
# s3_bucket_name = "bucket-22"
#
# sns = boto3.client('sns')
# subscriptions_table_name = "Subscriptions"
# subscriptions_table = dynamodb.Table(subscriptions_table_name)
#
# # Dodaj SQS klijent
# sqs = boto3.client('sqs')
#
# # Definiši SQS red koji će primati poruke za slanje obaveštenja
# sqs_queue_url = 'https://sqs.eu-central-1.amazonaws.com/637423444446/EmailNotificationQueue'

import os

sqs = boto3.client('sqs')

s3_bucket_name = os.getenv('S3_BUCKET_NAME')
table_name = os.getenv('TABLE_NAME')
sqs_queue_url = os.getenv('SQS_QUEUE_URL')
subscriptions_table_name = os.getenv('SUBSCRIPTIONS_TABLE_NAME')

dynamodb = boto3.resource('dynamodb')
subscriptions_table = dynamodb.Table(subscriptions_table_name)

s3 = boto3.client('s3')
table = dynamodb.Table(table_name)


def upload_meta(event, context):
    try:
        for record in event['Records']:
            message = json.loads(record['Sns']['Message'])

            video_key = message.get('video_key')
            title = message.get('title')
            description = message.get('description')
            actors = message.get('actors', [])
            directors = message.get('directors', [])
            genres = message.get('genres', [])
            item_id = message.get('id')

            print(f"Received message: {message}")

            if not video_key or not title or item_id is None:
                raise ValueError("video_key, title i id su obavezni")

            item_id = int(item_id)

            response = s3.head_object(Bucket=s3_bucket_name, Key=video_key)
            file_size = response['ContentLength']
            content_type = response['ContentType']
            last_modified = response['LastModified'].strftime('%Y-%m-%d %H:%M:%S')

            actors_str = "!".join(actors)
            directors_str = "*".join(directors)
            genres_str = ",".join(genres)
            search_key = f"{title}_{description}_{actors_str}_{directors_str}_{genres_str}"

            item = {
                'id': item_id,
                'VideoKey': video_key,
                'Title': title,
                'Description': description,
                'Actors': actors,
                'Directors': directors,
                'Genres': genres,
                'FileSize': file_size,
                'ContentType': content_type,
                'UploadTime': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'LastModified': last_modified,
                'SearchKey': search_key
            }

            table.put_item(Item=item)

            # Provera pretplata korisnika i slanje obaveštenja
            notify_users(actors, directors, genres, title, description)

        response = {
            'statusCode': 200,
            'body': json.dumps({'message': 'Metapodaci su uspešno sačuvani'}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        return response

    except ValueError as ve:
        print("Greška:", str(ve))
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Došlo je do greške', 'error': str(ve)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }

    except Exception as e:
        print("Greška:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Došlo je do greške', 'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }


def send_notification(email, message):
    if email:
        try:
            sqs.send_message(
                QueueUrl=sqs_queue_url,
                MessageBody=json.dumps({
                    'email': email,
                    'message': message
                })
            )
            print(f"Poruka dodata u SQS red za e-mail {email}: {message}")

        except Exception as e:
            print(f"Greška pri slanju poruke u SQS: {str(e)}")
    else:
        print(f"Email adresa nije postavljena. Poruka: {message}")


def notify_users(actors, directors, genres, title, description):
    response = subscriptions_table.scan()
    subscriptions = response.get('Items', [])

    # Pretvaranje listi u stringove za bolji format
    actors_str = ", ".join(actors)
    directors_str = ", ".join(directors)
    genres_str = ", ".join(genres)

    for subscription in subscriptions:
        email = subscription.get('email')
        subscription_type = subscription.get('subscription_type')
        subscription_value = subscription.get('subscription_value')

        # Provera da li je korisnik pretplaćen na aktere, režisere ili žanrove
        if subscription_type == 'actor' and subscription_value in actors:
            send_notification(
                email,
                f"New film '{title}' with actor {subscription_value} is uploaded!\n\n"
                f"Film content:\n\n"
                f"Title: {title}\n"
                f"Description: {description}\n"
                f"Actors: {actors_str}\n"
                f"Directors: {directors_str}\n"
                f"Genres: {genres_str}"
            )
        elif subscription_type == 'director' and subscription_value in directors:
            send_notification(
                email,
                f"New film '{title}' directed by {subscription_value} is uploaded!\n\n"
                f"Film content:\n\n"
                f"Title: {title}\n"
                f"Description: {description}\n"
                f"Actors: {actors_str}\n"
                f"Directors: {directors_str}\n"
                f"Genres: {genres_str}"
            )
        elif subscription_type == 'genre' and subscription_value in genres:
            send_notification(
                email,
                f"New film '{title}' genre {subscription_value} is uploaded!\n\n"
                f"Film content:\n\n"
                f"Title: {title}\n"
                f"Description: {description}\n"
                f"Actors: {actors_str}\n"
                f"Directors: {directors_str}\n"
                f"Genres: {genres_str}"
            )
