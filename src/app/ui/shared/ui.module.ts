import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../../shared/shared.module';

import { NavService } from './nav.service';

import { UserLoginComponent } from '../user-login/user-login.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { UserProfile1Component } from '../user-profile1/user-profile1.component';

import { UserFormComponent } from '../user-form/user-form.component';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { FooterNavComponent } from '../footer-nav/footer-nav.component';
import { ReadmePageComponent } from '../readme-page/readme-page.component';
import { NotificationMessageComponent } from '../notification-message/notification-message.component';

// import { SubscriberPageComponent } from '../../subscriber-page/subscriber-page.component';
// import { SubscriberPageComponent } from './subscriber-page/subscriber-page.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    UserLoginComponent,
    UserProfileComponent,
    UserProfile1Component,
    TopNavComponent,
    FooterNavComponent,
    UserFormComponent,
    ReadmePageComponent,
    NotificationMessageComponent,
    // SubscriberPageComponent,
  ],
  exports: [
    TopNavComponent,
    FooterNavComponent,
    UserProfileComponent,
    UserProfile1Component,
    NotificationMessageComponent,
    // SubscriberPageComponent,
  ],
})
export class UiModule { }
