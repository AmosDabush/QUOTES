import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// Core
import { CoreModule } from './core/core.module';
// Shared/Widget
import { SharedModule } from './shared/shared.module';
// Feature Modules
import { UploadModule } from './uploads/shared/upload.module';
import { UiModule } from './ui/shared/ui.module';
import { NotesModule } from './notes/notes.module';
import { FeedModule } from './feed/notes.module';
import { NotesPModule } from './myquotes/notes.module';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/users.module';
import { Friends2Module } from './friends2/users.module';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFirestoreModule,AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
//Desktop/Push Notifications Module
import { PushNotificationsModule } from 'ng-push';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    PushNotificationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    UiModule,
    NotesModule,
    FeedModule,
    NotesPModule,
    UsersModule,
    FriendsModule,
    Friends2Module,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    
  ],
})
export class AppModule { }
