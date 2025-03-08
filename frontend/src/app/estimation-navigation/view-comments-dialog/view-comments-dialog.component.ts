import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-view-comments-dialog',
  templateUrl: './view-comments-dialog.component.html',
  styleUrls: ['./view-comments-dialog.component.scss']
})
export class ViewCommentsDialogComponent {
  public comments: string[];
    constructor(
       public dialogRef: MatDialogRef<ViewCommentsDialogComponent>,
       @Inject(MAT_DIALOG_DATA) public data: any
     ) {this.comments = data.comments}

     onCancel(): void {
       this.dialogRef.close(false);
     }
  }
