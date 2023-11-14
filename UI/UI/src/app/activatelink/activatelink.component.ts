import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-activatelink',
  templateUrl: './activatelink.component.html',
  styleUrls: ['./activatelink.component.scss']
})
export class ActivatelinkComponent implements OnInit {

  message: any;
  flag: any;

  constructor(public http: HttpClient, public router: Router, public route: ActivatedRoute) {
    route.params.subscribe(params => {
      let uid;
      uid = params['uid'];
      this.checkExpiry(uid);
    });
  }

  checkExpiry(uid: any): any {
    let url;
    url = environment.quiz_url + 'check/activationlink';
    const body = {
      'uid': uid
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
    };
    this.http.post(url, body, httpOptions).subscribe(data => {
      this.message = data['message'];
    });
  }

  ngOnInit() {
  }

}

