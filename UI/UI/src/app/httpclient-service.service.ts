import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpclientServiceService {
  access_token_cookie: String;
  message : any;

   // method to set value of message field
   public setMessage(message):void {
    this.message=message;
 }

 // method to read value of message field
 public readMessage() {
console.log(this.message) 
// if(this.message !=undefined) {  
  return this.message;
// }
 }

  editor_central_url: String = environment.server_url
  constructor(public http: HttpClient) {
    this.access_token_cookie = localStorage.getItem('access_token_cookie');
  }

  getMethod(url) {
    url = this.editor_central_url + url
    console.log(url)
    var headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.access_token_cookie,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.http.get(url, { headers: headers });
  }

  postMethod(url, body) {
    url = this.editor_central_url + url
    var headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.access_token_cookie,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.http.post(url, body, { headers: headers });
  }

  patchMethod(url, body) {
    url = this.editor_central_url + url;
    var headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.access_token_cookie,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.http.patch(url, body, { headers: headers });
  }

  putMethod(url, body) {
    url = this.editor_central_url + url;
    var headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.access_token_cookie,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return this.http.put(url, body, { headers: headers });
  }

}
