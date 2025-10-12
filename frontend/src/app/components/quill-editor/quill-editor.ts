import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { InputTextModule } from 'primeng/inputtext';
import { SaveBlogDialog } from "../save-blog-dialog/save-blog-dialog";

@Component({
  selector: 'app-quill-editor',
  imports: [QuillModule, FormsModule, InputTextModule, SaveBlogDialog],
  templateUrl: './quill-editor.html',
  styleUrls: ['./quill-editor.css'],
  encapsulation: ViewEncapsulation.None,
})
export class QuillEditor {
  header = '';
  content = '';

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ header: [1, 2, 3, false] }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
    imageResize: {},
  };

  onEditorCreated(quill: any) {
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => this.imageHandler(quill));

    let previousImages: string[] = [];

    quill.on('text-change', () => {
      setTimeout(() => {
        const currentImages = Array.from(
          quill.root.querySelectorAll('img')
        ).map((img: any) => img.getAttribute('data-public-id'));

        // Detect removed images
        const removed = previousImages.filter(
          (id) => id && !currentImages.includes(id)
        );

        if (removed.length > 0) {
          removed.forEach((publicId) => {
            console.log('🗑️ Image removed:', publicId);
            this.deleteImageFromServer(publicId!);
          });
        }

        previousImages = currentImages;
      }, 150);
    });
  }

  async deleteImageFromServer(publicId: string) {
    try {
      await fetch(
        `http://localhost:8080/api/images/delete?publicId=${publicId}`,
        {
          method: 'DELETE',
        }
      );
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  }

  async imageHandler(quill: any) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(
          'http://localhost:8080/api/images/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        const imageUrl = data.data.secureUrl;
        const publicId = data.data.publicId;

        const range = quill.getSelection(true);

        // Insert image
        quill.insertEmbed(range.index, 'image', imageUrl);

        // Move cursor after image
        quill.setSelection(range.index + 1);

        // Attach Cloudinary public ID
        setTimeout(() => {
          const img = quill.root.querySelector(`img[src="${imageUrl}"]`);
          if (img) img.setAttribute('data-public-id', publicId);
        }, 100);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    };
  }
}
