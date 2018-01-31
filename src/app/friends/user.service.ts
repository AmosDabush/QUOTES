import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from './user-model';
import { Note } from '../feed/note-model'
import { Friend } from './friend-model';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';


interface NewUser {
    uid: string;
    email ? : string | null;
    photoURL ? : string;
    displayName ? : string;
    discription ? : string;
}

@Injectable()
export class UserService {

    usersCollection: AngularFirestoreCollection < User > ;
    userDocument: AngularFirestoreDocument < Node > ;
    notesCollection: AngularFirestoreCollection < Note > ;
    friendsCollection: AngularFirestoreCollection < string > ;
    currentUserUid = "";

    constructor(private afs: AngularFirestore,
        private afAuth: AngularFireAuth
    ) {


        if (this.afAuth.auth.currentUser) {
            this.currentUserUid = this.afAuth.auth.currentUser.uid;
        } else
            console.error("NULL ID")


        this.usersCollection = this.afs.collection('users/', (ref) => ref);
        this.friendsCollection = this.afs.collection(`users/${this.currentUserUid}/friends/`, (ref) => ref.orderBy('time', 'desc') /*.limit()*/ );
        // this.notesCollection = this.afs.collection('users/j2sPtwf6BpgjcbqNoZCD38oZaSP2/notes/', (ref) => ref);
        // this.usersCollection = this.afs.collection('users', (ref) => ref.orderBy('time', 'desc'));

    }

    getData(): Observable < User[] > {
        return this.usersCollection.valueChanges();
    }

    getSnapshot(): Observable < User[] > {
        ['added', 'modified', 'removed']
        return this.usersCollection.snapshotChanges().map((actions) => {
            return actions.map((a) => {
                const data = a.payload.doc.data() as User;
                return {
                    id: a.payload.doc.id,
                    email: data.email,
                    photoURL: data.photoURL,
                    displayName: data.displayName,
                    discription: data.discription,
                    uid: data.uid
                };
            });
        });

    }



    getSnapshotN(uid: string): Observable < Note[] > {
        ['added', 'modified', 'removed']
        this.notesCollection = this.afs.collection(`users/${uid}/notes/`, (ref) => ref.orderBy('time', 'desc') /*.limit()*/ );

        return this.notesCollection.snapshotChanges().map((actions) => {
            return actions.map((a) => {
                const data = a.payload.doc.data() as Note;

                return {
                    id: a.payload.doc.id,
                    content: data.content,
                    hearts: data.hearts,
                    heartsList: data.heartsList,
                    heartsListNames: data.heartsListNames,
                    time: data.time,
                    authorId: data.authorId,
                    authorName: data.authorName,
                    authorPhotoURL: data.authorPhotoURL
                };
            });
        });
    }



    getSnapshotF(): Observable < any[] > {
        ['added', 'modified', 'removed']
        this.friendsCollection = this.afs.collection(`users/${this.currentUserUid}/friends/`);

        return this.friendsCollection.snapshotChanges().map((actions) => {
            return actions.map((a) => {
                const data = a.payload.doc.data() as any;
                return {
                    id: a.payload.doc.id,
                    fid: data.id
                };
            });
        });
    }


    // getSnapshotF(): Observable<string> {
    //   // ['added', 'modified', 'removed']
    //   console.log("here!!!getSnapshot()")

    //   return this.friendsCollection.snapshotChanges().map((actions) => {
    //         console.log("here!!!getSnapshot(2)")
    //     return actions.map((a) => {
    //                 // console.log("here!!!getSnapshot(3)")

    //       const data = a.payload.doc.data() as string;
    //       console.log('id:'+ a.payload.doc.id + ',fid:'+ data.id)
    //       return { id: a.payload.doc.id, fid: data.id};
    //     });
    //   });
    // }




    getFriend(id: string) {
        return this.afs.doc < Friend > (`users/${this.currentUserUid}/friends/${id}`);
    }

    getUser(id: string) {
        return this.afs.doc < User > (`users/${id}`);
    }
    getNote(uid: string) {
        return this.afs.collection(`users/${uid}/notes/`, (ref) => ref);
    }

    updateUser(id: string, data: Partial < User > ) {
        return this.getUser(id).update(data);
    }

    deleteUser(id: string) {
        return this.getUser(id).delete();
    }


    unFollow(id: string) {
        return this.getFriend(id).delete();

    }

    // follow(content: string) {
    //   return this.friendsCollection.add(content);
    // }

}