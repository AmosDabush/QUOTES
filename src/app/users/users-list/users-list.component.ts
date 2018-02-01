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

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {

  users: Observable<User[]>;
  content: string;
  notes: Observable<Note[]>;
    user: Observable<User | null>;
  friends:Observable<Friend[]>;
  friendsList:Array<string>
  isFrind:string;
  constructor(private userService: UserService,
              public auth: AuthService,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private route: ActivatedRoute,
              
              ) { }
              
  //show the selected user prifile
  ngOnInit() {
    this.users = this.userService.getSnapshot();
    this.friends =this.userService.getSnapshotF();
    //get right user data by url params
    this.route.params.subscribe(params => {
      // console.log(params)
       this.user =this.afs.doc<User>('users/'+ params['id']).valueChanges();
        this.notes = this.userService.getSnapshotN(params['id']);

    });
   
  }

}
