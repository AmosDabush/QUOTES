import { Component } from '@angular/core';

import { AuthService } from '../../core/auth.service';
import { UserService } from '../../users/user.service';
import { UserDetailComponent } from '../../users/user-detail/user-detail.component';
import { NotifyService } from '../../core/notify.service';



@Component({
  selector: 'mini-profile',
  templateUrl: './mini-profile.component.html',
  styleUrls: ['./mini-profile.component.scss'],
})
export class UserProfileComponent {

  constructor(public auth: AuthService,
          private notify: NotifyService) { }

logout() {
  var res = confirm("are you sure you want to logout?");
  if (res == true) {
      this.auth.signOut();  
      this.notify.clear()
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

clear2(){
     var authenticatedWin =  document.getElementById('authenticated');
     var closeB = document.getElementById('closeB');
     var openB = document.getElementById('openB');
        if (typeof authenticatedWin !== "undefined" && authenticatedWin) { 
            if(authenticatedWin.style.display !== 'none'  && closeB && openB){
                authenticatedWin.style.display = 'none'
                closeB.style.display = 'none';
                openB.style.display = 'inline';
              }
            else if(closeB && openB) {
                authenticatedWin.style.display = 'inline'
                closeB.style.display = 'inline';
                openB.style.display = 'none';
            }
      }
}


}
