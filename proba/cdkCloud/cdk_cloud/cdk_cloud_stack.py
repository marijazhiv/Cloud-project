from aws_cdk import (
    # Duration,
    Stack,
    aws_s3 as s3,
    aws_dynamodb as dynamodb,
    aws_sns as sns,
    aws_sqs as sqs,
    aws_iam as iam,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
    aws_sns_subscriptions as subs
)
from constructs import Construct

class CdkCloudStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        #kreiranje s3 bucketa
        bucket = s3.Bucket(self, "MoviesBucket", bucket_name="bucket-22-cdk")

        # tabela za skladistenje podataka o filmu (Test)
        table = dynamodb.Table(
            self, "MoviesMetadataTable",
            table_name="Movies",
            partition_key={"name": "id", "type": dynamodb.AttributeType.NUMBER}
        )

        # tabela za skladistenje subskripcija (MovieSubscriptions)
        subscriptions_table = dynamodb.Table(
            self, "SubscriptionsTable",
            table_name="MovieSubscriptions",
            partition_key={"name": "id", "type": dynamodb.AttributeType.NUMBER}
        )

        # sns topic za slanje messages o podacima filma
        topic = sns.Topic(self, "MoviesTopic", topic_name="movies")

        # sqs queue za slanje email notifikacija za pretplatu
        queue = sqs.Queue(self, "EmailNotificationQueue2")

        # Create the Lambda execution role with necessary permissions
        lambda_role = iam.Role(
            self, "LambdaExecutionRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com")
        )

        # Attach policies to the role for accessing necessary AWS resources
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AWSLambdaBasicExecutionRole")
        )
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("AmazonS3FullAccess")
        )
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("AmazonDynamoDBFullAccess")
        )
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("AmazonSNSFullAccess")
        )
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("AmazonSQSFullAccess")
        )

        # Grant necessary permissions to the Lambda functions
        bucket.grant_read_write(lambda_role)
        table.grant_full_access(lambda_role)
        subscriptions_table.grant_full_access(lambda_role)
        topic.grant_publish(lambda_role)
        queue.grant_send_messages(lambda_role)

        # Lambda function for uploading movies
        upload_movie_function = _lambda.Function(
            self, "UploadMovieFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="upload_movie1.upload_movie1",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "S3_BUCKET_NAME": bucket.bucket_name,
                "SNS_TOPIC_ARN": topic.topic_arn
            },
            role=lambda_role
        )

        # API Gateway REST API koji poziva Lambda funkciju
        api = apigateway.LambdaRestApi(
            self, "UploadMovieAPI",
            handler=upload_movie_function,
            proxy=False  # Omogućava ti da definišeš specifične rute
        )

        # Dodavanje PUT rute na /upload putanju
        movies_resource = api.root.add_resource("upload")
        movies_resource.add_method("PUT")  # HTTP POST metoda za pozivanje Lambda funkcije

        # Lambda function for processing movie metadata
        # process_movie_metadata_function = _lambda.Function(
        #     self, "ProcessMovieMetadataFunction",
        #     runtime=_lambda.Runtime.PYTHON_3_9,
        #     handler="test.test",
        #     code=_lambda.Code.from_asset("lambda"),
        #     environment={
        #         "S3_BUCKET_NAME": bucket.bucket_name,
        #         "TABLE_NAME": table.table_name,
        #         "SQS_QUEUE_URL": queue.queue_url,
        #         "SUBSCRIPTIONS_TABLE_NAME": subscriptions_table.table_name
        #     },
        #role = lambda_role
        # )

        # SNS subscription to trigger the processing Lambda function
        # topic.add_subscription(subs.LambdaSubscription(process_movie_metadata_function))
