import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NoteService } from './note.service';

import { NotesPListComponent } from './notes-list/notes-list.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';

import { AngularFirestoreModule } from 'angularfire2/firestore';

@NgModule({
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    AngularFirestoreModule.enablePersistence(),
  ],
  declarations: [
    NotesPListComponent,
    NoteDetailComponent,
  ],
  providers: [NoteService],
})
export class NotesPModule { }
