import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { QuillModule } from 'ngx-quill';
import { Status } from '../../models/Status.enum';
import axios from 'axios';

@Component({
  selector: 'app-save-preview',
  templateUrl: './save-preview.html',
  styleUrls: ['./save-preview.css'],
  imports: [QuillModule],
})
export class SavePreview {
  title: string = 'vishal';
  content: string = 'vishal';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.title = this.config.data?.title ?? '';
    this.content = this.config.data?.content ?? '';
  }

  closeDialog() {
    this.ref.close();
  }
  async saveBlog() {
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.post(
        'http://127.0.0.1:8080/api/blogs',
        {
          title: this.title,
          content: this.content,
          status: Status.Published,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Blog saved successfully:', response.data);
      this.ref.close();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  }

  async saveAsDraft() {
    await axios.get('http://localhost:8080/api/blogs', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    console.log('Draft saved:', { title: this.title, content: this.content });
  }
}
