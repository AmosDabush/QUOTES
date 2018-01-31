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
export class NotesPListComponent implements OnInit {

  notes: Observable<Note[]>;
  content: string;
  users:  Observable<User[]>;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.notes = this.noteService.getSnapshot();
    this.users = this.noteService.getSnapshotU();
  }

  createNote() {
    this.noteService.create(this.content);
    this.content = '';
  }

}
