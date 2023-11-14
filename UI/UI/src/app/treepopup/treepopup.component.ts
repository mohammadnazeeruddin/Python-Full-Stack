import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
// import { material_data } from './shared/material';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree'

@Component({
  selector: 'app-treepopup',
  templateUrl: './treepopup.component.html',
  styleUrls: ['./treepopup.component.scss']
})
export class TreepopupComponent implements OnInit {
  // material_data = material_data
  tree_data = []
  treeControl: any;
  tree_dataSource: any;
  hasChild: any;
  // data: any
  indeterminate = false;
  final_data: any = '';
  constructor(public dialogRef: MatDialogRef<TreepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  assign() {
    this.dialogRef.close(true)
  }
  
  close() {
    this.dialogRef.close(false)
  }
}