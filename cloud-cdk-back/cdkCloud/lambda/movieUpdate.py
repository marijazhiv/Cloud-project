import boto3
import json

# Inicijalizacija DynamoDB resursa
dynamodb = boto3.resource('dynamodb')
table_name = "Test"
table = dynamodb.Table(table_name)


def update_movie(event, context):
    try:
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            body = event  # Podaci su direktno u event

        print(f"Primljeni podaci: {body}")

        item_id = int(body.get('id'))
        title = body.get('title')
        description = body.get('description')
        actors = body.get('actors', [])
        print(actors)
        directors = body.get('directors', [])
        genres = body.get('genres', [])

        # Provera da li su svi neophodni podaci dostavljeni
        if not item_id:
            raise ValueError("ID i naslov filma su obavezni")

        # Preuzimanje trenutnih vrednosti iz DynamoDB
        current_item = table.get_item(Key={'id': item_id}).get('Item', {})
        current_title = current_item.get('Title', '')
        current_description = current_item.get('Description', '')
        current_actors = current_item.get('Actors', [])
        print(current_actors)
        current_directors = current_item.get('Directors', [])
        current_genres = current_item.get('Genres', [])

        # Koristimo trenutne vrednosti za ažuriranje
        update_expression = "set "
        expression_attribute_values = {}

        if title != '':
            update_expression += "Title = :t, "
            expression_attribute_values[':t'] = title
        else:
            title = current_title

        if description != '':
            update_expression += "Description = :d, "
            expression_attribute_values[':d'] = description
        else:
            description = current_description

        if len(actors) != 0:
            update_expression += "Actors = :a, "
            expression_attribute_values[':a'] = actors
        else:
            actors = current_actors

        if len(directors) != 0:
            update_expression += "Directors = :dir, "
            expression_attribute_values[':dir'] = directors
        else:
            directors = current_directors

        if len(genres) != 0:
            update_expression += "Genres = :g, "
            expression_attribute_values[':g'] = genres
        else:
            genres = current_genres

        # Kreiranje search_key-a
        actors_str = "!".join(actors)
        directors_str = "*".join(directors)
        genres_str = ",".join(genres)
        search_key = f"{title}_{description}_{actors_str}_{directors_str}_{genres_str}"

        # Dodavanje search_key u UpdateExpression
        update_expression += "SearchKey = :skey"
        expression_attribute_values[':skey'] = search_key

        # Uklanjanje poslednjeg zareza iz UpdateExpression
        update_expression = update_expression.rstrip(', ')

        # Ažuriranje podataka u tabeli
        response = table.update_item(
            Key={'id': item_id},
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues="UPDATED_NEW"
        )

        # Povratni odgovor
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Film uspešno ažuriran',
                'updatedAttributes': response['Attributes']
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }

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
            'body': json.dumps({'message': 'Došlo je do greške', 'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
