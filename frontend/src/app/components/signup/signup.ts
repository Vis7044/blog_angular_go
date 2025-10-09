import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,
    InputTextModule,
    MessageModule, CommonModule, ButtonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  onSubmit(form: NgForm) {
    if (form.valid && this.user.password === this.user.confirmPassword) {
      console.log('Sign Up Successful:', this.user);
      // You can call your signup API here
    } else {
      console.log('Form is invalid or passwords do not match');
    }
  }

}
