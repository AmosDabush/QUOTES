import { NgModule } from '@angular/core';
import { Routes, RouterModule, provideRoutes } from '@angular/router';

import { UserLoginComponent } from './ui/user-login/user-login.component';
// import { ItemsListComponent } from './items/items-list/items-list.component';
import { ReadmePageComponent } from './ui/readme-page/readme-page.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { FeedListComponent } from './feed/notes-list/notes-list.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { NotesPListComponent } from './myquotes/notes-list/notes-list.component';
// import { FeedListComponent} from './feed/notes-list/notes-list.component';
import { FriendsListComponent } from './friends/friends-list/friends-list.component';
import { FriendsListComponent2 } from './friends2/friends-list/friends-list.component';

import { UserProfile1Component } from './ui/user-profile1/user-profile1.component';
// import { SubscriberPageComponent } from './subscriber-page/subscriber-page.component';
// import { UsersListComponent } from './users/user-list/users-list.component';


import { AuthGuard } from './core/auth.guard';
import { CoreModule } from './core/core.module';

const routes: Routes = [
  { path: '', component: ReadmePageComponent },
  { path: 'login', component: UserLoginComponent },
  // { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NotesListComponent,  canActivate: [AuthGuard] },
  { path: 'feed', component: FeedListComponent,  canActivate: [AuthGuard] },
  { path: 'myquotes', component: NotesPListComponent,  canActivate: [AuthGuard] },
  { path: 'users/:id', component: UsersListComponent,  canActivate: [AuthGuard] },
  { path: 'friends', component: FriendsListComponent,  canActivate: [AuthGuard] },
  { path: 'friends2', component: FriendsListComponent2,  canActivate: [AuthGuard] },
  { path: 'userprofile1', component: UserProfile1Component,  canActivate: [AuthGuard] },

  // uploads 
  { path: 'uploads', loadChildren: './uploads/shared/upload.module#UploadModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
// export const APP_ROUTER_PROVIDERS = [provideRoutes(routes)];