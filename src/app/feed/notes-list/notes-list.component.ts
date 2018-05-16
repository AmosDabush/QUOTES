import { Component, OnInit } from '@angular/core';

import { FeedService } from '../feed.service';

import { Note } from '../note-model';

import {User} from '../../users/user-model';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../core/auth.service';

import { AppRoutingModule } from '../../app-routing.module';


@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class FeedListComponent implements OnInit {
  doubleChackList: string[];
  notes: Observable<Note[]>;
  content: string;
  users:  Observable<User[]>;
  noteslist: Array<Note>;
  notes2: Observable<Note[]>;
  noteslist2: Array<Observable<Note[]>>;
  user:Observable<User>;
  constructor(private noteService: FeedService,
              public auth: AuthService,
  ) { }
  //init
  ngOnInit() {
    this.notes = this.noteService.getSnapshot();
    this.noteslist2=new Array<Observable<Note[]>>();
    this.users = this.noteService.getSnapshotU();
    this.doubleChackList=[];
    this.users.forEach(uesr => {
     uesr.forEach(userProp => {
      //  console.log('userProp : '+ userProp.displayName , userProp.uid)
       this.notes=this.noteService.getSnapshotN(userProp.uid);
       this.noteslist2.push(this.notes);

     });  
    });
  }
  //create new Note
  createNote() {
    this.noteService.create(this.content);
    this.content = '';
  }
 
//  checkIfFriends(uid:string):boolean{
//    let user=this.noteService.getUser(uid)
   
//    console.log("123")
//    return true;
//  }

addToDoubleChackList(id:string){
  if( this.doubleChackList.indexOf(id) == -1 )
     
     setTimeout(()=> {
     this.doubleChackList.push(id);;
}, 0);
     
    
  else
  console.log("allredy in list !@#!@#")
  console.log('doubleChackList = '+this.doubleChackList)

}
 
}
