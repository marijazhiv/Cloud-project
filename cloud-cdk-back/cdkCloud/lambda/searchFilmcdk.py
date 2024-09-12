import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
from decimal import Decimal


def searchFilmcdk(event, context):
    # Ekstrakcija parametara za pretragu iz događaja
    title = event.get('title', None)
    description = event.get('description', None)
    actors = event.get('actors', [])
    directors = event.get('directors', [])
    genres = event.get('genres', [])

    # Kreiranje DynamoDB klijenta
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Movies')  # Zamenite sa imenom vaše tabele

    # Priprema za optimizaciju
    use_query = False
    combined_key = None

    # Ako su prisutni svi parametri, koristi kombinovani ključ za query
    if title and description and actors and directors and genres:
        # Spajanje stringova prema željenom formatu
        actors_str = "!".join(actors)  # Spajanje liste 'actors' sa '!'
        directors_str = "*".join(directors)  # Spajanje liste 'directors' sa '*'
        genres_str = ",".join(genres)  # Spajanje liste 'genres' sa ','

        # Kreiranje search_key-a prema željenom formatu
        search_key = f"{title}_{description}_{actors_str}_{directors_str}_{genres_str}"
        use_query = True

    try:
        if use_query:
            # Query sa kombinovanim ključem
            print(f"Index Name: SearchKeyIndex")
            print(f"Search Key: {search_key}")
            response = table.query(
                IndexName='SearchKey-index',
                KeyConditionExpression=Key('SearchKey').eq(search_key)
            )
            print(f"Query Response: {response}")
            items = response.get('Items', [])
        else:
            # Filterisani scan
            filters = []
            if title:
                filters.append(Attr('Title').contains(title))
            if description:
                filters.append(Attr('Description').contains(description))
            if actors:
                for actor in actors:
                    filters.append(Attr('Actors').contains(actor))  # Pretraga po svakom glumcu posebno
            if directors:
                for director in directors:
                    filters.append(Attr('Directors').contains(director))  # Pretraga po svakom režiseru
            if genres:
                for genre in genres:
                    filters.append(Attr('Genres').contains(genre))  # Pretraga po svakom žanru

            # Kombinovanje filtera pomoću AND operatora
            filter_expression = filters[0]
            for filter in filters[1:]:
                filter_expression &= filter

            # Izvršenje scan pretrage
            response = table.scan(
                FilterExpression=filter_expression
            )
            items = response.get('Items', [])

        # Konverzija Decimala u float
        for item in items:
            for key, value in item.items():
                if isinstance(value, Decimal):
                    item[key] = float(value)

        return {
            'statusCode': 200,
            'body': json.dumps(items),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE'
            }
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'An error occurred', 'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
