import boto3
import uuid
import json 
s3_bucket_name = "bucket-22"   

def upload_movie(event, context):
    try:
        # Extract binary file data from the event
        file_data = event['body']
        
        # Generate a unique key using UUID
        key = str(uuid.uuid4()) + ".mp4"  # Dodaj ".mp4" ekstenziju
        
        # Create S3 client
        s3 = boto3.client('s3')
        
        # Upload the file to S3 bucket
        s3.put_object(Body=file_data, Bucket=s3_bucket_name, Key=key)
        
        # Create response
        response = {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Successfully uploaded file',
                'key': key  # Dodajemo generisani ključ u odgovor
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
