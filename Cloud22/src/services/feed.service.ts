import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import {environment} from "../app/environment/environment";

@Injectable({
    providedIn: 'root',
})
export class FeedService {
    private lambdaClient: LambdaClient;

    constructor() {
        this.lambdaClient = new LambdaClient({
            region: environment.awsRegion,
            credentials: {
                accessKeyId: environment.awsAccessKeyId,
                secretAccessKey: environment.awsSecretAccessKey,
            },
        });
    }

    getFeed(username: string): Observable<any[]> {
        const command = new InvokeCommand({
            FunctionName: 'getFeed', // Zamenite sa nazivom vaše Lambda funkcije
            Payload: JSON.stringify({ username }), // Postavite payload koji vaša Lambda funkcija očekuje
        });

        return from(this.lambdaClient.send(command).then(response => {
            if (response.Payload) {
                // Pretvorite payload u JSON objekat
                const payload = JSON.parse(Buffer.from(response.Payload).toString());
                return payload;
            } else {
                throw new Error('No payload in response');
            }
        }));
    }
}

