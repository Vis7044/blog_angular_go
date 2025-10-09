import { Component, NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    InputTextModule,
    MessageModule, CommonModule, ButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  user = {
    username: '',
    email: ''
  };


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
