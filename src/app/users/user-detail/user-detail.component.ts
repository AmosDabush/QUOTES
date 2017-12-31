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
  frindsList:Array<String>;
  frindsList2:Array<String>;
  currentUserUid="";
  constructor(private userService: UserService,
              private afs: AngularFirestore,
              private afAuth: AngularFireAuth
              ) {
    this.frindsList2=new Array<String>();
                  
    if(this.afAuth.auth.currentUser){
        this.currentUserUid=this.afAuth.auth.currentUser.uid;    
      }
      else
          console.error("NULL ID")   
    }
  
 
 ngOnInit() {
    this.friends =this.userService.getSnapshotF();
      this.frindsList=new Array<String>();
    this.frindsList2=this.friendC();
    

}

friendC():Array<String>{

      this.friends =this.userService.getSnapshotF();
      this.frindsList=new Array<String>();
      
      this.friends.forEach(friend => {
      friend.forEach(f => {
       this.frindsList.push(f.id)
       console.log(this.frindsList)
        // return this.frindsList;
      });
    });return this.frindsList;
}




//   addHeartToUser(val: number) {
//     if (this.user.id) {
//       this.userService.updateUser(this.user.id, { hearts: val + 1 });
//     } else {
//       console.error('User missing ID!');
//     }
//   }
//  addHeartToUser2(val: number) {
//     if (this.user.id) {
//       this.userService.updateUser(this.user.id, { hearts: val + 1 });
//     } else {
//       console.error('User missing ID!');
//     }
//   }



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
       
        console.log('+friend :'+id )
        this.userService.follow(id);
  }

getFriend(id: string) {
    return this.afs.doc<Friend>(`users/${this.currentUserUid}/friends/${id}`);
  }


unFollow(id: string) {
        var follow =  document.getElementById('followT');
        if (typeof follow !== "undefined" && follow !== null) {follow.style.display = 'inline';}
        var unfollow = document.getElementById('unfollowB');
        if (typeof unfollow !== "undefined" && unfollow !== null) {unfollow.style.display = 'none';}

        return this.getFriend(id).delete();
  }



// friendCheck(uid:string){
//             // console.log("friend ID : ")
// // this.friends =this.userService.getSnapshotF();

//           // console.log("friend ID2 : ")
//     this.userService.getSnapshotF().forEach(friend => {
//         // console.log("friend ID3 : "+uid+"=="+friend.id)
//         friend.forEach(element => {
//           if(element.id==uid){
//             console.log("======element.id==uid======")
//             document.getElementById('followB').style.display = 'none';
//             return true;
//           }
//         });
        
        
        
        // if(friend[0].id==uid){
        //     console.log("friend ID3 : "+uid+"=true="+friend.id)
        //       var follow =  document.getElementById('followB');
        //       if (typeof follow !== "undefined" && follow !== null) {
        //             follow.style.display = 'none';
        //       }
        //     return true;
        //   }
    // });
    // return false;

// }
}
