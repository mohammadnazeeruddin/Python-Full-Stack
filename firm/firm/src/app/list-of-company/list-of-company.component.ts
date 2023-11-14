import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogOverviewExampleDialogComponent } from './dialog.component';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-list-of-company',
  templateUrl: 'list-of-company.component.html',
  styleUrls: ['list-of-company.component.scss'],
})
export class ListOfCompanyComponent {

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '1000px',
      height: '700px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

}

