import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  result: any;
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ok() {
    this.result = true;
    this.dialogRef.close(this.result);
  }
  cancel() {
    this.result = false;
    this.dialogRef.close(this.result);
  }
  submit() {
    this.result = true;
    this.dialogRef.close(this.result);
  }
  no() {
    this.result = false;
    this.dialogRef.close(this.result);
  }
  submits() {
    this.result = true;
    this.dialogRef.close(this.result);
  }
  ngOnInit() {
  }

}
