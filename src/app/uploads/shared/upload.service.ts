import { Injectable } from '@angular/core';
import { Upload } from './upload';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { UsersModule } from '../../users/users.module';
import { UserService } from '../../users/user.service';
// import { AuthService } from '../core/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class UploadService {

  basePath = 'uploads';
  uploadsRef: AngularFireList<Upload>;
  uploads: Observable<Upload[]>;
  currentUserUid="";
  currentUserName="";
  currentUserPhotoURL=""

  constructor(private db: AngularFireDatabase,
              // public auth: AuthService,
              private userService: UserService,
              private afAuth: AngularFireAuth,) { 


                  
  if(this.afAuth.auth.currentUser){
       this.currentUserUid=this.afAuth.auth.currentUser.uid;
       if(this.afAuth.auth.currentUser.displayName)
            this.currentUserName=this.afAuth.auth.currentUser.displayName;
       if(this.afAuth.auth.currentUser.photoURL)
            this.currentUserPhotoURL=this.afAuth.auth.currentUser.photoURL;
    }
    else
        console.error("NULL ID")   
              }
  
  getUploads() {
    this.uploads = this.db.list(this.basePath).snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.val();
        const $key = a.payload.key;
        return { $key, ...data };
      });
    });
    return this.uploads;
  }

  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.$key)
    .then( () => {
      this.deleteFileStorage(upload.name);
    })
    .catch((error) => console.log(error));
  }

  // Executes the file uploading to firebase
  pushUpload(upload: Upload) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) =>  {
        // upload in progress
        const snap = snapshot;
        upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        if (uploadTask.snapshot.downloadURL) {
          upload.url = uploadTask.snapshot.downloadURL;
          upload.name = upload.file.name;
          console.log("upload.url")     
               console.log(upload.url)
          this.userService.updateUser(this.currentUserUid, { photoURL: upload.url })
          this.saveFileData(upload);
          return;
        } else {
          console.error('No download URL!');
        }
      },
    );
  }

  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload);
  }

  // Writes the file details to the realtime db
  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }
}
