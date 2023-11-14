import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Spinkit, SpinnerVisibilityService } from 'ng-http-loader';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public spinkit = Spinkit;
  attendanceForm: FormGroup;

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: 'success',
  }


  constructor(private formbuilder: FormBuilder, private spinner: SpinnerVisibilityService,
     public snackBar: MatSnackBar, public router: Router) {

    this.attendanceForm = formbuilder.group({
      'userName': ['', Validators.required],
      'role': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }

  ngOnInit() {

  }
  onSubmit(formDirective: FormGroupDirective) {
    console.log(this.attendanceForm.value);
    this.router.navigateByUrl('/app-company-registration');
  }

}
