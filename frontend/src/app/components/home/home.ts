
import { Component, NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from "../navbar/navbar";

import { InputOtpModule } from 'primeng/inputotp';
import { CommonModule } from '@angular/common';
import { QuillEditor } from '../quill-editor/quill-editor';

@Component({
  selector: 'app-home',
  imports: [InputOtpModule,QuillEditor],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
