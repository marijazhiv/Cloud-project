import boto3
import json
from decimal import Decimal

# Inicijalizacija DynamoDB i S3 klijenata
dynamodb = boto3.resource('dynamodb')
s3 = boto3.client('s3')

# Nazivi tabela i S3 bucket-a
feed_table = dynamodb.Table('FeedTable')
test_table = dynamodb.Table('Test')
s3_bucket_name = "bucket-22"
s3_folder_path = "films/"

def decimal_to_int(d):
    """Konvertuje Decimal u int ako je moguće, inače u float."""
    if isinstance(d, Decimal):
        if d % 1 == 0:
            return int(d)
        return float(d)
    raise TypeError("Objekat nije Decimal tip")

def convert_item(item):
    """Rekurzivno konvertuje Decimal vrednosti u int ili float."""
    if isinstance(item, dict):
        return {k: convert_item(v) for k, v in item.items()}
    elif isinstance(item, list):
        return [convert_item(i) for i in item]
    elif isinstance(item, Decimal):
        return decimal_to_int(item)
    else:
        return item

def get_feed(event, context):
    try:
        # Izvuci korisničko ime iz query string parametara
        username = event.get('queryStringParameters', {}).get('username', None)

        if not username:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Username is required"})
            }

        # Skeniraj celu tabelu FeedTable
        items = []
        scan_response = feed_table.scan()

        # Dobavi sve stavke, uzimajući u obzir paginaciju
        while True:
            items.extend(scan_response.get('Items', []))
            if 'LastEvaluatedKey' in scan_response:
                scan_response = feed_table.scan(ExclusiveStartKey=scan_response['LastEvaluatedKey'])
            else:
                break

        # Filtriraj stavke na osnovu korisničkog imena
        user_feed = [item for item in items if item.get('username') == username]

        if not user_feed:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": f"Feed not found for user {username}"})
            }

        # Pretpostavljamo da je user_feed lista sa jednim elementom
        user_feed = user_feed[0]

        # Konvertuj Decimal vrednosti u int ili float
        converted_item = convert_item(user_feed)

        # Filtriraj filmove i sortiraj ih prema skoru
        film_scores = converted_item.get('Feed', {})
        sorted_films = sorted(film_scores.items(), key=lambda item: item[1], reverse=True)

        # Ograniči listu na top 5 filmova
        top_5_films = sorted_films[:10]

        # Pretražuj tabelu Test da bi dobio dodatne informacije o filmovima
        film_details = []
        for film_id, score in top_5_films:
            # Pretražuj tabelu Test za film na osnovu VideoKey atributa
            scan_response = test_table.scan(FilterExpression=boto3.dynamodb.conditions.Attr('VideoKey').eq(film_id))
            items = scan_response.get('Items', [])

            if items:
                # Pretpostavljamo da je samo jedan film sa datim VideoKey
                film_info = items[0]

                # Generišemo prepotpisani URL za video iz S3
                full_video_key = s3_folder_path + film_id
                presigned_url = s3.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': s3_bucket_name, 'Key': film_id},
                    ExpiresIn=3600  # Vreme važenja URL-a u sekundama
                )

                # Izvuci samo potrebne atribute
                filtered_info = {
                    'VideoKey': film_id,
                    'Title': film_info.get('Title', ''),
                    'Description': film_info.get('Description', ''),
                    'Actors': film_info.get('Actors', []),
                    'Directors': film_info.get('Directors', []),
                    'Genres': film_info.get('Genres', []),
                    'Score': score,  # Dodaj score
                    'VideoUrl': presigned_url  # Dodaj prepotpisani URL za video
                }
                film_details.append(convert_item(filtered_info))
            else:
                # Ako nema informacija o filmu, dodaj sa samo VideoKey i error
                film_details.append({
                    'VideoKey': film_id,
                    'error': 'Film details not found'
                })

        return {
            "statusCode": 200,
            "body": json.dumps(film_details, indent=4)  # Formatiraj JSON za lakše čitanje
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
