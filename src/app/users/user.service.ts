/*UserService
  *display other user profiles
  *get user snap and then the user quots
  */

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './user-model';
import { Note } from '../feed/note-model'
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

interface NewUser {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  discription?: string;
}
interface Friend {
  id: string;
}


@Injectable()
export class UserService {
  friendsCollection: AngularFirestoreCollection<Friend>;
  friendsCollection2: AngularFirestoreCollection<Friend>;
  friendsReqCollection: AngularFirestoreCollection<Friend>; 
  confirmFriendsCollectionThis: AngularFirestoreCollection<Friend>;
  confirmFriendsCollectionOther: AngularFirestoreCollection<Friend>;
  usersCollection: AngularFirestoreCollection<User>;
  userDocument:   AngularFirestoreDocument<Node>;
  notesCollection: AngularFirestoreCollection<Note>;
  currentUserUid="";


  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth
              ) {
  

  if(this.afAuth.auth.currentUser){
       this.currentUserUid=this.afAuth.auth.currentUser.uid;    
    }
    else
        console.error("NULL ID")   

    this.friendsCollection2 = this.afs.collection(`users/${this.currentUserUid}/friends2/`, (ref) => ref.orderBy('time', 'desc')/*.limit()*/ );
    // this.friendsReqCollection = this.afs.collection(`users/${this.currentUserUid}/friends2/`, (ref) => ref.orderBy('time', 'desc')/*.limit()*/ );
    this.friendsReqCollection = this.afs.collection(`users/${this.currentUserUid}/friendsRequests/`, (ref) => ref.orderBy('time', 'desc')/*.limit()*/ );

    this.friendsCollection = this.afs.collection(`users/${this.currentUserUid}/friends/`, (ref) => ref.orderBy('time', 'desc')/*.limit()*/ );
    this.usersCollection = this.afs.collection('users/', (ref) => ref);
  
}

  getData(): Observable<User[]> {
    return this.usersCollection.valueChanges();
  }

    //get current user data  Snapshots 
  getSnapshot(): Observable<User[]> {
    ['added', 'modified', 'removed']
    return this.usersCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as User;
        return { id: a.payload.doc.id, email: data.email, photoURL: data.photoURL, displayName: data.displayName, discription:data.discription,uid:data.uid  };
      });
    });
    
  }
//get Snapshots of all the notes of this current user friend
  getSnapshotN(uid:string): Observable<Note[]> {
    ['added', 'modified', 'removed']
        this.notesCollection = this.afs.collection(`users/${uid}/notes/`, (ref) => ref.orderBy('time', 'desc')/*.limit()*/ );

    return this.notesCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Note;
        
        return { id: a.payload.doc.id, content: data.content, hearts: data.hearts, heartsList: data.heartsList,heartsListNames: data.heartsListNames,settings: data.settings,
          time: data.time,authorId:data.authorId ,authorName:data.authorName,authorPhotoURL:data.authorPhotoURL};
      });
    });
  }

//get Snapshots of all the current user friends
  getSnapshotF(): Observable<any[]> {
    ['added', 'modified', 'removed']
    this.friendsCollection = this.afs.collection(`users/${this.currentUserUid}/friends/`);

    return this.friendsCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as any;
        return { id: a.payload.doc.id,fid: data.id };
      });
    });
  }
//get Snapshots of all the current user friends request
  getSnapshotFR(): Observable<any[]> {
    ['added', 'modified', 'removed']
    this.friendsReqCollection = this.afs.collection(`users/${this.currentUserUid}/friendsRequests/`);

    return this.friendsReqCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as any;
        return { id: a.payload.doc.id,fid: data.id };
      });
    });
  }

  //get Snapshots of all the current user friends requests
  getSnapshotCF(): Observable<any[]> {
    ['added', 'modified', 'removed']
    this.confirmFriendsCollectionThis = this.afs.collection(`users/${this.currentUserUid}/confirmedFriends/`);

    return this.confirmFriendsCollectionThis.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as any;
        return { id: a.payload.doc.id,fid: data.id };
      });
    });
  }

//get Snapshots of all the current user friends
  getSnapshotF2(): Observable<any[]> {
    ['added', 'modified', 'removed']
    this.friendsCollection2 = this.afs.collection(`users/${this.currentUserUid}/friends2/`);

    return this.friendsCollection2.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as any;
        return { id: a.payload.doc.id,fid: data.id };
      });
    });
  }

  getUser(id: string) {
    return this.afs.doc<User>(`users/${id}`);
  }
  getNote(uid: string) {
    return this.afs.collection(`users/${uid}/notes/`, (ref) => ref);
  }

  updateUser(id: string, data: Partial<User>) {
    return this.getUser(id).update(data);
  }
  updateUserPic(id: string, data: Partial<User>) {
    return this.getUser(id).update(data);
  }
  deleteUser(id: string) {
    return this.getUser(id).delete();
  }


  
  addFriend(fid: string) {
       this.friendsReqCollection = this.afs.collection(`users/${fid}/friendsRequests/`, (ref) => ref.orderBy('time', 'desc')/*.limit()*/ );
           const friendReq = {
       id:this.currentUserUid,
    };

       const friend = {
       id:fid,
    };
    
    this. addFriendReq(fid);

     return this.friendsCollection2.doc(fid).set(friend),this.friendsReqCollection.doc(this.currentUserUid).set(friendReq);
  }




    //add Friend uid to current user.FriendReq list
    addFriendReq(fid: string) {
        const CNote = this.getUser(fid)
        CNote.valueChanges().take(1).forEach(n => {
            if (!n.friendReq )
                this.updateUser(fid, {
                friendReq:[this.currentUserUid]
                },);
            else if (n.friendReq)
                if (n.friendReq.indexOf(this.currentUserUid) == -1 ) {
                    n.friendReq.push(this.currentUserUid)
                    this.updateUser(fid,{
                        friendReq: n.friendReq,
                    });
                } else
                    console.log('you allrady liked this quote')

        });

    }


  //remove Friend uid frome current user.FriendReq list
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
  
  removeFriendReqSelf(fid: string) { 
        const CNote = this.getUser(this.currentUserUid)
        CNote.valueChanges().take(1).forEach(n => {
            if (n.friendReq)
                    n.friendReq.splice(n.friendReq.indexOf(fid),1);
             this.updateUser(this.currentUserUid, {
                friendReq:n.friendReq
                },);
            });
    }




  follow(fid: string) {
       const friend = {
       id:fid,
    };
     this.addToFollowList(fid);
     return this.friendsCollection.doc(fid).set(friend);
  }





    //add Friend uid to current user.FriendReq list
    addToFollowList(fid: string) {
        const CNote = this.getUser(this.currentUserUid )
        CNote.valueChanges().take(1).forEach(n => {
            if (!n.followList ) 
                this.updateUser(this.currentUserUid, {
                followList:[fid]
                },);
            else if (n.followList)
                if (n.followList.indexOf(fid) == -1 ) {
                    n.followList.push(fid)
                    this.updateUser(this.currentUserUid,{
                        followList: n.followList,
                    });
                } else
                    console.log('you allrady liked this quote')

        });

    }


  //remove Friend uid frome current user.FriendReq list
  removeFromFollowList(fid: string) {
        const CNote = this.getUser(this.currentUserUid)
        CNote.valueChanges().take(1).forEach(n => {
            if (n.followList)
                    n.followList.splice(n.followList.indexOf(fid),1);
             this.updateUser(this.currentUserUid, {
                followList:n.followList
                },);
            });
    }



    //add Friend uid to current user.friendsList 
    addToFriendsList(fid: string) {
        const CurrentUser = this.getUser(this.currentUserUid )
        const CurrentFriend = this.getUser(this.currentUserUid )

        CurrentUser.valueChanges().take(1).forEach(n => {
            if (!n.friendsList ) 
                this.updateUser(this.currentUserUid, {
                friendsList:[fid]
                },);
            else if (n.friendsList)
                if (n.friendsList.indexOf(fid) == -1 ) {
                    n.friendsList.push(fid)
                    this.updateUser(this.currentUserUid,{
                        friendsList: n.friendsList,
                    });
                } else
                    console.log('you  are allrady Friends')

        });

        CurrentFriend.valueChanges().take(1).forEach(n => {
            if (!n.friendsList ) 
                this.updateUser(fid, {
                friendsList:[this.currentUserUid]
                },);
            else if (n.friendsList)
                if (n.friendsList.indexOf(this.currentUserUid) == -1 ) {
                    n.friendsList.push(this.currentUserUid)
                    this.updateUser(fid,{
                        friendsList: n.friendsList,
                    });
                } else
                    console.log('you  are allrady Friends')

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














    confirmRequest(fid: string) {
      //  this.removeFriend(fid)
       this.confirmFriendsCollectionThis = this.afs.collection(`users/${this.currentUserUid}/confirmedFriends/`, (ref) => ref.orderBy('time', 'desc')/*.limit()*/ );
       this.confirmFriendsCollectionOther = this.afs.collection(`users/${fid}/confirmedFriends/`, (ref) => ref.orderBy('time', 'desc')/*.limit()*/ );

       const friendThis = {
       id:this.currentUserUid,
        };

       const friendOther = {
       id:fid,
      };
      this.addToFriendsList(fid);
      this.removeFriendReqSelf(fid);
     return (
      this.afs.doc < Friend > (`users/${this.currentUserUid}/friendsRequests/${fid}`).delete(),
      this.afs.doc < Friend > (`users/${fid}/friends2/${this.currentUserUid}`).delete(),
      this.confirmFriendsCollectionThis.doc(fid).set(friendOther),
      this.confirmFriendsCollectionOther.doc(this.currentUserUid).set(friendThis)

     );
  }

    removeFriend(fid: string){
        this.removeFromFriendsList(fid)
        return(
               this.afs.doc < Friend > (`users/${this.currentUserUid}/confirmedFriends/${fid}`).delete(),
               this.afs.doc < Friend > (`users/${fid}/confirmedFriends/${this.currentUserUid}`).delete()
               );
    }

  unFriend(id: string) {//cancel req
        var follow =  document.getElementById('addFriendT');
        if (typeof follow !== "undefined" && follow !== null) {follow.style.display = 'inline';}
        var unfollow = document.getElementById('unFriendB');
        if (typeof unfollow !== "undefined" && unfollow !== null) {unfollow.style.display = 'none';}
        
        return this.getFriend2(id).delete(),this.getFriendreq(id).delete();
  }
  getFriend2(id: string) {
      return this.afs.doc<Friend>(`users/${this.currentUserUid}/friends2/${id}`);
    }
  getFriendreq(id: string) {
      return this.afs.doc<Friend>(`users/${id}/friendsRequests/${this.currentUserUid}`);
    }
  
}
