import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-faculty-forgot-password',
  templateUrl: './faculty-forgot-password.component.html',
  styleUrls: ['./faculty-forgot-password.component.scss']
})
export class FacultyForgotPasswordComponent implements OnInit {

  email: any = '';
  message: string;
  v: string = null;
  valForm: FormGroup;
  formdata: FormData = new FormData();
  spinner = false;
  constructor(fb: FormBuilder, public http: HttpClient, public router: Router) {
    this.valForm = fb.group({
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
    });
  }

  submitForm($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.spinner = true;
      var url = environment.server_url + 'forgot/password';
      let headers = new HttpHeaders();
      const httpOptions = {
        headers: new HttpHeaders({
          // 'content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      }
      console.log(value)
      this.http.post(url,value, httpOptions).subscribe(data => {
        console.log(data)
        this.spinner = false;
        this.email = '';
        this.message = data['message'];
        this.valForm.reset();
      }, error =>{
        this.spinner = false;
      });
    }
  }

  reset() {
    window.location.reload();
  }

  ngOnInit() {
  }

}
