import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

# Inicijalizacija S3 i DynamoDB klijenata
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

# Naziv DynamoDB tabele
table_name = "Test"  # Ime tvoje DynamoDB tabele
table = dynamodb.Table(table_name)

# Definiši ime S3 bucket-a
s3_bucket_name = "bucket-22"  # Zameni sa imenom svog S3 bucket-a
s3_folder_path = "films/"  # Putanja do foldera u S3 bucket-u


def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def get_all_movies_metadata(event, context):
    try:
        # Dohvatanje svih filmova iz DynamoDB-a
        response = table.scan()
        items = response['Items']

        all_movies_data = []

        for item in items:
            # Proveri da li postoji VideoKey u zapisu
            if 'VideoKey' not in item:
                continue  # Preskoči ovaj zapis ako nema VideoKey

            # Generisanje prepotpisanog URL-a za video sadržaj
            video_key = item['VideoKey']
            # Dodaj putanju do foldera pre video ključa
            full_video_key = s3_folder_path + video_key
            presigned_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': s3_bucket_name, 'Key': video_key},
                ExpiresIn=3600  # Vreme važenja URL-a (u sekundama)
            )

            # Priprema odgovora sa metapodacima i prepotpisanim URL-om
            movie_data = {
                'id': item.get('id', ''),
                'title': item.get('Title', ''),
                'description': item.get('Description', ''),
                'actors': item.get('Actors', ''),
                'directors': item.get('Directors', ''),
                'genres': item.get('Genres', ''),
                'fileSize': item.get('FileSize', ''),
                'contentType': item.get('ContentType', ''),
                'uploadTime': item.get('UploadTime', ''),
                'lastModified': item.get('LastModified', ''),
                'videoUrl': presigned_url  # Prepotpisani URL za video
            }

            all_movies_data.append(movie_data)

        return {
            'statusCode': 200,
            'body': json.dumps(all_movies_data, default=decimal_default),
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
