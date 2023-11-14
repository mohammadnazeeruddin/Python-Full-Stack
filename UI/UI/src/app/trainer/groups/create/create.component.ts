import { Router } from '@angular/router';
import { HttpclientServiceService } from './../../../httpclient-service.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2'
import { PopupComponent } from '../popup/popup.component';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  [x: string]: any;

  group: any;
  user = JSON.parse(localStorage.getItem("login_data"));
  selected_course: any;
  // error_flag: boolean = false;
  valForm: FormGroup;
  formdata: FormData = new FormData();
  spinner = false;
  show = false;
  select_courses: Object = null;
  specialization = ["B.Tech", "B.Sc", "B.C.A", "B.Com", "B.E", "M.Tech", "M.C.A", "M.Sc", 'M.Com', 'PhD', 'Post Doctorial', 'Primary',
    'High School', 'Intermediate']
  constructor(public http: HttpClient, public http1: HttpclientServiceService, public router: Router, fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data['type'] == 'add_course') {
      console.log(data['group_id'])
      for (let material of data.material_data) {
        material['checked'] = false;
        material['disabled'] = false;
        for (let materials of data.selected_courses) {
          if (materials['_id'] == material['_id']) {
            material['checked'] = true;
            material['disabled'] = true;
          }
        }
      }
      console.log(data.material_data)
    }
    this.getMaterials();
    this.valForm = fb.group({
      'batch_name': [null, Validators.required],
      'college_name': [null],
      'subject': [null, Validators.required],
      'specialization': [null, Validators.required],
      'group': [null, Validators.required],
      'year': [null, Validators.required],
      // 'premises': [null, Validators.required],
      // 'location': [null, Validators.required],
      // 'course': [null, Validators.required]
      'allow_students': [false]
    });
  }

  ngOnInit() { }

  subjects: any;
  selectSubject(e) {
    console.log(e.value)
    this.subjects = e.value
  }

  getMaterials() {
    console.log(this.select_courses)
    var url = environment.server_url + 'get/materials';
    let access_token_cookie = this.user['access_token_cookie']
    console.log(url)
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + access_token_cookie

      })
    }
    this.http.get(url).subscribe(
      data => {
        console.log(data)
        this.select_courses = data;
      },
      error => {
        console.log(error);
      }
    )
  }
  // selectPostType(event: any) {
  //   this.selected_course = event.value;
  //   if (event.value) {
  //     this.error_flag = false;
  //   } else {
  //     this.error_flag = true;
  //   }
  // }

  close() {
    let data = {}
    data['flag'] = false
    this.dialogRef.close(data)
  }

  close1() {
    this.dialogRef.close()
  }

  add_course() {

    var url = environment.server_url + "add_course_to_batch";
    let access_token_cookie = this.user['access_token_cookie']

    Swal.fire({
      title: 'You cannot delete course once you add it to batch',
      // text: "You want be approve!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add course!'
    }).then((result) => {
      if (result.value) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + access_token_cookie

          })
        }
        let body = JSON.stringify({
          '_id': this.data['group_id'],
          'course': this.new_course
        })
        console.log(JSON.parse(body))
        this.http.post(url, body, httpOptions).subscribe(
          data => {
            console.log(data)
            if (data['flag'] == true) {
              Swal.fire(
                'Success!',
                data['message'],
                'success'
              )
              this.dialogRef.close(true)
            } else {
              Swal.fire(
                'Warning!',
                data['message'],
                'warning'
              )
              this.dialogRef.close(false)
            }
          }
        )
      }
    })
  }
  new_course: any = []
  addCourse(e: any) {
    // console.log(e)
    // console.log(e.source.value)
    console.log(e.source.value)
    if (e.checked == true) {
      this.new_course.push(e.source.value['_id'])
    } else {
      console.log()
      this.new_course.splice(this.new_course.indexOf(e.source.value['_id']), 1)
    }
    console.log(this.new_course)
  }

  create_group($ev, value: any) {
    console.log("called")
    $ev.preventDefault();
    let c;
    for (c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    console.log(this.valForm.value)
    if (this.valForm.valid) {
      this.spinner = true;
      let url = environment.server_url + 'post/createGroup';
      let access_token_cookie = this.user['access_token_cookie']
      console.log(url)
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + access_token_cookie

        })
      }
      let body = {}
      body['batch_name'] = this.valForm.value['batch_name']
      body['college_name'] = this.user['institution']
      body['subject'] = this.subjects
      body['specialization'] = this.qualification
      body['group'] = this.valForm.value['group']
      body['year'] = this.valForm.value['year']
      body['allow_students_to_watch_video'] = this.valForm.value['allow_students']
      // body['premises'] = this.valForm.value['premises']
      // body['location'] = this.valForm.value['location']
      console.log(body)
      this.http.post(url, JSON.stringify(body), httpOptions).subscribe(
        data => {
          console.log(data)
          this.spinner = false;
          data['flag'] = true
          this.dialogRef.close(data)
        },
        error => {
          this.spinner = false;
          console.log(error);
        }
      );
    } else {
      this.error_flag = true;
    }
  }

  selectMaterial(e: any) {
    console.log(e.value)
    this.material_name = e.value['_id']
  }

  qualification: any;
  selectSpecialization(e: any) {
    console.log(e)
    this.qualification = e.value
  }
// checked: boolean =false
  onChange(e) {
    console.log(e.checked)
    if (e.checked == true) {
      const dialogRef = this.dialog.open(PopupComponent, {
        disableClose: true,
        data: { 'type': 'allow_to_watch' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
        }
        else {
          this.valForm.value['allow_students'] = false
        }
      });
    }

  }

}
