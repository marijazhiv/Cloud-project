import os

import boto3
import json
from decimal import Decimal

# Inicijalizacija DynamoDB klijenta
dynamodb = boto3.resource('dynamodb')
subscriptions_table_name = os.getenv('SUBSCRIPTIONS_TABLE_NAME')
#table = dynamodb.Table('MovieSubscriptions')

table = dynamodb.Table(subscriptions_table_name)


def get_movie_subscriptions(event, context):
    try:
        username = event.get('username')

        if not username:
            raise ValueError("Username je obavezan.")

        # Pretraživanje DynamoDB tabele za sve pretplate korisnika
        response = table.query(
            IndexName='username-index',  # Ako koristiš GSI za pretragu po korisniku
            KeyConditionExpression=boto3.dynamodb.conditions.Key('username').eq(username)
        )

        subscriptions = response.get('Items', [])

        # Konvertovanje Decimal objekata u float
        def decimal_to_float(item):
            if isinstance(item, dict):
                return {k: decimal_to_float(v) for k, v in item.items()}
            elif isinstance(item, list):
                return [decimal_to_float(i) for i in item]
            elif isinstance(item, Decimal):
                return float(item)
            else:
                return item

        subscriptions = decimal_to_float(subscriptions)

        # Kreiranje odgovora
        return {
            'statusCode': 200,
            'body': json.dumps({'subscriptions': subscriptions}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }

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
