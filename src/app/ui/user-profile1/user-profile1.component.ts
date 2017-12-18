import { Component } from '@angular/core';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'user-profile1',
  templateUrl: './user-profile1.component.html',
  styleUrls: ['./user-profile1.component.scss'],
})
export class UserProfile1Component {

  constructor(public auth: AuthService) { }

  logout() {
    this.auth.signOut();
  }
}
