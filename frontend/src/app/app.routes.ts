import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Contact } from './components/contact/contact';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { QuillEditor } from './components/quill-editor/quill-editor';

export const routes: Routes = [
    {path:"", component: Home},
    {path:"about", component: About},
    {path: "contact", component: Contact},
    {path: "login", component: Login},
    {path: "signup", component: Signup},
    {path: "write", component: QuillEditor}
];
