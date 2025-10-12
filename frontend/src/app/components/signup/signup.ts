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

  async onSubmit(form: NgForm) {
    if (form.valid && this.user.password === this.user.confirmPassword) {
      try {
        const response = await fetch('http://localhost:8080/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.user),
        });

        if (!response.ok) {
          throw new Error('Sign Up failed');
        }

        const data = await response.json();
        console.log('Sign Up Successful:', data);
      } catch (error) {
        console.error('Error during sign up:', error);
      }
    } else {
      console.log('Form is invalid or passwords do not match');
    }
  }

}
