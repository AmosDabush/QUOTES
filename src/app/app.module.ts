import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

///// Start FireStarter

// Core
import { CoreModule } from './core/core.module';

// Shared/Widget
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { ItemModule } from './items/shared/item.module';
import { UploadModule } from './uploads/shared/upload.module';
import { UiModule } from './ui/shared/ui.module';
import { NotesModule } from './notes/notes.module';
import { Notes1Module } from './notes1/notes.module';
import { NotesPModule } from './notesP/notes.module';
// import { FeedModule } from './feed/notes.module';

import { UsersModule } from './users/users.module';

// import { UsersModule } from './users/user.module';


///// End FireStarter

import { environment } from '../environments/environment';

import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule } from 'angularfire2/firestore';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ItemModule,
    UiModule,
    NotesModule,
    Notes1Module,
    NotesPModule,
    // FeedModule,
    UsersModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
