import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

import { User } from '../user-model';
import { Note } from '../../notes/note-model';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {

  users: Observable<User[]>;
  content: string;
  notes: Observable<Note[]>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // this.users = this.userService.getData()
    this.users = this.userService.getSnapshot();
    //  this.notes = this.userService.getSnapshot2();
  }

  // createUser() {
  //   this.userService.create(this.content);
  //   this.content = '';
  // }

}
