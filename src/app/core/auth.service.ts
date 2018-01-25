import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NotifyService } from './notify.service';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';



interface User {
    uid: string;
    email ? : string | null;
    photoURL ? : string;
    displayName ? : string;
    discription ? : string;
}

@Injectable()
export class AuthService {

    user: Observable < User | null > ;

    constructor(private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private notify: NotifyService) {

        this.user = this.afAuth.authState
            .switchMap((user) => {
                if (user) {
                    return this.afs.doc < User > (`users/${user.uid}`).valueChanges();
                } else {
                    return Observable.of(null);
                }
            });
    }

    ////// OAuth Methods /////

    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.oAuthLogin(provider);
    }

    githubLogin() {
        const provider = new firebase.auth.GithubAuthProvider();
        return this.oAuthLogin(provider);
    }

    facebookLogin() {
        const provider = new firebase.auth.FacebookAuthProvider();
        return this.oAuthLogin(provider);
    }

    twitterLogin() {
        const provider = new firebase.auth.TwitterAuthProvider();
        return this.oAuthLogin(provider);
    }

    private oAuthLogin(provider: firebase.auth.AuthProvider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) => {
                this.notify.update('Welcome to Quote-Me!!', 'success');
                return this.updateUserData(credential.user);
            })
            .catch((error) => this.handleError(error));
    }

    //// Anonymous Auth ////

    anonymousLogin() {
        return this.afAuth.auth.signInAnonymously()
            .then((user) => {
                this.notify.update('Welcome to Quote-Me!!', 'success');
                return this.updateUserData(user); // if using firestore
            })
            .catch((error) => {
                console.error(error.code);
                console.error(error.message);
                this.handleError(error);
            });
    }

    //// Email/Password Auth ////

    emailSignUp(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                this.notify.update('Welcome to Quote-Me!!', 'success');
                return this.updateUserData(user); // if using firestore
            })
            .catch((error) => this.handleError(error));
    }

    emailLogin(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                this.notify.update('Welcome to Quote-Me!!', 'success')
                return this.updateUserData(user); // if using firestore
            })
            .catch((error) => this.handleError(error));
    }

    // Sends email allowing user to reset password
    resetPassword(email: string) {
        const fbAuth = firebase.auth();

        return fbAuth.sendPasswordResetEmail(email)
            .then(() => this.notify.update('Password update email sent', 'info'))
            .catch((error) => this.handleError(error));
    }

    signOut() {
        this.afAuth.auth.signOut().then(() => {
            this.router.navigate(['/']);
        });
    }

    // If error, console log and notify user
    private handleError(error: Error) {
        console.error(error);
        this.notify.update(error.message, 'error');
    }

    // Sets user data to firestore after succesful login
    private updateUserData(user: User) {

        const userRef: AngularFirestoreDocument < User > = this.afs.doc(`users/${user.uid}`);
        const userRefC = this.afs.doc(`users/${user.uid}`).valueChanges();



        const data: User = {
            uid: user.uid,
            email: user.email || null,
            displayName: user.displayName || 'nameless user',
            photoURL: user.photoURL || 'https://png.icons8.com/puffin-bird/win10/1600',
            discription: "a place for a aowesome dicription...",
        };
        const dataUpdate: User = {
            uid: user.uid,
            email: user.email || null,
            displayName: user.displayName || 'nameless user',
            // photoURL: user.photoURL || 'https://png.icons8.com/puffin-bird/win10/1600',

        };
        //chack if User allredy exsist 
        userRefC.forEach(exsist => {
            if (!exsist) {
                console.log("new  ")
                return userRef.set(data); //TO-DO!  if exsist then update 
            } else {
                console.log("User allredy exsist  ")
                return userRef.update(dataUpdate); //TO-DO!  if exsist then update 

            }
        });




    }




}