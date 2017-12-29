import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { Note } from './note-model';
import { UserService } from '../users/user.service';
import { User } from '../users/user-model';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';

interface NewNote {
  content: string;
  hearts: 0;
  time: number;
}
interface NewUser {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  discription?: string;
}


@Injectable()
export class NoteService {
  user;
  userIds;
  currentUserUid=""
  currentUserName=""
  currentUserPhotoURL=""
  notesCollection: AngularFirestoreCollection<Note>;
  noteDocument:   AngularFirestoreDocument<Node>;
  usersCollection: AngularFirestoreCollection<User>;
  userDocument:   AngularFirestoreDocument<Node>;

  constructor(private afs: AngularFirestore,
              public auth: AuthService,
              private userService: UserService,
              private afAuth: AngularFireAuth) 
  {

  if(this.afAuth.auth.currentUser){
       this.currentUserUid=this.afAuth.auth.currentUser.uid;
       if(this.afAuth.auth.currentUser.displayName)
            this.currentUserName=this.afAuth.auth.currentUser.displayName;
       if(this.afAuth.auth.currentUser.photoURL)
            this.currentUserPhotoURL=this.afAuth.auth.currentUser.photoURL;     
    }
    else
        console.error("NULL ID")   
        
    console.log('uuu : '+this.currentUserUid)
    this.notesCollection = this.afs.collection(`users/${this.currentUserUid}/notes/`, (ref) => ref.orderBy('time', 'desc')/*.limit()*/ );
    this.usersCollection = this.afs.collection('users/', (ref) => ref);


  }





  getSnapshotU(): Observable<User[]> {
    ['added', 'modified', 'removed']
    return this.usersCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as User;
        console.log(data.uid);
        return { id: a.payload.doc.id, email: data.email, photoURL: data.photoURL, displayName: data.displayName, discription:data.discription,uid:data.uid  };
      });
    });
    
  }





  getData(): Observable<Note[]> {
    return this.notesCollection.valueChanges();
  }

  getSnapshot(): Observable<Note[]> {
    ['added', 'modified', 'removed']
    return this.notesCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Note;
        
        return { id: a.payload.doc.id, content: data.content, hearts: data.hearts, 
          time: data.time,authorId:data.authorId ,authorName:data.authorName,authorPhotoURL:data.authorPhotoURL};      });
    });
  }

  getNote(id: string) {
    return this.afs.doc<Note>(`users/${this.currentUserUid}/notes/${id}`);
  }

  create(content: string) {
    const note = {
      content,
      hearts: 0,
      time: new Date().getTime(),
      authorName:this.currentUserName,
      authorId:this.currentUserUid,
      authorPhotoURL:this.currentUserPhotoURL,
    };
    return this.notesCollection.add(note);
  }

  updateNote(id: string, data: Partial<Note>) {
    return this.getNote(id).update(data);
  }

  deleteNote(id: string) {
    return this.getNote(id).delete();
  }
}