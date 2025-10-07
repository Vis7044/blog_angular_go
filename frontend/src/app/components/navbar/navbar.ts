import { Component, NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Github, Instagram,NotebookPen } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-navbar',
  imports: [RouterLink, LucideAngularModule, DialogModule, ButtonModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  visible: boolean = false;

  user = {
    username: '',
    email: ''
  };

  // Open the dialog
  showDialog() {
    this.visible = true;
  }

  // Close the dialog
  hideDialog() {
    this.visible = false;
  }

  // Save profile (you can replace with API call)
  saveProfile() {
    console.log('User updated:', this.user);
    this.hideDialog();
  }
  loginVisible: boolean = true;
  signupVisible: boolean = false;

  loginData = { email: '', password: '' };
  signupData = { username: '', email: '', password: '' };

  showLogin() {
    this.loginVisible = true;
  }

  showSignup() {
    this.signupVisible = true;
  }

  // Switch between dialogs
  switchToSignup() {
    this.loginVisible = false;
    this.signupVisible = true;
  }

  switchToLogin() {
    this.signupVisible = false;
    this.loginVisible = true;
  }

  login() {
    console.log('Login data:', this.loginData);
    this.loginVisible = false;
  }

  signup() {
    console.log('Signup data:', this.signupData);
    this.signupVisible = false;
  }

  

}
