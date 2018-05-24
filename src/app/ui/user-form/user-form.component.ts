import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

type UserFields = 'email' | 'password'| 'displayName';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  newUser = false; // to toggle login or signup form
  passReset = false; // set to true when password reset is triggered
  formErrors: FormErrors = {
    'displayName': '',
    'email': '',
    'password': '',
  };
  validationMessages = {
      'displayName': {
        'required': 'displayName is required.',
        'minlength': 'displayName must be at least 6 characters long.',
        'maxlength': 'displayName cannot be more than 20 characters long.',    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email',
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 8 characters long.',
      'maxlength': 'Password cannot be more than 25 characters long.',
    },
  };

  constructor(private fb: FormBuilder, private auth: AuthService,private route: ActivatedRoute,
private router: Router) { }

  ngOnInit() {
    this.buildForm();
      this.route.params.subscribe(params => {        
     if(params['mod'])
      if(params['mod']=='log'){
        this.newUser = false;
          this.buildForm();
    }
      else if(params['mod']=='sign'){
        this.newUser = true;
          this.buildForm();
    }
    });
  }

  toggleForm() {
    this.newUser = !this.newUser;
    this.buildForm();
  }

  signup() {
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'], this.userForm.value['displayName']);
  }

  login() {
    this.auth.emailLogin(this.userForm.value['email'], this.userForm.value['password']);
    this.afterSignIn();
  }

  resetPassword() {
    this.auth.resetPassword(this.userForm.value['email'])
      .then(() => this.passReset = true);
  }

  buildForm() {
    if(this.newUser){
    
          this.userForm = this.fb.group({
            'email': ['', [
              Validators.required,
              Validators.email,
            ]],
            'password': ['', [
              Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
              Validators.minLength(8),
              Validators.maxLength(25),
            ]],
            'displayName': ['', [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(20),
            ]],
          });
      }
      else{
          this.userForm = this.fb.group({
            'email': ['', [
              Validators.required,
              Validators.email,
            ]],
            'password': ['', [
              Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
              Validators.minLength(8),
              Validators.maxLength(25),
            ]],
     
          });
      }

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'email' || field === 'password'|| field === 'displayName')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
              }
            }
          }
        }
      }
    }
  }



    private afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    
    setTimeout(() => 
{
    this.router.navigate(['feed']);
    
},
550);

    // this.router.navigate(['/feed']);
  }



}
