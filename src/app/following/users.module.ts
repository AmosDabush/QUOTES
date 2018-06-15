/*FollowingModule*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { UserService } from './user.service';

import { FollowingListComponent } from './following-list/following-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { Note } from '../feed/note-model';
// import { NoteDetailComponent } from '../feed/note-detail/note-detail.component';
import { FeedService } from '../feed/feed.service';
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
    FollowingListComponent,
    UserDetailComponent,
  ],
  providers: [
      UserService,
      FeedService,
  ],
  
})
export class FollowingModule { }
