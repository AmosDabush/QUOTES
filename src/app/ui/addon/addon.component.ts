/*windows addon page
genrate key
download
info
 */
import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../users/user.service';
import { UserDetailComponent } from '../../users/user-detail/user-detail.component';
import { Note } from '../../feed/note-model';
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
    selector: 'addon',
    templateUrl: './addon.component.html',
    styleUrls: ['./addon.component.scss'],
})


export class AddonComponent {

    user: Observable < User | null > ;
    currentUserUid = "";

    constructor(public auth: AuthService,
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private userService: UserService,
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

    updateKey(uid: string, key: string) {
        // if((<HTMLInputElement>document.getElementById('textarea')).value!=""){
            if (this.user) {
                if (key == null) {
                    key = ''
                    console.log("key  is null ...")

                }
                this.userService.updateUser(uid, {
                addOnKey:key
            });                
            console.log("key is added  to user")

            } else {
                console.error('User missing ID!');
            }
        // }
    }

    //add user to the right notification list
    addKey(oldKey?) {
        console.log(oldKey)
        let key= 'QM' + Math.random().toString(36).substr(2, 9);
        this.updateKey(this.currentUserUid,key)
        if(key==undefined){
            alert('err key undefined')
            return}
        if (this.user) {
            let CKey = key;
            let Cid = this.currentUserUid;
            if(oldKey)//delete old key
                this.afs.doc < Nlist > (`WinAddOn/${oldKey}`).delete();
            const listRef = this.afs.doc < Nlist > (`WinAddOn/${CKey}`).valueChanges().take(1);
            listRef.forEach(list => {
                if (!list)
                    this.afs.doc(`WinAddOn/${CKey}`).set({
                        id: Cid
                    });
                else {
                    console.log("allrady in list")
                    this.addKey()//get other key 
                }

            });
            
        } else {
            console.error('User missing ID!');
        }
    }

//copy key to clipbord
copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }


}