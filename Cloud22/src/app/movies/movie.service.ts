import { Injectable } from '@angular/core';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import {environment} from "../environment/environment";

@Injectable({
    providedIn: 'root'
})
export class LambdaService {
    private lambdaClient: LambdaClient;

    constructor() {
        this.lambdaClient = new LambdaClient({
            region: environment.awsRegion,
            credentials: {
                accessKeyId: environment.awsAccessKeyId,
                secretAccessKey: environment.awsSecretAccessKey
            }
        });
    }

    async searchContent(params: any): Promise<any> {
        try {
            const command = new InvokeCommand({
                FunctionName: 'searchMovies',
                Payload: JSON.stringify(params),
            });

            const response = await this.lambdaClient.send(command);
            return JSON.parse(new TextDecoder().decode(response.Payload));
        } catch (error) {
            console.error('Error invoking Lambda function:', error);
            throw error;
        }
    }

    async deleteContent(id: number): Promise<any> {
        try {
            const command = new InvokeCommand({
                FunctionName: 'deleteMovie',
                Payload: JSON.stringify({ id: id }),
            });

            const response = await this.lambdaClient.send(command);
            return JSON.parse(new TextDecoder().decode(response.Payload));
        } catch (error) {
            console.error('Error invoking delete Lambda function:', error);
            throw error;
        }
    }

    async getSubscriptions(username: string): Promise<any> {
        try {
            const command = new InvokeCommand({
                FunctionName: 'getSubscriptions',
                Payload: JSON.stringify({ username: username }),
            });

            const response = await this.lambdaClient.send(command);
            return JSON.parse(new TextDecoder().decode(response.Payload));
        } catch (error) {
            console.error('Error invoking getSubscriptions Lambda function:', error);
            throw error;
        }
    }

    async updateSubscription(subscription_id: string, subscription_value: string): Promise<any> {
        try {
            const command = new InvokeCommand({
                FunctionName: 'updateSubscration',
                Payload: JSON.stringify({
                    subscription_id: subscription_id,
                    subscription_value: subscription_value,
                }),
            });

            const response = await this.lambdaClient.send(command);
            return JSON.parse(new TextDecoder().decode(response.Payload));
        } catch (error) {
            console.error('Error invoking updateSubscription Lambda function:', error);
            throw error;
        }
    }

    async deleteSubscription(subscription_id: string): Promise<any> {
        try {
            const command = new InvokeCommand({
                FunctionName: 'deleteSub',
                Payload: JSON.stringify({
                    subscription_id: subscription_id
                }),
            });

            const response = await this.lambdaClient.send(command);
            return JSON.parse(new TextDecoder().decode(response.Payload));
        } catch (error) {
            console.error('Error invoking deleteSub Lambda function:', error);
            throw error;
        }
    }

    async rateMovie(film_id: string, username: string, rating: number): Promise<any> {
        try {
            const command = new InvokeCommand({
                FunctionName: 'rateMovie',
                Payload: JSON.stringify({
                    film_id: film_id,
                    username: username,
                    rating: rating
                }),
            });

            const response = await this.lambdaClient.send(command);
            return JSON.parse(new TextDecoder().decode(response.Payload));
        } catch (error) {
            console.error('Error invoking rateMovie Lambda function:', error);
            throw error;
        }
    }


}
