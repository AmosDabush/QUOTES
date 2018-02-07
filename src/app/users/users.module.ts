import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { UserService } from './user.service';

import { UsersListComponent } from './users-list/users-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { Note } from '../feed/note-model';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { FeedService } from '../feed/feed.service';
import { AppRoutingModule } from '../app-routing.module';
// import { AppComponent } from '../';


@NgModule({
  imports: [
    // AppComponent,
    AppRoutingModule,
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
    FeedService,
  ],
  
})
export class UsersModule { }
