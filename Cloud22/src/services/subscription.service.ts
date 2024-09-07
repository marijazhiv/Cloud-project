import { Injectable } from '@angular/core';
import { SESClient, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { from, Observable } from 'rxjs';
import {environment} from "../app/environment/environment";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private sesClient: SESClient;
    private dynamoDbClient: DynamoDBClient;

    constructor() {
        this.sesClient = new SESClient({
            region: environment.awsRegion,
            credentials: {
                accessKeyId: environment.awsAccessKeyId,
                secretAccessKey: environment.awsSecretAccessKey,
            }
        });

        this.dynamoDbClient = new DynamoDBClient({
            region: environment.awsRegion,
            credentials: {
                accessKeyId: environment.awsAccessKeyId,
                secretAccessKey: environment.awsSecretAccessKey,
            }
        });
    }

    // Funkcija za slanje verifikacionog emaila
    sendVerificationEmail(email: string): Observable<any> {
        const command = new VerifyEmailIdentityCommand({
            EmailAddress: email
        });

        return from(this.sesClient.send(command));
    }

    // Funkcija za čuvanje pretplate u DynamoDB
    saveSubscription(username: string, subscriptionType: string, subscriptionValue: string, email: string): Observable<any> {
        const timestamp = Math.floor(Date.now() / 1000);  // Timestamp kao ID

        const command = new PutItemCommand({
            TableName: 'Subscriptions',
            Item: {
                id: { N: timestamp.toString() },  // Numerički tip
                username: { S: username },
                subscription_type: { S: subscriptionType },
                subscription_value: { S: subscriptionValue },
                email: { S: email }
            }
        });

        return from(this.dynamoDbClient.send(command));
    }
}
