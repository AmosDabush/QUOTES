import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { User } from './user-model';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

interface NewUser {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  discription?: string;
}

@Injectable()
export class UserService {

  usersCollection: AngularFirestoreCollection<User>;
  userDocument:   AngularFirestoreDocument<Node>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection('users', (ref) => ref);
    // this.usersCollection = this.afs.collection('users', (ref) => ref.orderBy('time', 'desc'));
  }

  getData(): Observable<User[]> {
    return this.usersCollection.valueChanges();
  }

  getSnapshot(): Observable<User[]> {
    ['added', 'modified', 'removed']
    return this.usersCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as User;
        return { id: a.payload.doc.id, email: data.email, photoURL: data.photoURL, displayName: data.displayName, discription:data.discription,uid:data.uid  };
      });
    });
  }

  getUser(id: string) {
    return this.afs.doc<User>(`users/${id}`);
  }

  // create(content: string) {
  //   const user = {
  //     content,
  //     hearts: 0,
  //     time: new Date().getTime(),
  //   };
  //   return this.usersCollection.add(user);
  // }

  updateUser(id: string, data: Partial<User>) {
    return this.getUser(id).update(data);
  }

  deleteUser(id: string) {
    return this.getUser(id).delete();
  }
}
