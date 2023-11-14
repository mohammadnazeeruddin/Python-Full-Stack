import { environment } from '../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-faculty-login',
  templateUrl: './faculty-login.component.html',
  styleUrls: ['./faculty-login.component.scss']
})
export class FacultyLoginComponent implements OnInit {

  valForm: FormGroup;
  formdata: FormData = new FormData();
  user:any;
  spinner = false;
  hide = true;
  copy_right_date = new Date();
  material_list: any;
  
  constructor( fb: FormBuilder, public http: HttpClient, public router: Router) {
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
        if(this.user && "role" in this.user) {
          this.router.navigate(['/trainer/groups']);
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
      let url = environment.server_url + 'trainer/login';
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Basic '+ btoa(value.email + ":" + value.password)
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
          // this.router.navigate(['/material/'+ this.material_list[0]['_id'] + "/none/none"]);
          this.router.navigate(['/trainer/groups']);
        } else {
          this.spinner = false;
          alert(d['message']);
        }
      }, error => {
        console.log(error);
        this.spinner = false;
      });
    }
  }

  selected(event: any) {
  }

  ngOnInit() {
  }

}
