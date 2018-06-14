/*
mange and sets the order of the quotes in the feed(friends,followers,public)
main func: ngOnInit() will init the quote list 
*/ 
import { Component, OnInit } from '@angular/core';
import { NoteService } from '../note.service';
import { Note } from '../note-model';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  host: {'(window:resize)': 'onResize($event)'}
})
export class NotesPListComponent implements OnInit {

  notes: Observable<Note[]>;
  content: string;
  users:  Observable<User[]>;
  mobile:boolean;
  settingsCreate:string;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.notes = this.noteService.getSnapshot();
    this.users = this.noteService.getSnapshotU();


    //use for changeing view if mobile or not
    if (window.innerWidth < 1022) { // 768px portrait
        this.mobile = true;
     }
     else
        this.mobile = false;

  }
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
