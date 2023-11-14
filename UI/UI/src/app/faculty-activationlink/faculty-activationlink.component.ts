import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-faculty-activationlink',
  templateUrl: './faculty-activationlink.component.html',
  styleUrls: ['./faculty-activationlink.component.scss']
})
export class FacultyActivationlinkComponent implements OnInit {

  message: any;
  flag: any;
  constructor(public http: HttpClient, public router: Router, public route: ActivatedRoute) {
    route.params.subscribe(params => {
      console.log(params)
      let uid;
      uid = params['uid'];
      console.log(uid);
      this.checkExpiry(uid);
    });
  }

  checkExpiry(uid: any): any {
    let url;
    url = environment.server_url + 'check/activationlink';
    const body = {
      '_id': uid
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
    };
    this.http.post(url, body, httpOptions).subscribe(
      data => {
        this.message = data['message'];
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
  }

}
