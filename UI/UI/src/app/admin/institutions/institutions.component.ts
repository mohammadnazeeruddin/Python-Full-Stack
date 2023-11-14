import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.scss']
})
export class InstitutionsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  addInstitution() {
    this.openDialog()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { type: 'add' }
    });
  }
}
