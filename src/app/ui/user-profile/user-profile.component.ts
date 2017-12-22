import { Component } from '@angular/core';

import { AuthService } from '../../core/auth.service';

import { UsersModule } from '../../users/users.module';
import { UserService } from '../../users/user.service';
import { UserDetailComponent } from '../../users/user-detail/user-detail.component';



@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {

  constructor(public auth: AuthService) { }

  logout() {
    this.auth.signOut();
  }










}
