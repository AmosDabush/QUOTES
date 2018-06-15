/*user- list UserDetailComponent
 * responsible for the details and characteristics of each user waiting for approval to be displayed.
 * -confirm friend request
 * -delete friend request
 * -send friend Requests
 * -remove friend
 * -follow
 * -unFollow
 * -...
 * */
import { Component,Input,OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UserService } from '../user.service';
import { User } from '../user-model';
import { Friend } from '../friend-model';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
@Injectable()
export class UserDetailComponent {

  @Input()
  user: User;
  friends:Observable<Friend[]>;
  friendsC:Observable<Friend[]>;
  confirmedFrinds:Observable<Friend[]>;
  friends2:Observable<Friend[]>;
  friendsC2:Observable<Friend[]>;

  followList:Array<String>;
  frindsList:Array<String>;
  
  frindsReqList:Array<String>;
  firndReqArr:Array<String>;
  friendsReq:Observable<Friend[]>;

  ConfirmedFrindsList:Array<String>;
  confirmedFirndArr:Array<String>;

  followList2:Array<String>;
  frindsList2:Array<String>;
  currentUserUid="";
  constructor(private userService: UserService,
              private afs: AngularFirestore,
              private afAuth: AngularFireAuth
              ) {
    this.followList2=new Array<String>();
    this.frindsList2=new Array<String>();
  
    if(this.afAuth.auth.currentUser){
        this.currentUserUid=this.afAuth.auth.currentUser.uid;    
      }
      else
          console.error("NULL ID")   
    }
  
 
 ngOnInit() {
    this.friends =this.userService.getSnapshotF();
    this.friends2 =this.userService.getSnapshotF2();
    this.friendsReq =this.userService.getSnapshotFR();
    this.confirmedFrinds = this.userService.getSnapshotCF();
    this.followList=new Array<String>();
    this.firndReqArr=new Array<String>();
    this.frindsList=new Array<String>();
    this.ConfirmedFrindsList=new Array<String>();
    this.followList2=this.friendC();
    this.frindsList2=this.friendC2();
    this.frindsReqList=this.friendReq();
    this.ConfirmedFrindsList=this.GetConfirmedFriend();


}
//get all currentUser friends(friend Requests users)
GetConfirmedFriend():Array<String>{
    this.frindsReqList=this.friendReq();

      this.confirmedFrinds =this.userService.getSnapshotCF();
      this.ConfirmedFrindsList=new Array<String>();
      this.confirmedFrinds.forEach(friend => {
      friend.forEach(f => {
       this.ConfirmedFrindsList.push(f.id)
 
      });
    });return this.ConfirmedFrindsList;
}

//get all currentUser friends(friend Requests users)
friendReq():Array<String>{
      this.friendsReq =this.userService.getSnapshotFR();
      this.firndReqArr=new Array<String>();
      this.friendsReq.forEach(friend => {
      friend.forEach(f => {
       this.firndReqArr.push(f.id)
 
      });
    });return this.firndReqArr;
}
//get all currentUser friends(follow on users)
friendC():Array<String>{
      this.friends =this.userService.getSnapshotF();
      this.followList=new Array<String>();
      this.friends.forEach(friend => {
      friend.forEach(f => {
       this.followList.push(f.id)
 
      });
    });return this.followList;
}
//get all currentUser friends(2way)
friendC2():Array<String>{
      this.friends2 =this.userService.getSnapshotF2();
      this.frindsList=new Array<String>();
      this.friends2.forEach(friend => {
      friend.forEach(f => {
       this.frindsList.push(f.id)
 
      });
    });return this.frindsList;
}


  updateDicription(dis:string) {
    if (this.user.uid) {
      if (dis==null){dis=''}
      this.userService.updateUser(this.user.uid, { discription: dis});
    } else {
      console.error('User missing ID!');
    }
  }


  updateEmail(dis:string) {
    if (this.user.uid) {
      if (dis==null){dis=''}
      this.userService.updateUser(this.user.uid, { email: dis});
    } else {
      console.error('User missing ID!');
    }
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id);
  }

  followUser(id: string) {
        var follow =  document.getElementById('followT');
        if (typeof follow !== "undefined" && follow !== null) {follow.style.display = 'none';}
        var unfollow = document.getElementById('unfollowB');
        if (typeof unfollow !== "undefined"&& unfollow !== null ) {unfollow.style.display = 'inline';}
       
        // console.log('+friend :'+id )
        this.userService.follow(id);
  }


//get followon
getFriend(id: string) {
    return this.afs.doc<Friend>(`users/${this.currentUserUid}/friends/${id}`);
  }



unFollow(id: string) {
        var follow =  document.getElementById('followT');
        if (typeof follow !== "undefined" && follow !== null) {follow.style.display = 'inline';}
        var unfollow = document.getElementById('unfollowB');
        if (typeof unfollow !== "undefined" && unfollow !== null) {unfollow.style.display = 'none';}
        this.userService.removeFromFollowList(id)
        return this.getFriend(id).delete();
  }


///////////////////////////////////////////////////////////////////--------------
  //get friend 2way
getFriend2(id: string) {
    return this.afs.doc<Friend>(`users/${this.currentUserUid}/friends2/${id}`);
  }
getFriendreq(id: string) {
    return this.afs.doc<Friend>(`users/${id}/friendsRequests/${this.currentUserUid}`);
  }
  
  addFriend(id: string) {
        var follow =  document.getElementById('addFriendH');
        if (typeof follow !== "undefined" && follow !== null) {follow.style.display = 'none';}
        var unfollow = document.getElementById('unFriendB');
        if (typeof unfollow !== "undefined"&& unfollow !== null ) {unfollow.style.display = 'inline';}
       
        // console.log('+friend :'+id )
        this.userService.addFriend(id);
  }


  confirmRequest(id: string) {
            var follow2 =  document.getElementById('addFriendH');
        if (typeof follow2 !== "undefined" && follow2 !== null) {follow2.style.display = 'none';}
        var follow =  document.getElementById('ConfirmReq');
        if (typeof follow !== "undefined" && follow !== null) {follow.style.display = 'none';}
        var unfollow = document.getElementById('RemoveFriendH');
        if (typeof unfollow !== "undefined"&& unfollow !== null ) {unfollow.style.display = 'inline';}
       
        // console.log('+friend :'+id )
        this.userService.confirmRequest(id);
  }


unFriend(id: string) {//cansel req
        var follow =  document.getElementById('addFriendH');
        if (typeof follow !== "undefined" && follow !== null) {follow.style.display = 'inline';}
        var unfollow = document.getElementById('unFriendB');
        if (typeof unfollow !== "undefined" && unfollow !== null) {unfollow.style.display = 'none';}
        
        this.userService.removeFriendReq(id);
        
        return this.getFriend2(id).delete(),this.getFriendreq(id).delete();
  }


  removeFriend(id: string) {
       var follow =  document.getElementById('RemoveFriend');
        if (typeof follow !== "undefined" && follow !== null) {follow.style.display = 'none';}
        var follow =  document.getElementById('RemoveFriendH');
        if (typeof follow !== "undefined" && follow !== null) {follow.style.display = 'none';}
        var unfollow = document.getElementById('addFriendH');
        if (typeof unfollow !== "undefined"&& unfollow !== null ) {unfollow.style.display = 'inline';}
       
        // console.log('+friend :'+id )
        this.userService.removeFriend(id);
  }



}
