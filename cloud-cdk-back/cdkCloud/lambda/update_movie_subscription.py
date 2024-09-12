import json
import os

import boto3
from boto3.dynamodb.conditions import Key

# Inicijalizacija DynamoDB resursa
dynamodb = boto3.resource('dynamodb')
subscriptions_table_name = os.getenv('SUBSCRIPTIONS_TABLE_NAME')
#table = dynamodb.Table('MovieSubscriptions')  # Ovde zamenite 'Subscriptions' sa stvarnim imenom tabele

table = dynamodb.Table(subscriptions_table_name)

def update_movie_subscription(event, context):
    try:
        # Loguj ceo event
        print(f"Full event: {json.dumps(event)}")

        # Umesto parsiranja 'body', koristi direktno event
        subscription_id = event.get('subscription_id')
        new_subscription_value = event.get('subscription_value')

        print(f"Subscription ID: {subscription_id}, New Subscription Value: {new_subscription_value}")

        if not subscription_id or not new_subscription_value:
            raise ValueError("Subscription ID i novi subscription_value su obavezni.")

        # Ažuriranje stavke u DynamoDB
        response = table.update_item(
            Key={'id': subscription_id},
            UpdateExpression="set subscription_value = :value",
            ExpressionAttributeValues={
                ':value': new_subscription_value
            },
            ReturnValues="UPDATED_NEW"
        )

        # Kreiranje odgovora
        return {
            'statusCode': 200,
            'body': json.dumps(
                {'message': 'Pretplata je uspešno izmenjena.', 'updated_attributes': response.get('Attributes')}),
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
