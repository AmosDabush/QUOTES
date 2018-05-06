import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../core/auth.service';

import * as firebase from 'firebase';
import { DomSanitizer,SafeUrl } from '@angular/platform-browser';
import { NotifyService } from '../../core/notify.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
 
// import { User } /from './user-model';
@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
      host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class TopNavComponent  {

    // usersCollection: AngularFirestoreCollection < User > ;
        userDocument: AngularFirestoreDocument < Node > ;
        mobile:boolean;
        currentUserUid = "";
        currentUserName = "";
        currentUserPhotoURL;
        searchterm: string;
        startAt = new Subject();
        endAt = new Subject();
        users;
        allusers;
        notes;
        allnotes;
        startobs = this.startAt.asObservable();
        endobs = this.endAt.asObservable();
        show = false;//hmborgar-menu
        showMobSearch = false;//mobile search
    constructor(public sanitizer: DomSanitizer,
            public auth: AuthService,
            private afs: AngularFirestore,
            private afAuth: AngularFireAuth,
            private notify: NotifyService) {}



  ngOnInit() { 
    //search
    this.getallNotes().subscribe((notes) => {
      this.allnotes = notes;

    })
    this.getallusers().subscribe((users) => {
      this.allusers = users;
    })
    Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((users) => {
        this.users = users;
      })
    })
     Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery2(value[0], value[1]).subscribe((notes) => {
        this.notes = notes;
      })
    })
    //window resize
    if (window.innerWidth < 1022) { // 768px portrait
        this.mobile = true;
     }
     else
        this.mobile = false;
    
  }//ngOnInit

    //use for changeing view if mobile or not 
    onResize(event){
        event.target.innerWidth;
            if (window.innerWidth < 1022) { 
        this.mobile = true;
     }
     else
        this.mobile = false;
    }



//search
  search($event) {
    let q = $event.target.value;
    if (q != '') {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.users = this.allusers;
      this.notes = this.allnotes;
    }
  }
 
  firequery(start, end) {
    return this.afs.collection('users', ref => ref.limit(4).orderBy('displayName').startAt(start).endAt(end)).valueChanges();
  }
   firequery2(start, end) {
    return this.afs.collection('notes', ref => ref.limit(4).orderBy('content').startAt(start).endAt(end)).valueChanges();
  }
  getallusers() {
    return this.afs.collection('users', ref => ref.limit(5).orderBy('displayName')).valueChanges();
  }
  getallNotes() {
    return this.afs.collection('notes', ref => ref.limit(5).orderBy('content')).valueChanges();
  }


resetForm(div:string) {
    var dirtyFormID = div;
    var resetForm:HTMLFormElement;
    var inputSearch:HTMLFormElement
    inputSearch= <HTMLFormElement>document.getElementById("inputSearch");
    resetForm= <HTMLFormElement>document.getElementById(dirtyFormID);
    if(resetForm)
        resetForm.reset();
    if(inputSearch){
          inputSearch.value="";
          this.startAt.next('q');
          this.endAt.next('q' + "\uf8ff");
         }
}

  
// open or close the mini profile component
clear(div:string){
     var divToclear =  document.getElementById(div);
        if (typeof divToclear !== "undefined" && divToclear) { 
            if(divToclear.style.display !== 'none'){
                divToclear.style.display = 'none'
              }
            else {
                divToclear.style.display = 'inline'
            }
      }
}

     // open or close the moibile search component (only in mobile view)
     ShowMobSearch(){
        this.showMobSearch = !this.showMobSearch;
        var x = document.getElementById("searchBoxMobile");
        if(this.show)
          this.toggleCollapse()
        if(x)
        if(x.style.display == "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
    
        }
     }

    //navbar-burger toggle Collapse menu
    toggleCollapse() {
        this.show = !this.show;
        var x = document.getElementById("searchBoxMobile");
        if(x)
        if(x.style.display == "block") {
            x.style.display = "none";
        }
     }

    logout() {
        var res = confirm("are you sure you want to logout?");
        if (res == true) {
            this.auth.signOut();  
            this.notify.clear()
            }
    }

}
