
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpclientServiceService } from './../../httpclient-service.service';
import { ThrowStmt } from '@angular/compiler';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  user = JSON.parse(localStorage.getItem("login_data"));
  access_token_cookie = this.user['access_token_cookie']
  valForm: FormGroup;
  spinner: boolean = false;
  // formdata: FormData = new FormData()

  constructor(public http: HttpClient, public http1: HttpclientServiceService, public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, fb: FormBuilder, private _snackBar: MatSnackBar) {
    console.log(data)
    if (data['type'] == 'add') {
      // this.getDomains()
      this.valForm = fb.group({
        'institution': [null, Validators.required],
        // 'domain_name': [null, Validators.required],
        'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
        'location': [null, Validators.required]
      });
    }
  }


  sub_domain_data: any;

  ngOnInit() {
    var sub = window.location.hostname;
    console.log(sub)
    var ar = sub.split(".");
    console.log(ar)
    // if (ar.length > 1) {
      // var url = "get/sub_domain_details_by_name/" + ar[0];
      // this.http.getMethod(url).subscribe(
      //   data => {
      this.sub_domain_data = ar[0];
      //   }, 
      //   error => {
      //     console.log(error);
      //   }
      // )
    // }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  create_superAdmin($ev, value: any) {


    // this.sub_domain_data = 'pg'
    // var url = environment.server_url + 'get/colleges';

    // console.log(JSON.parse(body))
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Access-Control-Allow-Origin': '*',
    //     'content-type': 'application/json'
    //   })
    // }
    // let body = {
    //   'domain': this.sub_domain_data
    // }
    this.spinner = true
    // this.sub_domain_data = 'pg'
    // console.log(value, this.valForm)
    $ev.preventDefault();
    let c;
    for (c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      console.log(this.sub_domain_data)
      this.valForm.value['domain'] = this.sub_domain_data
      this.valForm.value['role'] = 'admin'
      console.log(this.valForm.value)
      // let url = "create/admin";
      var url = environment.trainer_url + "create/admin";
      console.log(url)
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.access_token_cookie,
          'Access-Control-Allow-Origin': '*',
          'content-type': 'application/json'
        })
      }
      console.log(value, this.valForm)
      this.http.post(url, value, httpOptions).subscribe(data => {
        console.log(data)
        this.openSnackBar(data['message'], 'msg')
        this.spinner = false
        this.valForm.reset()
        this.dialogRef.close()
      }, error => {
        this.spinner = false
      })
    }
  }

  domains: any;
  // getDomains() {

  //   let url = environment.trainer_url + "get/domains";
  //   this.http.get(url).subscribe(data => {
  //     for (let i in data) {
  //       console.log(i)
  //       data[i]['code'] = data[i]['code'] + '.truequalify.com'
  //     }
  //     console.log(data)
  //     this.domains = data
  //     console.log(data)
  //   }, error => {
  //     console.log(error)
  //   }
  //   );
  // }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar'],
    });
  }

}
