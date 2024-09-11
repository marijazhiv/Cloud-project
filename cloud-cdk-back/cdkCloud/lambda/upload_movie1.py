import os

import boto3
import json
import time

s3_bucket_name = os.getenv('S3_BUCKET_NAME')
sns_topic_arn = os.getenv('SNS_TOPIC_ARN')


# sqs_queue_url = 'https://sqs.eu-central-1.amazonaws.com/637423444446/EmailNotificationQueue'


def upload_movie1(event, context):
    try:
        # Ekstrahovanje binarnih podataka fajla iz event objekta
        file_data = event['body']

        # Generiši numerički ID koristeći trenutni timestamp
        item_id = int(time.time())  # Koristimo trenutni timestamp kao numerički ID

        # Kreiraj S3 ključ koristeći numerički ID i putanju foldera
        key = f"films/{item_id}.mp4"  # Dodajemo putanju foldera "films/"

        # Kreiraj S3 klijent
        s3 = boto3.client('s3')

        # Učitaj fajl u S3 bucket
        s3.put_object(Body=file_data, Bucket=s3_bucket_name, Key=key)

        # Inicijalizuj SNS klijent
        sns = boto3.client('sns')

        # Kreiraj poruku za SNS
        message = {
            'video_key': key,
            'title': event.get('title', 'Unknown Title'),
            'description': event.get('description', 'No Description'),
            'actors': event.get('actors', []),
            'directors': event.get('directors', []),
            'genres': event.get('genres', []),
            'id': item_id
        }

        # Debugging print statements
        print(f"Generated message: {message}")

        # Pošalji poruku na SNS temu
        sns.publish(
            TopicArn=sns_topic_arn,
            Message=json.dumps(message),
            Subject='New Video Uploaded'
        )

        # Kreiraj odgovor
        response = {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Successfully uploaded file and sent notification',
                'key': key,  # Vraćamo generisani ključ kao deo odgovora
                'id': item_id  # Vraćamo numerički ID kao deo odgovora
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        return response

    except Exception as e:
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'An error occurred', 'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
