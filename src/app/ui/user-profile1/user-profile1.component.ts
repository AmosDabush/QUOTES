import { Component } from '@angular/core';

import { AuthService } from '../../core/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { UsersModule } from '../../users/users.module';
import { UserService } from '../../users/user.service';
import { UserDetailComponent } from '../../users/user-detail/user-detail.component';
import { Note } from '../../notes/note-model';
import { NotifyService } from '../../core/notify.service';

interface User {
    uid ? : string;
    email ? : string | null;
    photoURL ? : string;
    displayName ? : string;
    discription ? : string;
    Notilist: Array < string > ;
}
interface Nlist {
    list: Array < string > ;
}
@Component({
    selector: 'user-profile1',
    templateUrl: './user-profile1.component.html',
    styleUrls: ['./user-profile1.component.scss'],
})


export class UserProfile1Component {

    user: Observable < User | null > ;
    currentUserUid = "";

    constructor(public auth: AuthService,
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private userService: UserService,
        private UsersModule: UsersModule,
        private notify: NotifyService,
         ) {

        this.user = this.afAuth.authState
            .switchMap((user) => {
                if (user) {
                    return this.afs.doc < User > (`users/${user.uid}`).valueChanges();
                } else {
                    return Observable.of(null);
                }
            });

        if (this.afAuth.auth.currentUser) {
            this.currentUserUid = this.afAuth.auth.currentUser.uid;
        } else
            console.error("NULL ID")
    }


  logout() {
        var res = confirm("are you sure you want to logout?");
        if (res == true) {
            this.auth.signOut();  
            this.notify.clear()
            }
    }


    tmp = {
        d: '',
        h: ''
    }
    selectedDevice = 'two';
    hours = '00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23'.split(' ');
    days = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ');

    onChange(newValue, F) {
        if (F == 'H') {
            this.tmp.h = newValue
        } else if (F == 'D') {
            this.tmp.d = newValue
        }
        console.log(this.tmp);

    }

    updateDicription(uid: string, discription: string) {
        if (this.user) {
            if (discription == null) {
                discription = ''
            }
            this.userService.updateUser(uid, {
                discription: discription
            });
        } else {
            console.error('User missing ID!');
        }
    }


    //open or close notification settings
    clear() {
        var authenticatedWin = document.getElementById('list');
        var closeBList = document.getElementById('closeBList');
        var openBList = document.getElementById('openBList');
        if (typeof authenticatedWin !== "undefined" && authenticatedWin) {
            if (authenticatedWin.style.display !== 'none' && closeBList && openBList) {
                authenticatedWin.style.display = 'none'
                closeBList.style.display = 'none';
                openBList.style.display = 'inline';
            } else if (closeBList && openBList) {
                authenticatedWin.style.display = 'inline'
                closeBList.style.display = 'inline';
                openBList.style.display = 'none';
            }
        }
    }


    // sorting array
    sortStrings(a: any, b: any) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a > b ? 1 : (a < b ? -1 : 0);
    }

    //add user to the right notification list
    addToList() {
        if (this.user) {
            if (this.tmp.d == "" || this.tmp.h == "") {
                alert('missing info')
                return
            }
            let Clist = (this.tmp.d) + '-' + this.tmp.h + ':00';
            let subList = [this.currentUserUid];
            const listRef = this.afs.doc < Nlist > (`notificationList/${Clist}`).valueChanges().take(1);
            listRef.forEach(list => {
                console.log(list)
                if (!list)
                    this.afs.doc(`notificationList/${Clist}`).set({
                        list: subList
                    });
                else if (!list.list)
                    this.afs.doc(`notificationList/${Clist}`).set({
                        list: subList
                    });

                else if (list.list.indexOf(this.currentUserUid) == -1) {
                    console.log(list.list)
                    list.list.push(this.currentUserUid)
                    console.log(list.list)
                    return this.afs.doc(`notificationList/${Clist}`).set({
                        list: list.list
                    });
                } else {
                    console.log("allrady in list")
                }

            });

            //add to notificationList
            const UserlistRef = this.afs.doc < User > (`users/${this.currentUserUid}`).valueChanges().take(1);
            let subList2 = [Clist];
            UserlistRef.forEach(user => {
                console.log(user)
                if (!user.Notilist)
                    this.afs.doc < User > (`users/${this.currentUserUid}`).update({
                        Notilist: subList2
                    });
                else if (user.Notilist.indexOf(Clist) == -1) {

                    console.log(user.Notilist)
                    user.Notilist.push(Clist)
                    console.log(user.Notilist)
                    return this.afs.doc < User > (`users/${this.currentUserUid}`).update({
                        Notilist: user.Notilist.sort(this.sortStrings)
                    });

                } else {
                    console.log("allrady in list")
                }

            });

        } else {
            console.error('User missing ID!');
        }
    }

    //delete user from the selected notification list
    DelFromList(i) {
        if (this.user) {
            console.log(i);
            const listRef = this.afs.doc < Nlist > (`notificationList/${i}`).valueChanges().take(1);
            listRef.forEach(list => {
                if (!list) {
                    return;
                } else if (list.list.indexOf(this.currentUserUid) != -1) {
                    console.log(list.list)
                    let index = list.list.indexOf(this.currentUserUid)
                    list.list.splice(index, 1)
                    console.log(list.list)
                    return this.afs.doc(`notificationList/${i}`).set({
                        list: list.list
                    });
                } else {
                    console.log("not in this list...")
                }

            });

            //add to notificationList
            const UserlistRef = this.afs.doc < User > (`users/${this.currentUserUid}`).valueChanges().take(1);
            UserlistRef.forEach(user => {
                console.log(user)
                if (!user.Notilist)
                    return;
                else if (user.Notilist.indexOf(i) != -1) {
                    console.log(user.Notilist)
                    let index = user.Notilist.indexOf(i)
                    user.Notilist.splice(index, 1);
                    console.log(user.Notilist)
                    return this.afs.doc < User > (`users/${this.currentUserUid}`).update({
                        Notilist: user.Notilist
                    });
                } else {
                    console.log("not in this list...")
                }
            });

        } else {
            console.error('User missing ID!');
        }
    }

}