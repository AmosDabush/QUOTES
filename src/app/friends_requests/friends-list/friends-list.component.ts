/*will show the friend req */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

import { Friend } from '../friend-model';
import { User } from '../user-model';
import { Note } from '../../feed/note-model';
import { NoteDetailComponent } from '../../feed/note-detail/note-detail.component';
import { FeedService } from '../../feed/feed.service';

import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthService } from '../../core/auth.service';
import { AppRoutingModule } from '../../app-routing.module';

@Component({
  selector: 'friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss'],
})
export class FriendsRequestsListComponent implements OnInit {

  users: Observable<User[]>;
  content: string;
  notes: Observable<Note[]>;
    user: Observable<User | null>;
  friends:Observable<Friend[]>;
  constructor(private userService: UserService,
              public auth: AuthService,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private route: ActivatedRoute,    
              ) { }

  ngOnInit() {
    this.users = this.userService.getSnapshot();
    this.friends =this.userService.getSnapshotF();

    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });

  }

}
