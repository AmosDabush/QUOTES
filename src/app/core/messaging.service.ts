import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from './auth.service';
import * as firebase from 'firebase'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
// import * as firebase from 'firebase/app';
import '../utils/rxjs.operators';
  
// push Notify users 
@Injectable()
export class MessagingService {

  public messaging = firebase.messaging()

  private messageSource = new Subject<any|null>()
  currentMessage = this.messageSource.asObservable()

  constructor(private afs: AngularFirestore) {

  }

  // get permission to send messages
  getPermission(user) {
      var m;
      m=this.messaging;
      m.requestPermission()
      .then(() => {
      console.log('Notification permission granted.');
      return m.getToken()
    })
    .then(token => {
      // console.log(token)
      this.saveToken(user, token)
    })
    .catch((err) => {
      console.log('Unable to get permission to notify.', err);
    });
  }


  // Listen for token refresh
  monitorRefresh(user) {
     var m;
      m=this.messaging;
    
    m.onTokenRefresh(() => {
      m.getToken()
      .then(refreshedToken => {
        console.log('Token refreshed.');
        this.saveToken(user, refreshedToken)
      })
      .catch( err => console.log(err, 'Unable to retrieve new token') )
    });
  }

  

  // used to show message when app is open
  receiveMessages() {
    this.messaging.onMessage(payload => {
     console.log('Message received. ', payload);
     this.messageSource.next(payload)
   });

  }

  // save the permission token in firestore
  private saveToken(user, token): void {
    
      const currentTokens = user.fcmTokens || { }
      // console.log(currentTokens, token)

      // If token does not exist in firestore, update db
      if (!currentTokens[token]) {
        const userRef = this.afs.collection('users').doc(user.uid)
        const tokens = { ...currentTokens, [token]: true }
        userRef.update({ fcmTokens: tokens })
      }
  }

  clear() {
    this.messageSource.next(null);
  }

}