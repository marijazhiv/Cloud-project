from aws_cdk import (
    # Duration,
    Stack,
    aws_s3 as s3,
    aws_dynamodb as dynamodb,
    aws_sns as sns,
    #aws_cognito as cognito,
    aws_sqs as sqs,
    aws_iam as iam,
    aws_lambda as _lambda,
    aws_apigateway as apigateway,
    aws_sns_subscriptions as subs, Duration,
    aws_lambda_event_sources as event_sources
)
from constructs import Construct

class CdkCloudStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        #kreiranje s3 bucketa
        bucket = s3.Bucket(self, "MoviesBucket", bucket_name="bucket-22-cdk",
                           cors=[s3.CorsRule(
                               allowed_origins=["*"],  # Omogućava pristup sa svih domena
                               allowed_methods=[s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST,
                                                s3.HttpMethods.DELETE, s3.HttpMethods.HEAD],
                               # Omogućava sve HTTP metode
                               allowed_headers=["*"],  # Omogućava sve zaglavlja
                               max_age=3600  # Maksimalno vreme keširanja (u sekundama)
                           )]
                           )

        # tabela za skladistenje podataka o filmu (Test)
        table = dynamodb.Table(
            self, "MoviesMetadataTable",
            table_name="Movies",
            partition_key={"name": "id", "type": dynamodb.AttributeType.NUMBER}
        )

        # Dodavanje indeksa za pretragu
        table.add_global_secondary_index(
            index_name="SearchKey-index",
            partition_key={"name": "SearchKey", "type": dynamodb.AttributeType.STRING},
            projection_type=dynamodb.ProjectionType.ALL
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
        lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name("AmazonSESFullAccess")
        )

        # # Cognito User Pool
        # user_pool = cognito.UserPool(
        #     self, "UserPool",
        #     user_pool_name="MyUserPool",
        #     self_sign_up_enabled=True,  # Omogućava korisnicima da se sami registruju
        #     auto_verify=cognito.AutoVerifiedAttrs(email=True),  # Verifikacija email adrese
        #     sign_in_aliases=cognito.SignInAliases(email=True),  # Prijava putem email-a
        #     password_policy=cognito.PasswordPolicy(
        #         min_length=8,
        #         require_lowercase=True,
        #         require_uppercase=True,
        #         require_digits=True,
        #         require_symbols=True
        #     ),
        #     account_recovery=cognito.AccountRecovery.EMAIL_ONLY
        # )
        #
        # # Cognito User Pool Client
        # user_pool_client = user_pool.add_client(
        #     "UserPoolClient",
        #     user_pool_client_name="MyAppClient",
        #     auth_flows=cognito.AuthFlow(
        #         user_password=True,
        #         user_srp=True
        #     ),
        #     generate_secret=False  # Ako je mobilna aplikacija, možeš koristiti secret key
        # )
        #
        # # Cognito Identity Pool
        # identity_pool = cognito.CfnIdentityPool(
        #     self, "IdentityPool",
        #     allow_unauthenticated_identities=False,  # Samo autentifikovani korisnici
        #     cognito_identity_providers=[
        #         cognito.CfnIdentityPool.CognitoIdentityProviderProperty(
        #             client_id=user_pool_client.user_pool_client_id,
        #             provider_name=user_pool.user_pool_provider_name
        #         )
        #     ]
        # )
        #
        # # IAM Role for authenticated users
        # authenticated_role = iam.Role(
        #     self, "CognitoDefaultAuthenticatedRole",
        #     assumed_by=iam.FederatedPrincipal(
        #         "cognito-identity.amazonaws.com",
        #         conditions={
        #             "StringEquals": {"cognito-identity.amazonaws.com:aud": identity_pool.ref},
        #             "ForAnyValue:StringLike": {"cognito-identity.amazonaws.com:amr": "authenticated"}
        #         },
        #         assume_role_action="sts:AssumeRoleWithWebIdentity"
        #     ),
        #     managed_policies=[
        #         iam.ManagedPolicy.from_aws_managed_policy_name("AmazonS3FullAccess"),
        #         iam.ManagedPolicy.from_aws_managed_policy_name("AmazonDynamoDBFullAccess"),
        #     ]
        # )
        #
        # # IAM Role for unauthenticated users
        # unauthenticated_role = iam.Role(
        #     self, "CognitoDefaultUnauthenticatedRole",
        #     assumed_by=iam.FederatedPrincipal(
        #         "cognito-identity.amazonaws.com",
        #         conditions={
        #             "StringEquals": {"cognito-identity.amazonaws.com:aud": identity_pool.ref},
        #             "ForAnyValue:StringLike": {"cognito-identity.amazonaws.com:amr": "unauthenticated"}
        #         },
        #         assume_role_action="sts:AssumeRoleWithWebIdentity"
        #     )
        # )
        #
        # # Attach roles to the Identity Pool
        # cognito.CfnIdentityPoolRoleAttachment(
        #     self, "IdentityPoolRoleAttachment",
        #     identity_pool_id=identity_pool.ref,
        #     roles={
        #         "authenticated": authenticated_role.role_arn,
        #         "unauthenticated": unauthenticated_role.role_arn
        #     }
        # )
        #
        # # Create user groups (e.g., Admin, User)
        # admin_group = cognito.CfnUserPoolGroup(
        #     self, "AdminGroup",
        #     group_name="Admin",
        #     user_pool_id=user_pool.user_pool_id,
        #     role_arn=authenticated_role.role_arn
        # )
        #
        # guest_group = cognito.CfnUserPoolGroup(
        #     self, "GuestGroup",
        #     group_name="Guest",
        #     user_pool_id=user_pool.user_pool_id,
        #     role_arn=unauthenticated_role.role_arn
        # )

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
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        # API Gateway REST API koji poziva Lambda funkciju
        api = apigateway.LambdaRestApi(
            self, "UploadMovieAPI",
            handler=upload_movie_function,
            proxy=False,  # Omogućava ti da definišeš specifične rute
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
                allow_headers=apigateway.Cors.DEFAULT_HEADERS,
                max_age=Duration.days(1)
            )
        )

        # Dodavanje PUT rute na /upload putanju
        movies_resource = api.root.add_resource("upload")
        movies_resource.add_method("PUT")  # HTTP POST metoda za pozivanje Lambda funkcije

        # Lambda function for processing movie metadata
        process_movie_metadata_function = _lambda.Function(
             self, "ProcessMovieMetadataFunction",
             runtime=_lambda.Runtime.PYTHON_3_9,
             handler="upload_meta.upload_meta",
             code=_lambda.Code.from_asset("lambda"),
            role=lambda_role,
             environment={
                 "S3_BUCKET_NAME": bucket.bucket_name,
                 "TABLE_NAME": table.table_name,
                 "SQS_QUEUE_URL": queue.queue_url,
                 "SUBSCRIPTIONS_TABLE_NAME": subscriptions_table.table_name
             }
         )

        # SNS subscription to trigger the processing Lambda function
        topic.add_subscription(subs.LambdaSubscription(process_movie_metadata_function))

        # Lambda funkcija za slanje email notifikacija
        send_email_function = _lambda.Function(
            self, "SendEmailFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="send_email.send_email",
            code=_lambda.Code.from_asset("lambda"),
            role=lambda_role,
            environment={
                "SQS_QUEUE_URL": queue.queue_url
            },
            #timeout=Duration.minutes(5)
        )

        # Povezivanje SQS reda sa send_email_function koristeći SqsEventSource
        send_email_function.add_event_source(
            event_sources.SqsEventSource(queue)
            #visibility_timeout=Duration.seconds(300)
        )

        # Lambda function for subscribing to movie content
        subscribe_to_movie_content_function = _lambda.Function(
            self, "SubscribeToMovieContentFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="subscribeToMovieContent.subscribeToMovieContent",
            code=_lambda.Code.from_asset("lambda"),
            role=lambda_role,
            environment={
                "SUBSCRIPTIONS_TABLE_NAME": subscriptions_table.table_name,
                "SNS_TOPIC_ARN": topic.topic_arn
            },
            timeout=Duration.minutes(3)
        )

        # API Gateway POST metoda za pretplatu na filmski sadržaj
        subscribe_resource = api.root.add_resource("subscribe")
        subscribe_resource.add_method(
            "POST",
            apigateway.LambdaIntegration(subscribe_to_movie_content_function)
        )

        # Lambda funkcija za preuzimanje filma
        download_function0 = _lambda.Function(
            self, "DownloadFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="download_function.download_function",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "S3_BUCKET_NAME": bucket.bucket_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        download_resource = api.root.add_resource("download")
        id_resource = download_resource.add_resource("{id}")
        id_resource.add_method(
            "GET",
            apigateway.LambdaIntegration(download_function0)
        )

        # Lambda funkcija za pretragu sadržaja
        search_content_function = _lambda.Function(
            self, "SearchContentFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="searchFilmcdk.searchFilmcdk",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "TABLE_NAME": table.table_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        search_resource = api.root.add_resource("search")
        search_resource.add_method(
            "GET",
            apigateway.LambdaIntegration(search_content_function)
        )

        delete_movie_subscription_function = _lambda.Function(
            self, "DeleteMovieSubscriptionFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="delete_movie_subscription.delete_movie_subscription",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "SUBSCRIPTIONS_TABLE_NAME": subscriptions_table.table_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        get_movie_subscription_function = _lambda.Function(
            self, "GetMovieSubscriptionFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="get_movie_subscriptions.get_movie_subscriptions",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "SUBSCRIPTIONS_TABLE_NAME": subscriptions_table.table_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        update_movie_subscription_function = _lambda.Function(
            self, "UpdateMovieSubscriptionFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="update_movie_subscription.update_movie_subscription",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "SUBSCRIPTIONS_TABLE_NAME": subscriptions_table.table_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        # Kreiramo resurs /subscriptions
        subscriptions_resource = api.root.add_resource("subscriptions")

        # POST za kreiranje pretplate (već postoji)
        # ...

        # GET za preuzimanje pretplate
        #subscription_id_resource = subscriptions_resource.add_resource("{id}")
        subscriptions_resource.add_method(
            "GET",
            apigateway.LambdaIntegration(get_movie_subscription_function)
        )

        # DELETE za brisanje pretplate
        subscriptions_resource.add_method(
            "DELETE",
            apigateway.LambdaIntegration(delete_movie_subscription_function)
        )

        # PUT za ažuriranje pretplate
        subscriptions_resource.add_method(
            "PUT",
            apigateway.LambdaIntegration(update_movie_subscription_function)
        )

        # Kreiramo Lambda funkciju za brisanje filma
        delete_movie_function = _lambda.Function(
            self, "DeleteMovieFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="delete_film_video_and_info.delete_film_video_and_info",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "MOVIES_TABLE_NAME": table.table_name,
                "S3_BUCKET_NAME": bucket.bucket_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        # Kreiramo resurs /movie
        movie_resource = api.root.add_resource("movie")

        # DELETE metoda za brisanje filma
        #movie_id_resource = movie_resource.add_resource("{id}")
        movie_resource.add_method(
            "DELETE",
            apigateway.LambdaIntegration(delete_movie_function)
        )

        # # Uvoz postojećeg Cognito User Pool-a pomoću ID-a
        # user_pool = cognito.UserPool.from_user_pool_id(
        #     self,
        #     "ImportedUserPool",
        #     user_pool_id="tvoj_user_pool_id"  # Zameni sa stvarnim ID-jem tvog User Pool-a
        # )
        #
        # # Uvoz postojećeg Cognito User Pool Client-a pomoću ID-a
        # user_pool_client = cognito.UserPoolClient.from_user_pool_client_id(
        #     self,
        #     "ImportedUserPoolClient",
        #     user_pool_client_id="tvoj_user_pool_client_id"  # Zameni sa stvarnim ID-jem tvog User Pool Client-a
        # )

        feed_table = dynamodb.Table(
            self, "FeedContentTable",
            table_name="Proba",
            partition_key={"name": "id", "type": dynamodb.AttributeType.NUMBER}
        )

        # Kreiramo Lambda funkciju za preuzimanje feed-a
        get_feed_function = _lambda.Function(
            self, "GetFeedFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="get_feed.get_feed",  # putanja do handlera u vašoj lambda funkciji
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "FEED_TABLE_NAME": feed_table.table_name,  # Ime DynamoDB tabele za feed
                "TEST_TABLE_NAME": table.table_name,  # Ime tabele koja sadrži podatke o filmovima
                "S3_BUCKET_NAME": bucket.bucket_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        # Kreiramo resurs /feed
        feed_resource = api.root.add_resource("feed")

        # GET metoda za preuzimanje feed-a
        feed_resource.add_method(
            "GET",
            apigateway.LambdaIntegration(get_feed_function)
        )

        get_movies_function = _lambda.Function(
            self, "GetMoviesFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="get_movie.get_all_movies_metadata",  # putanja do handlera u vašoj lambda funkciji
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "TEST_TABLE_NAME": table.table_name,
                "S3_BUCKET_NAME": bucket.bucket_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        get_movie_resource = api.root.add_resource("get-movie")

        get_movie_resource.add_method(
            "GET",
            apigateway.LambdaIntegration(get_movies_function)
        )

        movie_update_function = _lambda.Function(
            self, "MovieUpdateFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="movieUpdate.update_movie",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "TEST_TABLE_NAME": table.table_name,
                "S3_BUCKET_NAME": bucket.bucket_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        # DELETE metoda za brisanje filma
        # movie_id_resource = movie_resource.add_resource("{id}")
        movie_resource.add_method(
            "PUT",
            apigateway.LambdaIntegration(movie_update_function)
        )

        movie_rate_function = _lambda.Function(
            self, "MovieRateFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="movieRate.rate_movie",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "FEED_TABLE_NAME": feed_table.table_name,
                "S3_BUCKET_NAME": bucket.bucket_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )

        rate_movie_resource = api.root.add_resource("reviews")

        rate_movie_resource.add_method(
            "POST",
            apigateway.LambdaIntegration(movie_rate_function)
        )

        add_to_group_function = _lambda.Function(
            self, "AddUserToGroupFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="add_user_to_group.lambda_handler",
            code=_lambda.Code.from_asset("lambda"),
            environment={
                "FEED_TABLE_NAME": feed_table.table_name,
                "S3_BUCKET_NAME": bucket.bucket_name
            },
            role=lambda_role,
            timeout=Duration.minutes(5)
        )










