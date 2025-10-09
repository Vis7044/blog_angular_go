import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LucideAngularModule, Github, Instagram, NotebookPen, SquarePen } from 'lucide-angular';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { Login } from '../login/login';
import { Signup } from '../signup/signup';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,RouterOutlet,
    LucideAngularModule,
    DialogModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    MessageModule,
    Login, Signup
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'] // ✅ fixed: should be "styleUrls" (plural)
})
export class Navbar {

  // 🔹 Dialog Visibility
  visible: boolean = false;

  // 🔹 Form model
  user = {
    username: '',
    email: ''
  };

  // 🔹 Login / Signup states
  loginVisible: boolean = true;
  signupVisible: boolean = false;

  loginData = { email: '', password: '' };
  signupData = { username: '', email: '', password: '' };

  // 🔹 Open / Close Dialog
  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  // 🔹 Save Profile (placeholder for API integration)
  saveProfile() {
    console.log('User updated:', this.user);
    this.hideDialog();
  }
  sidebarOpen: boolean = true;

toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

  // 🔹 Login Action
  login() {
    console.log('Login data:', this.loginData);
    this.loginVisible = false;
  }

  // 🔹 Signup Action
  signup() {
    console.log('Signup data:', this.signupData);
    this.signupVisible = false;
  }

  toggleLogin(){
    this.loginVisible = !this.loginVisible;
    this.signupVisible = !this.signupVisible;
  }

  // 🔹 Form Submission (for exampleForm)
  onSubmit(exampleForm: NgForm) {
    if (exampleForm.valid) {
      console.log('✅ Form submitted successfully:', this.user);

      // Example API placeholder or toast
      // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile Saved!' });

      exampleForm.resetForm();
    } else {
      console.log('❌ Form is invalid. Please correct the errors.');
    }
  }
}
