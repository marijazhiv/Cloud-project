import json
import boto3

# Inicijalizuj SES klijent
ses = boto3.client('ses', region_name='eu-central-1')

def send_email(event, context):
    for record in event['Records']:
        message_body = json.loads(record['body'])
        email = message_body.get('email')
        message = message_body.get('message')

        if email and message:
            try:
                response = ses.send_email(
                    Source='zivanovicmarija895@gmail.com',
                    Destination={
                        'ToAddresses': [email]
                    },
                    Message={
                        'Subject': {
                            'Data': f"New notification for your subscription to movie content"
                        },
                        'Body': {
                            'Text': {
                                'Data': message
                            }
                        }
                    }
                )
                print(f"Poruka poslana korisniku {email}")
            except Exception as e:
                print(f"Greška pri slanju poruke: {str(e)}")
        else:
            print("Email ili poruka nedostaju u SQS poruci")

    return {
        'statusCode': 200,
        'body': json.dumps('Obrada završena')
    }
