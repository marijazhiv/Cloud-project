import json
import os
import boto3
from urllib.parse import unquote

dynamodb = boto3.resource('dynamodb')
s3_bucket_name = "bucket-22"  # Replace with your S3 bucket name

def download_object(event, context):
    try:
        path = event['pathParameters']['id']
    except KeyError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Path parameter id is missing'}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        }

    path = unquote(path)
    
    s3 = boto3.client('s3')
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': s3_bucket_name, 'Key': path},
        ExpiresIn=3600  # The URL will be valid for 1 hour
    )

    body = {
        'url': url,
    }

    response = {
        'statusCode': 200,
        'body': json.dumps(body),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    }

    return response