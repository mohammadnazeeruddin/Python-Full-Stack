import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  sessions = ['poor', 'average', 'good', 'helpful']
  spinner = false;
  access_token_cookie = localStorage.getItem('access_token_cookie');

  // feedBack() {
  //   Swal.fire("Great!", "Thank you for your feedback!", "success");
  // }
  formdata: FormData = new FormData();
  valForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<FeedbackComponent>, fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, public router: Router) {
      console.log(data)
    this.valForm = fb.group({
      'session': [null, Validators.required],
      'curriculam': [null, Validators.required],
      'suggestions': [null, Validators.required]
    });
  }
  feedBack($ev, value: any) {
    $ev.preventDefault();
    this.spinner = true;
    let c;
    for (c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      console.log(this.valForm.value)
      let url = environment.server_url + 'student_feedack';
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          "authorization": "Bearer " + this.access_token_cookie
        })
      };
      var body: any = {}
      console.log(this.data)
        body['_id'] = this.data['_id']
        body['feedback'] = 
        { "How was the session today?": value.session,
         "Is the training relevant to your curriculum?": value.curriculam,
        "Any suggestions?": value.suggestions}
      
        // console.log(JSON.parse(body))
      this.http.post(url, body, httpOptions).subscribe(data => {
        this.spinner = false;
        if(data['flag'] == true){
              Swal.fire("Great!", "Thank you for your feedback!", "success");
          this.dialogRef.close()
        } else{
          alert(data['msg'])
        }
      }, error => {
        console.log(error);
        this.spinner = false;
      });
    }
  }
  ngOnInit() {
  }

}
// import { Component, OnInit, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
// import { CustomValidators } from 'ng2-validation';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-feedback',
//   templateUrl: './feedback.component.html',
//   styleUrls: ['./feedback.component.scss']
// })
// export class FeedbackComponent implements OnInit {
//   spinner = false;
//   hide = true;
//   // feedBack(){
//   //   Swal.fire("Great!", "Thank you for your feedback!", "success");
//   // }
//   formdata: FormData = new FormData();
//   valForm: FormGroup;
//   sessions = ['poor','average','good','helpful']
//   constructor(public dialogRef: MatDialogRef<FeedbackComponent>, fb: FormBuilder,
//     @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, public router: Router) {
//     // }
//     // constructor( fb: FormBuilder, public http: HttpClient, public router: Router) {
//     this.valForm = fb.group({
//       'session': [null, Validators.required],
//       'curriculam': [null, Validators.required],
//       'suggestions': [null, Validators.required]
//     });
//   }

//   ngOnInit() {
//   }

//   feedBack($ev, value: any) {
//     $ev.preventDefault();
//     this.spinner = true;
//     let c;
//     for (c in this.valForm.controls) {
//       this.valForm.controls[c].markAsTouched();
//     }
//     if (this.valForm.valid) {
//       console.log(this.valForm.value)
//       // let url = environment.server_url + 'trainer/login';
//       // const httpOptions = {
//       //   headers: new HttpHeaders({
//       //     'Access-Control-Allow-Origin': '*',
//       //     'Authorization': 'Basic ' + btoa(value.email + ":" + value.password)
//       //   })
//       // };
//       // var body = JSON.stringify({ "email": value.email, "password": value.password });
//       // this.http.post(url, body, httpOptions).subscribe(data => {
//       //   this.spinner = false;
//       //   const d = data;
//       //   console.log(d)
//       //   if (d['login'] === true) {
//       //     localStorage.setItem('login_data', JSON.stringify(d));
//       //     localStorage.setItem('access_token_cookie', d['access_token_cookie']);
//       //     localStorage.setItem('refresh_token_cookie', d['refresh_token_cookie']);
//       //     // this.router.navigate(['/material/'+ this.material_list[0]['_id'] + "/none/none"]);
//       //     this.router.navigate(['/trainer/groups']);
//       //   } else {
//       //     this.spinner = false;
//       //     alert(d['message']);
//       //   }
//       // }, error => {
//       //   console.log(error);
//       //   this.spinner = false;
//       // });
//     }
//   }
// }
