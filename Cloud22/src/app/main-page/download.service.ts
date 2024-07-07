import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DownloadService {

    private apiUrl = 'https://5ovy3i5nz9.execute-api.eu-central-1.amazonaws.com/stage-22/download_file';

    constructor(private http: HttpClient) { }

    getDownloadUrl(fileId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${fileId}`);
    }
}
