import { Component, Inject } from '@angular/core';
import { Task } from '../../models/task.model';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss']
})
export class CommentDialogComponent {
  public task: Task;

  constructor(public dialogRef: MatDialogRef<CommentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.task = data.task;
  }

  onConfirm(): void {
    this.dialogRef.close(this.task);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
