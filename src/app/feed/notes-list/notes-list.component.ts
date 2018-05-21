import { Component, OnInit } from '@angular/core';

import { FeedService } from '../feed.service';

import { Note } from '../note-model';

import {User} from '../../users/user-model';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../core/auth.service';

import { AppRoutingModule } from '../../app-routing.module';

import { combineLatest } from 'rxjs/observable/combineLatest';
import * as Rx from 'rxjs';

@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
      host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class FeedListComponent implements OnInit {
  doubleChackList: string[];
    doubleChackList2: string[];

  notes: Observable<Note[]>;
  content: string;
  users:  Observable<User[]>;
  
  noteslist: Array<Note>;
  notes2: Observable<Note[]>;
  noteslist2: Array<Observable<Note[]>>;
  noteslist2Friends: Array<Observable<Note[]>>;
  noteslist2Followers: Array<Observable<Note[]>>;
  combineLatestFriends: Array<Note>;
  combineLatestFollowers: Array<Note>;
  combineLatestPublic: Array<Note>;

  combineLatestFollowersObs;
  combineLatestFriendsObs;
  combineLatestPublicObs;
  combinedTmp: Note[];
  combinedTmp2: Note[];
  combinedTmp3: Note[];

  user:Observable<User>;
  mobile:boolean;
  settingsCreate:string;

  constructor(private noteService: FeedService,
              public auth: AuthService,
  ) { }
  //init
  ngOnInit() {
    
    // this.notes = this.noteService.getSnapshot();
    this.noteslist2Friends=new Array<Observable<Note[]>>();
    this.noteslist2Followers=new Array<Observable<Note[]>>();
    this.combineLatestFollowersObs = Rx.Observable;
    this.combineLatestFriendsObs = Rx.Observable;
    this.combineLatestPublicObs = Rx.Observable;

    this.noteslist2=new Array<Observable<Note[]>>();
    this.users = this.noteService.getSnapshotU();//ALL USERS
    this.user = this.noteService.getSnapshotU1();//CORRENT USER
    this.notes2 = this.noteService.getSnapshot();//CORRENT USER NOTES

    this.settingsCreate='public'
    this.combinedTmp=[];
    this.combinedTmp2=[];
    this.combinedTmp3=[];


    this.combineLatestFriends=new Array<Note>();
    this.combineLatestFollowers=new Array<Note>();
    this.combineLatestPublic=new Array<Note>();


     //------------------friends----------------------
      this.user.forEach(userProp => {
      //  console.log('userProp : '+ userProp.displayName , userProp.uid)
          console.log(userProp.friendsList);
          if(userProp.friendsList)
          // userProp.friendsList.sort(function(a, b){return 0.5 - Math.random() })
          userProp.friendsList
          .forEach(fid => {
            console.log(fid)
                   this.notes=this.noteService.getSnapshotN(fid);
                   this.noteslist2Friends.push(this.notes);
          });

      // combine both observables 
      this.combineLatestFriendsObs = Rx.Observable.combineLatest(this.noteslist2Friends).switchMap((Note) => {
      // Destructure the values to combine a single array.
        this.combineLatestFriends=[];
        this.combinedTmp2=[];
                console.log('this.combineLatestFriends=[];')

    console.log(Note.length)
    for(let i=0;i<Note.length;i++){
    this.combinedTmp2 =this.combinedTmp2.concat(Note[i]);
    }    
    return Rx.Observable.of( this.combinedTmp2.slice().sort(function (a, b) {return a.time> b.time ? -1 : 1;}) );
})

// Subscribe to the latest stream that contains both California and Colorado.
this.combineLatestFriendsObs.subscribe((result) => {
    result.forEach(quote => {
        console.log(quote)
        this.combineLatestFriends.push(quote);
    });
})


///--------------------------followers----------------
          if(userProp.followList)
          // userProp.followList.sort(function(a, b){return 0.5 - Math.random() })  //<-------= random
          userProp.followList
          .forEach(fid => {
            console.log(fid)
            if(userProp.friendsList)
              if(userProp.friendsList.indexOf(fid)==-1 ){
                    this.notes=this.noteService.getSnapshotN(fid);
                    this.noteslist2Followers.push(this.notes);
                  }
          });



// combine both observables 
this.combineLatestFollowersObs = Rx.Observable.combineLatest(this.noteslist2Followers).switchMap((Note) => {
    // Destructure the values to combine a single array.
        this.combineLatestFollowers=[];
        this.combinedTmp=[];
    console.log(Note.length)
    for(let i=0;i<Note.length;i++){
    this.combinedTmp =this.combinedTmp.concat(Note[i]);
    }    
    return Rx.Observable.of( this.combinedTmp.slice().sort(function (a, b) {return a.time> b.time ? -1 : 1;}) );
})

// Subscribe to the latest stream that contains both California and Colorado.
this.combineLatestFollowersObs.subscribe((result) => {
    result.forEach(quote => {
        console.log(quote)
        this.combineLatestFollowers.push(quote);
    });
})


//------------------public----------------------
  this.users.forEach(uesr => {
            uesr.forEach(userProp2 => {
              //  console.log('userProp : '+ userProp.displayName , userProp.uid)
            if(userProp2.uid!=this.noteService.currentUserUid)
              if(userProp.friendsList&&userProp.followList)
                if(userProp.friendsList.indexOf(userProp2.uid)==-1 && userProp.followList.indexOf(userProp2.uid)==-1){
              this.notes=this.noteService.getSnapshotN(userProp2.uid);
              this.noteslist2.push(this.notes);
            }
          });        
          // combine both observables 
          this.combineLatestPublicObs = Rx.Observable.combineLatest(this.noteslist2).switchMap((Note) => {
              // Destructure the values to combine a single array.
                  this.combineLatestPublic=[];
                  this.combinedTmp3=[];
              console.log(Note.length)
              for(let i=0;i<Note.length;i++){
              this.combinedTmp3 =this.combinedTmp3.concat(Note[i]);
              }    
              // return Rx.Observable.of( this.combinedTmp2.slice().sort(function (a, b) {return a.time> b.time ? -1 : 1;}) );
              return Rx.Observable.of( this.combinedTmp3.slice().sort(function (a, b) {return a.time> b.time ? -1 : 1;}) );
          })
          // Subscribe to the latest stream that contains both California and Colorado.
          this.combineLatestPublicObs.subscribe((result) => {
              result.forEach(quote => {
                  console.log(quote)
                  this.combineLatestPublic.push(quote);
              });
          })
    }); 
});















    //use for changeing view if mobile or not
    if (window.innerWidth < 1022) { // 768px portrait
        this.mobile = true;
     }
     else
        this.mobile = false;


  }//NgInit

    //use for changeing view if mobile or not 
    onResize(event){
        event.target.innerWidth;
            if (window.innerWidth < 1022) { 
        this.mobile = true;
     }
     else
        this.mobile = false;
    }


  //create new Note
  createNote() {
    this.noteService.create(this.content,this.settingsCreate);
    this.content = '';
    this.settingsCreate="public";
    this.initSettings();
  }
 


    //chack switch options (uncheck necessary boxs)
    settingsCheck(flag: number){
        let privateBox=<HTMLInputElement>document.getElementById("private_checkbox");
        let publicBox=<HTMLInputElement>document.getElementById("public_checkbox");
        let followersBox=<HTMLInputElement>document.getElementById("followers_checkbox");
        let friendsBox=<HTMLInputElement>document.getElementById("friends_checkbox");

        if(flag==1){//private
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                // privateBox.checked = false;
                publicBox.checked = false;
                followersBox.checked = false;
                friendsBox.checked = false;
                this.settingsCreate = 'private'
            }
        }
        if(flag==2){//public
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                privateBox.checked = false;
                // publicBox.checked = false;
                followersBox.checked = false;
                friendsBox.checked = false;
                this.settingsCreate = 'public'

            }
        }
        if(flag==3){//friends
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                privateBox.checked = false;
                publicBox.checked = false;
                // followersBox.checked = false;
                // friendsBox.checked = false;
                       if(followersBox.checked)
                      this.settingsCreate = 'ff'
                else
                    this.settingsCreate = 'friends'

            }
        }
        if(flag==4){//followers
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                privateBox.checked = false;
                publicBox.checked = false;
                if(friendsBox.checked)
                      this.settingsCreate = 'ff'
                else
                    this.settingsCreate = 'followers'
                // followersBox.checked = false;
                // friendsBox.checked = false;
            }
        }
        if(flag==5){//private
         if (privateBox&&publicBox&&friendsBox&&followersBox ) {
                privateBox.checked = false;
                publicBox.checked = false;
                followersBox.checked = false;
                friendsBox.checked = false;
                this.settingsCreate = 'public'

            }
        }
         
    }


 initSettings() {
        let value;
        let privateBox=<HTMLInputElement>document.getElementById("private_checkbox");
        let publicBox=<HTMLInputElement>document.getElementById("public_checkbox");
        let followersBox=<HTMLInputElement>document.getElementById("followers_checkbox");
        let friendsBox=<HTMLInputElement>document.getElementById("friends_checkbox");

             publicBox.checked =false 
             privateBox.checked=false 
             friendsBox.checked =false
             followersBox.checked =false
    }

    toogleMobSettings(){
        var nid = 0;
        var name = 'nid';
        var MobSettings = window[name];
        window[name]=<HTMLInputElement>document.getElementById("settingsBoxMobile");
        if(window[name]){
            if(window[name].style.display=='none'){
                window[name].style.display='inline-flex'
                // this.settingsOpenCheck();
            }
            else {
                window[name].style.display='none'
                // this.setSettings(this.note.id,this.note.authorId);
        }
    }

}
closeMobSettings(){
        var nid = 0;
        var name = 'nid';
        var MobSettings = window[name];
        window[name]=<HTMLInputElement>document.getElementById("settingsBoxMobile");
        if(window[name]){ 
                window[name].style.display='none'
                }
    }
}
