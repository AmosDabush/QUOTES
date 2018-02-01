import { Component } from '@angular/core';

import { AuthService } from '../../core/auth.service';

import { UsersModule } from '../../users/users.module';
import { UserService } from '../../users/user.service';
import { UserDetailComponent } from '../../users/user-detail/user-detail.component';



@Component({
  selector: 'mini-profile',
  templateUrl: './mini-profile.component.html',
  styleUrls: ['./mini-profile.component.scss'],
})
export class UserProfileComponent {

  constructor(public auth: AuthService) { }

  logout() {
    this.auth.signOut();
  }


// open or close the mini profile component
clear(){
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
