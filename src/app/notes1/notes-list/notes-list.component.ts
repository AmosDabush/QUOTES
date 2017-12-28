import { Component, OnInit } from '@angular/core';

import { NoteService } from '../note.service';

import { Note } from '../note-model';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class Notes1ListComponent implements OnInit {

  notes: Observable<Note[]>;
  content: string;
  // notes: Observable<Note[]>;
  // content: string;
  users:  Observable<User[]>;
  noteslist: Array<Note>;
  notes2: Observable<Note[]>;
  noteslist2: Array<Observable<Note[]>>;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    // this.notes = this.noteService.getData()
    this.notes = this.noteService.getSnapshot();
        // this.notes = this.noteService.getSnapshotN();
    // this.noteService.getFilterdItems();
    // this.users.forEach(user=>{ })
    // this.notes = this.noteService.getFilterdItems();
     this.noteslist2=new Array<Observable<Note[]>>();

    this.users = this.noteService.getSnapshotU();
    // this.initFeed();
    this.users.forEach(uesr => {
     uesr.forEach(userProp => {
       console.log('userProp : '+ userProp.displayName , userProp.uid)
       this.notes=this.noteService.getSnapshotN(userProp.uid);
       this.noteslist2.push(this.notes);
     });
      
    });



  }

  createNote() {
    this.noteService.create(this.content);
    this.content = '';
  }

}
