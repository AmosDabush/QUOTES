//CoreModule
import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { MessagingService } from './messaging.service';

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [AuthService, NotifyService,MessagingService],
})
export class CoreModule { }
