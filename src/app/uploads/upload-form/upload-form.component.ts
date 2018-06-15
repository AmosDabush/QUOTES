// change profile picture 
//upload pic to db and set as new profile picture

import { Component } from '@angular/core';
import { UploadService } from '../shared/upload.service';
import { Upload } from '../shared/upload';

@Component({
  selector: 'upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
})
export class UploadFormComponent {

  selectedFiles: FileList | null;
  currentUpload: Upload;

  constructor(private upSvc: UploadService) { }

  detectFiles($event: Event) {
      this.selectedFiles = ($event.target as HTMLInputElement).files;
  }

  uploadSingle1() {
    const onChanged = (e) => {
     const file =  e.currentTarget.file;
    // const file = this.selectedFiles;
    if (file && file.length === 1 && file.type.match('image.*')) {
      this.currentUpload = new Upload(file.item(0));
      this.upSvc.pushUpload(this.currentUpload);
    } else {
      console.error('No file found!');
    }
  }
  }


  uploadSingle() {

    
    const file = this.selectedFiles;
    if (file && file.length === 1) {
          if (file.item(0).type.match('image.*')) {console.log('pic')
            this.currentUpload = new Upload(file.item(0));
            this.upSvc.pushUpload(this.currentUpload);
          } else {
          alert('only img file can e uploaded!');
        }
    } else {
      console.error('No file found!');
    }
  }

  uploadMulti() {
    const files = this.selectedFiles;
    if (!files || files.length === 0) {
      console.error('No Multi Files found!');
      return;
    }

    Array.from(files).forEach((file) => {
      this.currentUpload = new Upload(file);
      this.upSvc.pushUpload(this.currentUpload);
    });
  }
}
