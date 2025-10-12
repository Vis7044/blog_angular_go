import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    MessageModule,
    CommonModule,
    ButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  user = {
    password: '',
    email: ''
  };

  async onSubmit(exampleForm: NgForm) {
    if (!exampleForm.valid) {
      console.log('❌ Form is invalid. Please correct the errors.');
      return;
    }

    console.log('✅ Form submitted successfully:', this.user);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.user),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login Successful:', data);

      if (data.data) {
        localStorage.setItem('authToken', data.data);
        console.log('Token saved in localStorage');
      } else {
        console.warn('No token received from server');
      }

      exampleForm.resetForm();
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
}
