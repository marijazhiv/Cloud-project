import boto3
import json

# Inicijalizacija S3 i DynamoDB
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table_name = "Movies"
table = dynamodb.Table(table_name)

# Definiši ime S3 bucket-a
s3_bucket_name = "bucket-22-cdk"


def delete_film_video_and_info(event, context):
    try:
        # Parsiranje ID-a filma iz događaja
        item_id = event.get('id')
        if item_id is None:
            raise ValueError("ID filma je obavezan")

        # Pretraga metapodataka u DynamoDB
        response = table.get_item(Key={'id': int(item_id)})
        item = response.get('Item')

        if not item:
            raise ValueError("Film sa datim ID-om ne postoji")

        # Brisanje sadržaja sa S3
        video_key = item.get('VideoKey')
        if video_key:
            s3.delete_object(Bucket=s3_bucket_name, Key=video_key)
            print(f"Obrisan objekat sa S3: {video_key}")

        # Brisanje metapodataka iz DynamoDB
        table.delete_item(Key={'id': int(item_id)})
        print(f"Obrisan film sa ID-om: {item_id}")

        response = {
            'statusCode': 200,
            'body': json.dumps({'message': 'Film je uspešno obrisan'}),
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
