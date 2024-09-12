import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Observable, from } from 'rxjs';
import {environment} from "../app/environment/environment";
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@Injectable({
    providedIn: 'root',
})
export class S3UploadService {

    private s3Client: S3Client;
    private snsClient: SNSClient;
    private bucketName = 'bucket-22';
    private snsTopicArn = 'arn:aws:sns:eu-central-1:637423444446:films';

    constructor() {
        this.s3Client = new S3Client({
            region: environment.awsRegion,
            credentials: {
                accessKeyId: environment.awsAccessKeyId,
                secretAccessKey: environment.awsSecretAccessKey
            }
        });

        this.snsClient = new SNSClient({
            region: environment.awsRegion,
            credentials: {
                accessKeyId: environment.awsAccessKeyId,
                secretAccessKey: environment.awsSecretAccessKey
            }
        });
    }

    async uploadFile(file: Blob, title: string, description: string, actors: string[], directors: string[], genres: string[]): Promise<any> {
        try {
            const itemId = Math.floor(Date.now() / 1000);
            const key = `films/${itemId}.mp4`;

            // Upload file to S3 bucket
            const uploadParams = {
                Bucket: this.bucketName,
                Key: key,
                Body: file,
                ContentType: file.type
            };

            await this.s3Client.send(new PutObjectCommand(uploadParams));

            // Prepare SNS message
            const message = {
                video_key: key,
                title: title || 'Unknown Title',
                description: description || 'No Description',
                actors: actors || [],
                directors: directors || [],
                genres: genres || [],
                id: itemId
            };

            // Publish message to SNS topic
            const snsParams = {
                TopicArn: this.snsTopicArn,
                Message: JSON.stringify(message),
                Subject: 'New Video Uploaded'
            };

            await this.snsClient.send(new PublishCommand(snsParams));

            return {
                message: 'Successfully uploaded file and sent notification',
                key: key,
                id: itemId
            };
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Error uploading file or sending notification');
        }
    }
    // private s3Client: S3Client;
    //
    // constructor() {
    //     this.s3Client = new S3Client({
    //         region: environment.awsRegion,
    //         credentials: {
    //             accessKeyId: environment.awsAccessKeyId,
    //             secretAccessKey: environment.awsSecretAccessKey,
    //         },
    //     });
    // }
    //
    // uploadMovie(
    //     file: Blob,
    //     title: string,
    //     description: string,
    //     actors: string[],
    //     directors: string[],
    //     genres: string[]
    // ): Observable<any> {
    //     const itemId = Date.now(); // Koristi timestamp za generisanje numeričkog ID-ja
    //
    //     const params = {
    //         Bucket: environment.s3BucketName,
    //         Key: `films/${itemId}.mp4`, // Generiši ključ koristeći numerički ID
    //         Body: file,
    //         message: {
    //             title,
    //             description,
    //             actors: JSON.stringify(actors),
    //             directors: JSON.stringify(directors),
    //             genres: JSON.stringify(genres),
    //             item_id: itemId.toString(),
    //         },
    //     };
    //
    //     const command = new PutObjectCommand(params);
    //
    //     return from(this.s3Client.send(command));
    // }
}
