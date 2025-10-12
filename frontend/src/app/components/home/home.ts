
import { Component } from '@angular/core';
import { InputOtpModule } from 'primeng/inputotp';
import { Button } from "primeng/button";
import { SaveBlogDialog } from "../save-blog-dialog/save-blog-dialog";

@Component({
  selector: 'app-home',
  imports: [InputOtpModule, Button, SaveBlogDialog],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
