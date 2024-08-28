// src/app/services/s3.service.ts
import { Injectable } from '@angular/core';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class S3Service {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: environment.awsRegion,
            credentials: {
                accessKeyId: environment.awsAccessKeyId,
                secretAccessKey: environment.awsSecretAccessKey,
            },
        });
    }

    // Metod za preuzimanje fajla kao Blob
    downloadFile(bucketName: string, key: string): Observable<Blob> {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        return from(this.s3Client.send(command).then(response => {
            if (response.Body instanceof ReadableStream) {
                return this.streamToBlob(response.Body);
            } else {
                throw new Error('Response body is not a readable stream');
            }
        }));
    }

    // Metod za generisanje URL-a za preuzimanje fajla
    async getFileUrl(bucketName: string, fileName: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileName,
        });
        const response = await this.s3Client.send(command);

        if (response.Body instanceof ReadableStream) {
            const blob = await this.streamToBlob(response.Body);
            return URL.createObjectURL(blob);
        } else {
            throw new Error('Response body is not a readable stream');
        }
    }

    // Funkcija za konverziju ReadableStream u Blob
    private async streamToBlob(stream: ReadableStream): Promise<Blob> {
        const reader = stream.getReader();
        const chunks = [];
        let result;

        while (!(result = await reader.read()).done) {
            chunks.push(result.value);
        }

        return new Blob(chunks);
    }
}