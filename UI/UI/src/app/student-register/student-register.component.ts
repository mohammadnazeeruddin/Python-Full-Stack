import { PopupComponent } from './../popup/popup.component';
import { environment } from '../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { colleges_list } from '../shared/colleges';

@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.scss']
})
export class StudentRegisterComponent implements OnInit {

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
  college_list = colleges_list;
  select: any;
  // value = 'student';
  sub_domain_data: any;

  constructor(public http: HttpClient, public router: Router, fb: FormBuilder, public dialog: MatDialog) {
    let password = new FormControl('', Validators.compose([Validators.required]));
    let certainPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);

    this.passwordForm = fb.group({
      'password': password,
      'confirmPassword': certainPassword
    });

    this.valForm = fb.group({
      'username': this.username,
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
      'passwordGroup': this.passwordForm,
      'contact': this.contactnumber,
      // 'institution': [null]
    });
    localStorage.clear();
  }

  selected($event) {
  }

  // onChange(event) {
  //   this.value = event.value
  // }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      "data": data
    });
  }

  submitForm($ev, value: any) {
    this.formdata = new FormData();
    $ev.preventDefault();
    // tslint:disable-next-line:forin
    for (let c in this.valForm.controls) {
      if(c['institution'] == 'student'){
        this.valForm.controls['institution'].markAsUntouched()
      }
      else{
      this.valForm.controls[c].markAsTouched();
      }
    }
    // tslint:disable-next-line:forin
    for (let c in this.passwordForm.controls) {
      this.passwordForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      this.spinner = true;
      var url = environment.quiz_url + 'user/registration';
      $ev.preventDefault();
      type Tuple = [string];
      let x: Tuple;
      x = [value];
      let p: any;
      for (let j of x) {
        p = j['passwordGroup']['password'];
      }

      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        })
      }

      var sub = window.location.hostname;
      var ar = sub.split(".");
      var code;
      if(this.sub_domain_data) {
        code = this.sub_domain_data['code']
      } else {
        code = "";
      }
       
      this.sub_domain_data = 'jntun'

      var body = JSON.stringify({
        "name": this.valForm.value['username'],
        'email': this.valForm.value['email'],
        'password': this.valForm.value['passwordGroup']['password'],
        'contact': String(this.valForm.value['contact']),
        'provider': 'pythonguru',
        // 'institution': this.valForm.value['institution'],
        "code": this.sub_domain_data
      })
console.log(body)
      this.http.post(url, body, httpOptions).subscribe(data => {
        this.openDialog({"message": data['message']})
        this.spinner = false;
        this.message = data['message'];
        this.valForm.reset();
      }, error => {
        console.log(error)
        this.spinner = false;
      })
    }
  }

  ngOnInit() {
    var sub = window.location.hostname;
    var ar = sub.split(".");
    if ((ar.length > 1) && (ar[0] != "www")) {
      var url = environment.server_url + "get/sub_domain_details_by_name/" + ar[0];
      this.http.get(url).subscribe(
        data => {
          console.log(data)
          this.sub_domain_data = data;
        }, 
        error => {
          console.log(error);
        }
      )
    }
  }

}
