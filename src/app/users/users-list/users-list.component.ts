import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

import { Friend } from '../friend-model';
import { User } from '../user-model';
import { Note } from '../../notes1/note-model';
import { NoteDetailComponent } from '../../notes1/note-detail/note-detail.component';
import { NoteService } from '../../notes1/note.service';

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
              // private router: Router,
              // private UsersModule:UsersModule,
              private route: ActivatedRoute,
              // private noteService: NoteService 
              
              ) { }

  ngOnInit() {
    // this.users = this.userService.getData()
    this.users = this.userService.getSnapshot();
    //  this.notes = this.userService.getSnapshot2();
    this.friends =this.userService.getSnapshotF();
    // this.friendsList=new Array<string>();


    this.route.params.subscribe(params => {
      // console.log(params)
       this.user =this.afs.doc<User>('users/'+ params['id']).valueChanges();
        this.notes = this.userService.getSnapshotN(params['id']);

    });
   
    // this.user = this.afs.doc<User>(`users/AaGQUVyi4yfL2lYm6EcfepDvMLP2`).valueChanges();
       
      

    // this.user = this.afAuth.authState
    //   .switchMap((user) => {
    //     if (user) {
    //       return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //     } else {
    //       return Observable.of(null);
    //     }
    //   });



  }

  // createUser() {
  //   this.userService.create(this.content);
  //   this.content = '';
  // }

}
