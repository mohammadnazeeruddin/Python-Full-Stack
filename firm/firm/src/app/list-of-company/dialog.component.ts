import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { Inject, Component } from '@angular/core';
import { Spinkit, SpinnerVisibilityService } from 'ng-http-loader';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

export interface DialogData {
    animal: string;
    name: string;
  }

@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.scss']
  })
  export class DialogOverviewExampleDialogComponent {
    fileName = 'Attach File:';
    selected = 'option2';
    period: string;
    period1: string;
    period2: string;
    year: any[] = [
        {label: '2019', value: '2019'},
        {label: '2020', value: '2020'},
        {label: '2021', value: '2021'},
        {label: '2022', value: '2022'},
        {label: '2023', value: '2023'},
        {label: '2024', value: '2024'},
        {label: '2025', value: '2025'},
        {label: '2026', value: '2026'},
    ];
    public spinkit = Spinkit;
  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: 'success',
  }
    constructor( private spinner: SpinnerVisibilityService,
      public snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
    onNoClick(): void {
      this.dialogRef.close();
    }
  }
