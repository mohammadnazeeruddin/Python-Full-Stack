import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Spinkit, SpinnerVisibilityService } from 'ng-http-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-firm-registration',
  templateUrl: './new-firm-registration.component.html',
  styleUrls: ['./new-firm-registration.component.scss']
})
export class NewFirmRegistrationComponent implements OnInit {

  public spinkit = Spinkit;
  CompanyRegisForm: FormGroup;
  companyList: any = [];

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: 'success',
  }

  constructor(private formbuilder: FormBuilder, public router: Router) {

   this.CompanyRegisForm = formbuilder.group({
     'companyName': ['', Validators.required],
     'ownerName': ['', Validators.required],
     'abn': ['', Validators.required],
     'bcp': ['', Validators.required]
   })
 }

 ngOnInit() {

 }
  onSubmit(formDirective: FormGroupDirective) {
      this.companyList.push(this.CompanyRegisForm.value)
    this.CompanyRegisForm.reset();
  }



}
