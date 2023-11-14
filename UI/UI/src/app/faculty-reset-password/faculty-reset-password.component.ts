import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Routes, RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faculty-reset-password',
  templateUrl: './faculty-reset-password.component.html',
  styleUrls: ['./faculty-reset-password.component.scss']
})
export class FacultyResetPasswordComponent implements OnInit {

  reset_password: any;
  valForm: FormGroup;
  passwordForm: FormGroup;
  password: any;
  formdata: FormData = new FormData();
  flag: any;
  s: any;
  email: any;
  uid: any;
  message: any;
  spinner = false;
  hide: boolean = true;
  hide1: boolean = true;
  // public dialog: MatDialog
  constructor(public http: HttpClient, public router: Router, fb: FormBuilder, public route: ActivatedRoute) {

    const password = new FormControl('', Validators.compose([Validators.required]));
    const certainPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);

    this.passwordForm = fb.group({
      'password': password,
      'confirmPassword': certainPassword
    });

    this.valForm = fb.group({
      'passwordGroup': this.passwordForm,
    });

    route.params.subscribe(params => {
      console.log(params);
      this.uid = params['uid'];
      this.checkExpiry(this.uid);
    });
  }

  checkExpiry(uid: any): any {
    const url = environment.server_url + 'check/resetlink';
    const body = {
      'uid': uid
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // "Authorization": "Basic " + btoa(value.email + ":" + value.password)
      })
    };
    this.http.post(url, body, httpOptions).subscribe(data => {
      this.flag = data['expired'];
      if (data['expired'] === false) {
        this.email = data['email'];
      }
    });
  }


  resetPassword(value: any) {
    console.log(this.valForm);
    // tslint:disable-next-line:prefer-const
    // $ev.preventDefault();
    // let c;
    // for (c in this.valForm.controls) {
    //   this.valForm.controls[c].markAsTouched();
    // }
    if (this.valForm.valid) {
      this.spinner = true;
      type Tuple = [string];
      let x: Tuple;
      x = [value];
      let p, q: any;
      for (const j of x) {
        p = j['passwordGroup']['password'];
        q = j['passwordGroup']['confirmPassword'];
      }
      const body = {
        '_id': this.uid,
        'password': p
      }
      const url = environment.server_url + 'reset/password';
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*'
        })
      };
      this.http.post(url, body, httpOptions).subscribe(data => {
          console.log(data)
          this.spinner = false;
          this.message = data['message'];
          if (data['flag'] == true) {
            this.valForm.reset()
            Swal.fire('', this.message, "success");
            this.router.navigate(['/login'])
          } else {
            this.valForm.reset()
            Swal.fire('', this.message, "error");
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  ngOnInit() {
  }
}
