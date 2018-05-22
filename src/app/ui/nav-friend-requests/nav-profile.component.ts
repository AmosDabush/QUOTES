import { Component } from '@angular/core';

import { AuthService } from '../../core/auth.service';
import { UserService } from '../../users/user.service';
import { UserDetailComponent } from '../../users/user-detail/user-detail.component';
import { NotifyService } from '../../core/notify.service';



@Component({
  selector: 'nav-friend-requests',
  templateUrl: './nav-profile.component.html',
  styleUrls: ['./nav-profile.component.scss'],
})
export class NavFriendComponent {

  constructor(public auth: AuthService,
              private notify: NotifyService) {
                
               }

logout() {
  var res = confirm("are you sure you want to logout?");
  if (res == true) {
      this.auth.signOut();  
      this.notify.clear()
     }
    }
    
toggleCollapse(){
  console.log("toggle")
}

}
