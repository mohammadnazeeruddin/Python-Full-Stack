import { environment } from '../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpclientServiceService } from './../httpclient-service.service';

@Component({
  selector: 'app-faculty-registration',
  templateUrl: './faculty-registration.component.html',
  styleUrls: ['./faculty-registration.component.scss']
})
export class FacultyRegistrationComponent implements OnInit {

  valForm: FormGroup;
  username: string;
  contactnumber: number;
  passwordForm: FormGroup;
  formdata: FormData = new FormData();
  name: string;
  email: any;
  password: any;
  contact: any;
  register_details: FormGroup;
  message: string;
  result: any;
  spinner = false;
  select: any;
  value = 'student';
  hide: boolean = true;
  hide1: boolean = true;
  college_list: any;
  sub_domain_data: string;

  constructor(public http: HttpClient, public http1: HttpclientServiceService, public router: Router, fb: FormBuilder) {
    let password = new FormControl('', Validators.compose([Validators.required]));
    let certainPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);

    this.passwordForm = fb.group({
      'password': password,
      'confirmPassword': certainPassword
    });

    this.valForm = fb.group({
      'username': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
      'passwordGroup': this.passwordForm,
      'contact': [null, Validators.required],
      'institution': [null, Validators.required]
    });
  }

  getColleges() {
    // var url = 'get/colleges';
    // this.sub_domain_data = 'localhost'
    var url = environment.server_url + 'get/colleges';

    // console.log(JSON.parse(body))
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json'
      })
    }
    let body = {
      'domain': this.sub_domain_data
    }
    this.http.post(url, body, httpOptions).subscribe(data => {
        console.log(data)
        // for (let i in data['college_list']) {
        //   data['college_list'][i] = data['college_list'][i].toUpperCase()
        // }
        this.college_list = data['colleges_list']
      })
    }

  selected($event) {
        console.log($event)
      }

  onChange(event) {
        this.value = event.value
      }

  submitForm($ev, value: any) {
        $ev.preventDefault();
        // tslint:disable-next-line:forin
        for(let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    // tslint:disable-next-line:forin
    for (let c in this.passwordForm.controls) {
      this.passwordForm.controls[c].markAsTouched();
    }
    console.log(this.valForm, "this.valForm")
    if (this.valForm.valid) {
      this.spinner = true;

      var url = environment.server_url + 'trainer/registration';
      $ev.preventDefault();
      console.log(this.valForm.value);
      var body = JSON.stringify({
        "name": this.valForm.value['username'],
        'email': this.valForm.value['email'],
        'password': this.passwordForm.value['password'],
        'contact': this.valForm.value['contact'],
        'institution': this.valForm.value['institution'],
        'domain': this.sub_domain_data
        // 'provider': 'pythonguru'
      })
      console.log(JSON.parse(body))
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'content-type': 'application/json'
        })
      }
      this.http.post(url, body, httpOptions).subscribe(data => {
        console.log(data)
        this.spinner = false;
        this.message = data['message'];
        if (data['flag'] == true) {
          // var res = "<h2 style='display: contents;color: green;'>" + result['batch_name'] + "</h2>"
          Swal.fire('', this.message, "success");
        } else {
          Swal.fire('', this.message, "error");

        }
        this.valForm.reset();
      }, error => {
        this.spinner = false;
      })
    }
  }

  ngOnInit() {
    var sub = window.location.hostname;
    var ar = sub.split(".");
    if (ar.length > 1) {
      this.sub_domain_data = ar[0];
    }
    else if (ar[0] == "localhost") {
      this.sub_domain_data = "localhost";
    }
    this.getColleges()
  }

  forgot_password() {
    this.router.navigate(['forgot/password'])
  }

}
