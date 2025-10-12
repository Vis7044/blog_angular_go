import { Component, Input } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { SavePreview } from '../save-preview/save-preview';

@Component({
  selector: 'app-save-blog-dialog',
  standalone: true,
  imports: [SavePreview],
  templateUrl: './save-blog-dialog.html',
  styleUrls: ['./save-blog-dialog.css'],
  providers: [DialogService, MessageService]
})
export class SaveBlogDialog {
  ref: DynamicDialogRef<SavePreview> | null = null;
  @Input() header: string = '';
  @Input() content: string = '';

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService
  ) {}

  show() {
    this.ref = this.dialogService.open(SavePreview, {
      header: 'Preview',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        title: this.header,
        content: this.content
      }
    });

    this.ref?.onClose.subscribe(() => {
      this.messageService.add({
        severity: 'info',
        summary: 'Blog Saved',
        detail: 'Your blog was successfully saved.'
      });
    });
  }
}
