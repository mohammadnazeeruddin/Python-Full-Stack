import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material';
import { PopupComponent } from '../popup/popup.component';
import { MyCoursesComponent } from '../my-courses/my-courses.component';
import { HttpclientServiceService } from './../httpclient-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  scroll_flag: boolean = false;
  taskCnt: any;
  join_group_flag: boolean;
  join_group_form: FormGroup;
  groups_list: any;
  material_list: any;
  user = JSON.parse(localStorage.getItem("login_data"));
  access_token_cookie = this.user['access_token_cookie'];
  groups_data = [];
  group_id: any;
  selected_group: any;

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    if (window.pageYOffset > 50) {
      this.scroll_flag = true;
    } else {
      this.scroll_flag = false;
    }
  }

  scroll_fun(event) {
    window.scroll(0, 0);
  }

  constructor(
    public router: Router,
    public http1: HttpclientServiceService,
    public dialog: MatDialog,
    public fb: FormBuilder,
    public http: HttpClient,
    public route: ActivatedRoute) {

    this.route.paramMap.subscribe(
      data => { 
        this.group_id = data.get("group_id"); 
        this.get_groups();
      }
    );

    this.join_group_form = fb.group({
      "group_id": [null, Validators.required],
      "code": [null, Validators.required],
      // "subject": [null, Validators.required]
    });
    this.getStudentTaskCount()
  }
  count: any;
  getStudentTaskCount(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token_cookie,

      })
    }
    this.http.get(environment.server_url + "get_student_task_count", httpOptions).subscribe(
      data => {
        console.log(data)
        if(data['flag'] == true){
          this.count = data['count']
          console.log(this.count)
        }
        else{
          this.router.navigate(['/login'])
        }
      }
    )
  }
  changeGroup(group) {
    this.selected_group = group;
    this.router.navigate(['home', this.selected_group['_id']])
  }

  get_groups() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token_cookie,

      })
    }
    this.http.get(environment.server_url + "get/user_groups", httpOptions).subscribe(
      data => {
        this.groups_data = [];
        if(this.group_id) {
          for (let i in data) {
            if(data[i]['_id'] == this.group_id) {
              this.selected_group = data[i];
            }
            this.groups_data.push(data[i]);
          }
        }
        else {
          for (let i in data) {
            this.groups_data.push(data[i]);
          }
          if(this.groups_data.length > 0) {
            this.selected_group = this.groups_data[0];
            if(this.router.url === '/home') {
              this.router.navigate(['home', this.groups_data[0]['_id']])
            }
          }
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  // selectSpecialization(e) {
  //   localStorage.setItem("group_course", JSON.stringify(this.groups_data[e]))
  // }

  ngOnInit() {
    // this.getMaterials();
    this.getGroupsList();
  }

  getMaterials() {
    this.http.get(environment.server_url + "get/materials").subscribe(
      data => {
        this.material_list = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getGroupsList() {
    this.http.get(environment.server_url + "get_all_groups").subscribe(
      data => {
        this.groups_list = data;
        console.log(this.groups_list)

      },
      error => {
        console.log(error);
      }
    )
  }

  signout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  joinGroup() {
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    if (this.join_group_form.valid) {
      var url = environment.server_url + "post/join/group";
      var body = JSON.stringify({
        'group_id': this.join_group_form.value['group_id'],
        'code': this.join_group_form.value['code'],
        // 'subject': this.join_group_form.value['subject']
      })
      var headers = new HttpHeaders({
        "content-type": "application/json",
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
      this.http.post(url, body, { headers: headers }).subscribe(
        data => {
          this.join_group_form.reset();
          this.join_group_flag = false;
          if ("msg" in data) {
            this.openDialog(data['msg']);
          }
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  openDialog(msg: string) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { 'type': 'msg', 'msg': msg }
    });
  }

}
