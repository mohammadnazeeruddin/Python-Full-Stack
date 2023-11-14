import { PopupComponent } from './../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { allowed_usernames } from '../shared/trueData';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {

  valForm: FormGroup;
  formdata: FormData = new FormData();
  user:any;
  spinner = false;
  hide = true;
  copy_right_date = new Date();
  material_list: any;


  constructor(public dialog: MatDialog, fb: FormBuilder, public http: HttpClient, public router: Router) {
    this.valForm = fb.group({
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
      'password': [null, Validators.required]
    });
    this.getMaterials();
  }

  getMaterials() {
    this.http.get(environment.server_url + "get/materials").subscribe(
      data => {
        this.material_list = data;
        this.user = JSON.parse(localStorage.getItem("login_data"));
        if(this.user && !("role" in this.user)) {
          // this.router.navigate(['/material/'+ this.material_list[0]['_id'] + "/none/none"]);
          this.router.navigate(['/home']);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  submitForm($ev, value: any) {
    $ev.preventDefault();
    this.spinner = true;
    let c;
    for ( c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      let url = environment.quiz_url + 'user/login';
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Basic '+ btoa(value.email + ":" + value.password),
          'Content-Type': 'application/json'
        })
      };
      var body = JSON.stringify({"email": value.email, "password": value.password});
      this.http.post(url, body, httpOptions).subscribe(data => {
        
        this.spinner = false;
        const d = data;
        console.log(d)
        if (d['login'] === true) {
          localStorage.setItem('login_data', JSON.stringify(d));
          localStorage.setItem('access_token_cookie', d['access_token_cookie']);
          localStorage.setItem('refresh_token_cookie', d['refresh_token_cookie']);
          if(d["email"])
          this.router.navigate(['/home']);
          // this.router.navigate(['/material/'+ this.material_list[0]['_id'] + "/none/none"])
        } else {
          this.spinner = false;
          alert(d['message']);
        }
      }, error => {
        this.spinner = false;
      });
    }
  }

  selected(event: any) {
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      "data": data
    });
  }

  ngOnInit() {
  }

}
