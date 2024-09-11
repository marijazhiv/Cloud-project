import json
import os
import boto3
from boto3.dynamodb.conditions import Key

# Inicijalizacija DynamoDB resursa
dynamodb = boto3.resource('dynamodb')
subscriptions_table_name = os.getenv('SUBSCRIPTIONS_TABLE_NAME')
#table = dynamodb.Table('MovieSubscriptions')  # Ovde zamenite 'Subscriptions' sa stvarnim imenom tabele

table = dynamodb.Table(subscriptions_table_name)


def delete_movie_subscription(event, context):
    try:
        body = json.loads(event.get('body', '{}'))

        subscription_id = event.get('subscription_id')

        if not subscription_id:
            raise ValueError("Subscription ID je obavezan.")

        # Brisanje stavke iz DynamoDB
        table.delete_item(
            Key={'id': subscription_id}
        )

        # Kreiranje odgovora
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Pretplata je uspešno obrisana.'}),
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
