import { Component } from '@angular/core';

import { AuthService } from '../../core/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
// import { NotifyService } from './notify.service';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { UsersModule } from '../../users/users.module';
import { UserService } from '../../users/user.service';
import { UserDetailComponent } from '../../users/user-detail/user-detail.component';



interface User {
  uid?: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  discription?: string;
}

@Component({
  selector: 'user-profile1',
  templateUrl: './user-profile1.component.html',
  styleUrls: ['./user-profile1.component.scss'],
})


export class UserProfile1Component {

    user: Observable<User | null>;

  constructor(public auth: AuthService,
              private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private userService:UserService,
              private UsersModule:UsersModule,
              // private UserDetailComponent:UserDetailComponent,
              // private notify: NotifyService
              ) {

    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
    }

  logout() {
    this.auth.signOut();
  }



  // addt() {
  //   console.log('teeeet');
  //       this.user = this.afAuth.authState
  //     .switchMap((user) => {
  //       if (user) {
  //         return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
  //       } else {
  //         return Observable.of(null);
  //       }
  //     });
  // }


  updateDicription(uid:string,discription:string) {
    if (this.user) {
      if (discription==null){discription=''}
      this.userService.updateUser(uid, { discription: discription});
    } else {
      console.error('User missing ID!');
    }
  }








}
