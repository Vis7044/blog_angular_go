import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Github, Instagram } from 'lucide-angular';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

}
