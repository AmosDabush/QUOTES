/*get snaps from db and mange the users in the friend req list*/

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
        private afAuth: AngularFireAuth) {

        if (this.afAuth.auth.currentUser) {
            this.currentUserUid = this.afAuth.auth.currentUser.uid;
        } else
            console.error("NULL ID")


        this.usersCollection = this.afs.collection('users/', (ref) => ref);
        this.friendsCollection = this.afs.collection(`users/${this.currentUserUid}/friends2/`, (ref) => ref.orderBy('time', 'desc') /*.limit()*/ );
    }

    getData(): Observable < User[] > {
        return this.usersCollection.valueChanges();
    }

    //get current user data  Snapshots 
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

    //get Snapshots of all the notes of this current user friend
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

    //get Snapshots of all the current user friends
    getSnapshotCF(): Observable < any[] > {
        ['added', 'modified', 'removed']
        this.friendsCollection = this.afs.collection(`users/${this.currentUserUid}/confirmedFriends/`);

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
    //get Snapshots of all the current awating friends ...
    getSnapshotF(): Observable < any[] > {
        ['added', 'modified', 'removed']
        this.friendsCollection = this.afs.collection(`users/${this.currentUserUid}/friends2/`);

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
    getFriendReq(id: string) {
        return this.afs.doc < Friend > (`users/${id}/friendsRequests/${this.currentUserUid}`);
    }
    // getFriend(id: string) {
    //     return this.afs.doc < Friend > (`users/${this.currentUserUid}/friendsRequests/${id}`);
    // }

    getFriend(id: string) {
        return this.afs.doc < Friend > (`users/${this.currentUserUid}/friends2/${id}`);
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


    unFollow(id: string) {//cancel friend req from getter user
        this.removeFriendReq(id);
        return this.getFriend(id).delete(),this.getFriendReq(id).delete();

    }

    removeFriend(id: string){
        return(
               this.afs.doc < Friend > (`users/${this.currentUserUid}/confirmedFriends/${id}`).delete(),
               this.afs.doc < Friend > (`users/${id}/confirmedFriends/${this.currentUserUid}`).delete()
               );
    }


  removeFriendReq(fid: string) {
        const CNote = this.getUser(fid)
        CNote.valueChanges().take(1).forEach(n => {
            if (n.friendReq)
                    n.friendReq.splice(n.friendReq.indexOf(this.currentUserUid),1);
             this.updateUser(fid, {
                friendReq:n.friendReq
                },);
            });
            
    }



  //remove Friend uid frome current user.friendsList 
  removeFromFriendsList(fid: string) {
        const CurrentFriend = this.getUser(this.currentUserUid )
        const CurrentUser = this.getUser(this.currentUserUid)

        CurrentUser.valueChanges().take(1).forEach(n => {
            if (n.friendsList)
                    n.friendsList.splice(n.friendsList.indexOf(fid),1);
             this.updateUser(this.currentUserUid, {
                friendsList:n.friendsList
                },);
            });

        CurrentUser.valueChanges().take(1).forEach(n => {
            if (n.friendsList)
                    n.friendsList.splice(n.friendsList.indexOf(this.currentUserUid),1);
             this.updateUser(fid, {
                friendsList:n.friendsList
                },);
            });
    }

    // follow(content: string) {
    //   return this.friendsCollection.add(content);
    // }

}