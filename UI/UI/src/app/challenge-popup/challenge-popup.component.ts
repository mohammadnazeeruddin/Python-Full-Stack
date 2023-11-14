import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import TimeMe from 'timeme.js';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, RoutesRecognized, Router, NavigationEnd } from '@angular/router';
import { take, filter, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-challenge-popup',
  templateUrl: './challenge-popup.component.html',
  styleUrls: ['./challenge-popup.component.scss']
})
export class ChallengePopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ChallengePopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public http: HttpClient, 
    public route: ActivatedRoute,
    public router: Router) { 
      this.material_id = data['material_id'];
      this.chapter_id = data['chapter_id'];
      this.page_num = data['page_num'];
    }

  @ViewChild('ifrm', { static: false }) ifrm: ElementRef;

  sub_interavl: any;
  access_token_cookie = localStorage.getItem('access_token_cookie');
  chapter_id: any;
  material_id: any;
  page_num: number;

  ngOnInit() {
    if (this.data['type'] == "challenge") {
      this.sub_interavl = setInterval(() => {
        this.getFrame();
      }, 500);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  time_me() {
    TimeMe.initialize({
      currentPageName: "challenge", // current page
      idleTimeoutInSeconds: 120, // stop recording time due to inactivity
    });
  }

  reset_time_me(challenge_score: number = null) {
    console.log(challenge_score)
    var body = {
      "read_time": TimeMe.getTimeOnCurrentPageInSeconds(),
    }
    if (challenge_score != null && challenge_score != undefined) {
      body['challenge'] = challenge_score;
      this.sendUserActivity(this.material_id, this.chapter_id, this.page_num, body);
    } else {
      if ((this.access_token_cookie != null) && TimeMe.getTimeOnCurrentPageInSeconds() && (TimeMe.getTimeOnCurrentPageInSeconds() > 60)) {
        this.sendUserActivity(this.material_id, this.chapter_id, this.page_num, body);
      }
    }
    console.log(body)
    TimeMe.resetRecordedPageTime("challenge");
    this.time_me()
  }

  sendUserActivity(material_id, chapter_id, page_id, activity) {
    var headers = new HttpHeaders({
      "content-type": "application/json",
      "authorization": "Bearer " + this.access_token_cookie
    });
    var url = environment.server_url + "store/userActivity";
    var body = JSON.stringify({
      "material_id": material_id,
      "chapter_id": chapter_id,
      "page_id": page_id,
      "activity": activity
    });
    this.http.post(url, body, {"headers": headers}).subscribe(
      data => {
        console.log(data);
      }, error => {
        console.log(error);
      }
    );
  }

  getFrame() {
    var frame = this.ifrm.nativeElement.contentWindow;
    var but = frame.document.getElementById('user_sub');
    if (but != null) {
      clearInterval(this.sub_interavl);
    }
    if (frame.document.getElementById('user_sub') != null) {
      frame.document.getElementById('user_sub').addEventListener("click", function () {
        var user_output = frame.document.getElementById('output').innerText;
        var code_answer = localStorage.getItem('code_answer');
        if (user_output === code_answer) {
          var user_code = localStorage.getItem('user_code'); // getting user_code.
          // user_entered_code.push(user_code)
          document.getElementById("success").innerText = "Code Submitted Successfully!";
          document.getElementById("aler").click();
          document.getElementById("sendActivity_five").click();
          console.log("kokoko")
        } else {
          document.getElementById("success").innerText = "Code Submission Failed...";
          document.getElementById("aler").click();
          document.getElementById("sendActivity_zero").click();
          console.log("loloo")
        }
      })
    }
  }

}
