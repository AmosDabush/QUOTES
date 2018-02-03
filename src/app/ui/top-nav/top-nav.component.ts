import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../core/auth.service';

import * as firebase from 'firebase';
import { DomSanitizer,SafeUrl } from '@angular/platform-browser';
import { NotifyService } from '../../core/notify.service';

// import { User } /from './user-model';
@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent  {

    // usersCollection: AngularFirestoreCollection < User > ;
    userDocument: AngularFirestoreDocument < Node > ;
        currentUserUid = "";
        currentUserName = "";
        currentUserPhotoURL;

    constructor(public sanitizer: DomSanitizer,
            public auth: AuthService,
            private afs: AngularFirestore,
            private afAuth: AngularFireAuth,
            private notify: NotifyService) { }

    show = false;

    toggleCollapse() {
        this.show = !this.show;
     }

    logout() {
        var res = confirm("are you sure you want to logout?");
        if (res == true) {
            this.auth.signOut();  
            this.notify.clear()
            }
    }

}
