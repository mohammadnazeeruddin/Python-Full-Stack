import { Component, OnInit } from '@angular/core';
// import { SettingsService } from '../settings/settings.service';
import { environment } from '../../environments/environment';
import { Routes, RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
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
    this.formdata = new FormData();
    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.spinner = true;
      var url = environment.quiz_url + 'user/forgot/password';
      const httpOptions = {
        headers: new HttpHeaders({
          'content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      }
      var body = JSON.stringify({"email": this.valForm.value['email']})
      this.http.post(url, body, httpOptions).subscribe(data => {
        this.spinner = false;
        this.email = '';
        this.message = data['message'];
        this.valForm.reset();
      }, error =>{
        console.log(error);
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
