import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { UserService } from './user.service';

import { FriendsListComponent } from './friends-list/friends-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { Note } from '../notes1/note-model';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NoteService } from '../notes1/note.service';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule,
    AngularFirestoreModule.enablePersistence(),
    
  ],
  declarations: [
    FriendsListComponent,
    UserDetailComponent,
    NoteDetailComponent,
  ],
  providers: [
      UserService,
      NoteService,
  ],
  
})
export class FriendsModule { }
