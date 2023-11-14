import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminloginComponent implements OnInit {

  email: any = 'admin@rossum.io'
  password: any = 'password@7'
  snackBarRef: MatSnackBarRef<SimpleSnackBar>
  valForm: FormGroup;
  formdata: FormData = new FormData();
  user: any;
  constructor(fb: FormBuilder, public http: HttpClient, public router: Router,private _snackBar: MatSnackBar) {

    this.valForm = fb.group({
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
      'password': [null, Validators.required]
    });

    this.user = JSON.parse(localStorage.getItem("login_data"));

    if (this.user) {
      this.router.navigate(['/home'])
    }
  }

  // loginHr($ev, val) {
  //   $ev.preventDefault();
  //   let c;
  //   for (c in this.valForm.controls) {
  //     this.valForm.controls[c].markAsTouched();
  //   }
  //   if(this.valForm.valid){
  //     if(this.email==val.email && this.password==val.password){
  //       this.router.navigate(['/admin']);

  //     }
  //     else{
  //       this._snackBar.open("Email or Password is Incorrect ! ","X",
  //       {

  //         duration: 2500,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'right',

  //         panelClass: ['red-snackbar']


  //       });
  //       // alert('Entered email & password are invalid !')
  //     }
  //   }
  // }
  
  loginHr($ev, value: any) {
    $ev.preventDefault();
    let c;
    for (c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      let url = environment.server_url + 'admin/login';
      // this.formdata.append('email', this.valForm.value['email']);
      // this.formdata.append('password', this.valForm.value['password']);
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Basic ' + btoa(value.email + ":" + value.password)
        })
      };
      this.http.post(url, this.formdata, httpOptions).subscribe(data => {
        console.log(data);
        const d = data;
        if (d['login'] === true) {
          localStorage.setItem('login_data', JSON.stringify(d));
          localStorage.setItem('access_token_cookie', d['access_token_cookie']);
          localStorage.setItem('refresh_token_cookie', d['refresh_token_cookie']);
          this.router.navigate(['/admin']);
        } else {
          alert(d['message']);
        }
        // this.valForm.reset();
      });
    }
  }

  ngOnInit() {
  }

}

