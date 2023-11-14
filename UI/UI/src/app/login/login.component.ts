import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { corouselData } from '../shared/homepageData'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  sub_domain_data: any;
  corouselList:any;

  constructor(public http: HttpClient,public router: Router) {
    this.corouselList = corouselData;
   }

 

  ngOnInit() {
    var sub = window.location.hostname;
    var ar = sub.split(".");
    if (ar.length > 1) {
      var url = environment.server_url + "get/sub_domain_details_by_name/" + ar[0];
      this.http.get(url).subscribe(
        data => {
          this.sub_domain_data = data;
        }, 
        error => {
          console.log(error);
        }
      )
    }
  }
  admin_login(){
    this.router.navigate(['admin/login'])
  }
}
