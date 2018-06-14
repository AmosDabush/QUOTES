/* responsible for the details and characteristics of each user waiting for approval to be displayed.*/
import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user-model';
import { AppRoutingModule } from '../../app-routing.module';
@Component({
    selector: 'user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss'],
})
@Injectable()
export class UserDetailComponent {

    @Input()
    user: User;

    constructor(private userService: UserService) {}

    
    updateDicription(dis: string) {
        if (this.user.uid) {
            if (dis == null) {
                dis = ''
            }
            this.userService.updateUser(this.user.uid, {
                discription: dis
            });
        } else {
            console.error('User missing ID!');
        }
    }


    updateEmail(dis: string) {
        if (this.user.uid) {
            if (dis == null) {
                dis = ''
            }
            this.userService.updateUser(this.user.uid, {
                email: dis
            });
        } else {
            console.error('User missing ID!');
        }
    }


    deleteUser(id: string) {
        this.userService.deleteUser(id);
    }

    UnfollowUser(id: string) {
        console.log('-friend :' + id)
        this.userService.unFollow(id);
    }

}