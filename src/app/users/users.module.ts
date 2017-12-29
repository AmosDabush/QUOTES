import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { UserService } from './user.service';

import { UsersListComponent } from './users-list/users-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { Note } from '../notes1/note-model';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NoteService } from '../notes1/note.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AngularFirestoreModule.enablePersistence(),
    
  ],
  declarations: [
    UsersListComponent,
    UserDetailComponent,
    NoteDetailComponent,
  ],
  providers: [
      UserService,
      NoteService,
  ],
  
})
export class UsersModule { }