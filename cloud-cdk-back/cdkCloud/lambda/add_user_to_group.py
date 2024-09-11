import json
import boto3


def lambda_handler(event, context):
    # Initialize the Cognito Identity Provider client
    client = boto3.client('cognito-idp')

    # Extract details from the event
    username = event['userName']
    user_pool_id = event['userPoolId']

    # Prepare the request parameters
    params = {
        'GroupName': 'RegisteredUser',
        'UserPoolId': user_pool_id,
        'Username': username
    }

    try:
        # Add the user to the specified group
        response = client.admin_add_user_to_group(**params)
        return {
            'statusCode': 200,
            'body': 'Sucess'
        }
    except client.exceptions.UserNotFoundException:
        return {
            'statusCode': 404,
            'body': json.dumps(f"User {username} not found in the user pool.")
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"An error occurred: {str(e)}")
        }
