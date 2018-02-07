
import { Component, OnInit } from '@angular/core';
import { MessagingService } from './core/messaging.service'
import { AuthService } from './core/auth.service';
import './utils/rxjs.operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  users;
  allusers;
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  constructor(public msg: MessagingService, public auth: AuthService,private afs: AngularFirestore) { }

  ngOnInit() { 
    this.auth.user
    .filter(user => !!user) // filter null
    .take(1) // take first real user
    .subscribe(user => {
      if (user) {
        this.msg.getPermission(user)
        this.msg.monitorRefresh(user)
        this.msg.receiveMessages()
        
      }
    })

    //search
    this.getallusers().subscribe((users) => {
      this.allusers = users;
    })
    Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((users) => {
        this.users = users;
      })
    })

  }//ngOnInit

  search($event) {
    let q = $event.target.value;
    if (q != '') {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.users = this.allusers;
    }
  }
 
  firequery(start, end) {
    return this.afs.collection('users', ref => ref.limit(4).orderBy('displayName').startAt(start).endAt(end)).valueChanges();
  }
 
  getallusers() {
    return this.afs.collection('users', ref => ref.limit(5).orderBy('displayName')).valueChanges();
  }

}
