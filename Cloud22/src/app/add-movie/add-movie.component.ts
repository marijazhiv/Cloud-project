import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-movie',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css'
})
export class AddMovieComponent {
    myFile: any;
    fileForm: any;
    file: any;

    handleDragOver($event: DragEvent) {

    }

    onFileSelected($event: Event) {

    }

    handleDragLeave($event: DragEvent) {

    }

    uploadFile() {

    }

    handleFileSelect($event: DragEvent) {
        
    }
}
