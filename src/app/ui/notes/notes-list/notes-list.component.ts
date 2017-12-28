import { Component, OnInit } from '@angular/core';

import { NoteService } from '../note.service';

import { Note } from '../note-model';

import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Component({
  selector: 'notes-list2',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})

@Injectable()
export class NotesListComponent implements OnInit {

  notes: Observable<Note[]>;
  content: string;

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    // this.notes = this.noteService.getData()
    this.notes = this.noteService.getSnapshot();
  }

  createNote() {
    this.noteService.create(this.content);
    this.content = '';
  }

}
