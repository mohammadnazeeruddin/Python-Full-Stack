import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { material_data } from './../../shared/material';
import { ArrayDataSource } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree'
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-treepopup',
  templateUrl: './treepopup.component.html',
  styleUrls: ['./treepopup.component.scss']
})
export class TreepopupComponent implements OnInit {
  material_data = material_data
  tree_data = []
  treeControl: any;
  tree_dataSource: any;
  hasChild: any;
  formdata: FormData = new FormData();
  valForm: FormGroup;
  // data: any
  indeterminate = false;
  final_data: any = '';
  days = []
  constructor(public dialogRef: MatDialogRef<TreepopupComponent>, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.valForm = fb.group({
      'date': [null, Validators.required]
    })
    for (let i = 1; i < 61; i++) {
      this.days.push(i)
    }
    console.log(this.days)
  }

  ngOnInit() {
  }
  day: any;
  selectDate(e) {
    this.day = e.value
  }
  assign($ev, value: any) {
    $ev.preventDefault();
    let c;
    let data = {}
    for (c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      data['flag'] = true
      data['days'] = this.day
      this.dialogRef.close(data)
    }
  }
  close() {
    let data = {}
    data['flag'] = false
    this.dialogRef.close(data)
  }
}