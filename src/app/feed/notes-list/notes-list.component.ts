import { Component, OnInit } from '@angular/core';

import { FeedService } from '../feed.service';

import { Note } from '../note-model';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../core/auth.service';

import { AppRoutingModule } from '../../app-routing.module';


@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class FeedListComponent implements OnInit {

  notes: Observable<Note[]>;
  content: string;
  users:  Observable<User[]>;
  noteslist: Array<Note>;
  notes2: Observable<Note[]>;
  noteslist2: Array<Observable<Note[]>>;

  constructor(private noteService: FeedService) { }
  //init
  ngOnInit() {
    this.notes = this.noteService.getSnapshot();
    this.noteslist2=new Array<Observable<Note[]>>();
    this.users = this.noteService.getSnapshotU();

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

}
