/*FeedModule*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { FeedService } from './feed.service';
import { FeedListComponent } from './notes-list/notes-list.component';
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
    FeedListComponent,
    NoteDetailComponent,
  ],
  providers: [FeedService],
})
export class FeedModule { }
