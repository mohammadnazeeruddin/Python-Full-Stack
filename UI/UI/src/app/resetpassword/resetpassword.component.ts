import { PopupComponent } from './../popup/popup.component';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
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
  constructor(public http: HttpClient, public dialog: MatDialog, public router: Router, fb: FormBuilder, public route: ActivatedRoute) {

    const password = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]{6,10}$')]));
    const certainPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);

    this.passwordForm = fb.group({
      'password': password,
      'confirmPassword': certainPassword
    });

    this.valForm = fb.group({
      'passwordGroup': this.passwordForm,
    });

    route.params.subscribe(params => {
      this.uid = params['uid'];
      this.checkExpiry(this.uid);
    });
  }
  checkExpiry(uid: any): any {
    const url = environment.quiz_url + 'check/resetlink';
    // let headers = new HttpHeaders();
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

  resetPassword($ev, value: any) {
    // tslint:disable-next-line:prefer-const
    $ev.preventDefault();
    type Tuple = [string];
    let x: Tuple;
    x = [value];
    let p, q: any;
    for (const j of x) {
      p = j['passwordGroup']['password'];
      q = j['passwordGroup']['confirmPassword'];

    }
    var body = JSON.stringify({
      'password': this.valForm.value['passwordGroup']['password'],
      'confirmPassword': this.valForm.value['passwordGroup']['confirmPassword'],
      'email': this.email,
      'uid': this.uid
    })
    const url = environment.quiz_url + 'user/reset/password';
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': "application/json"
      })
    };
    this.http.post(url, body, httpOptions).subscribe(data => {
      console.log(data)
      this.message = data['message'];
      this.openDialog();
      this.valForm.reset();
      this.router.navigate(['/login']);
    });

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { 'type': 'resetPassword', 'msg': this.message }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  ngOnInit() {
  }

}

