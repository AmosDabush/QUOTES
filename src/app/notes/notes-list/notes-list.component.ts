import { Component, OnInit } from '@angular/core';

import { NoteService } from '../note.service';

import { Note } from '../note-model';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';



@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit {

  notes: Observable<Note[]>;
  content: string;
  itemsRef;
  constructor(private noteService: NoteService,private afs: AngularFirestore) { }

  ngOnInit() {
    // this.notes = this.noteService.getData()
    this.notes = this.noteService.getSnapshot();
  }

  createNote() {
    this.noteService.create(this.content);
    this.content = '';
  }

  createNote2(){
    this.itemsRef = this.afs.collection('notificationList').doc('SVZjOeqeIl0JiLqVRfPU');
     
    // ['added', 'modified', 'removed']
     this.itemsRef.snapshotChanges().forEach((a) => {
        const data = a.payload.data() ;
        console.log('1:'+data.list)
        // return { id: a.payload.doc.id, list: data.list };
   
    });
  }







}
