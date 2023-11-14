import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CachingService } from 'src/app/shared/caching.service';
import { HttpclientServiceService } from './../httpclient-service.service';


@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {

  defaultElevation = 2;
  raisedElevation = 8;
  chapters: any = [];
  reviewtopic: any;
  dotcolors = ["#5BB12F", "#E8B71A", '#5F5F5F', "#3189D6"];
  material_list: any;
  material_id: any;
  material_name: any;
  chapters_list: any = [];
  uid: any;
  overall_activity_status = {};
  user_activity_status: any;
  last_activity: any;
  last_activity_chapters: any;
  last_activity_ids: any;
  user_registered_courses: any = [];
  group_id: string;
  groups_data: any;
  group_materials: any;
  toggle = false;
  status = 'Enable'; 
  selectedIndex: any;
  enableDisableRule(i) {
      this.selectedIndex = i;
      console.log(this.selectedIndex, i)
      // console.log(this.status)
  }
  constructor(public router: Router,
    public http: HttpClient,
    public cache_serv: CachingService,
    public http1: HttpclientServiceService,
    public route: ActivatedRoute) {

    this.reviewtopic = 'core python';
    this.route.paramMap.subscribe(
      data => {
        this.group_id = data.get("group_id");
        if(this.group_id) {
          this.get_group_by_id();
        }
        
      }
    );
  }

  ngOnInit() {
    // this.getMaterials();
  }

  get_group_by_id() {
    var url = environment.server_url + "get/group/" + this.group_id;
    this.http.get(url).subscribe(
      data => {
        this.material_list = data['groups']['course'];
        this.material_id = this.material_list[0]["_id"];
        this.material_name = this.material_list[0]["material_name"];
        this.getChapters();
      },
      error => {
        console.log(error);
      }
    );
  }

  getChapter(i: any, k: any) {
    
    this.last_activity = null;
    this.user_activity_status = null;
    this.last_activity_chapters = [];
    
    
    // if (this.user_registered_courses.includes(i['_id'])) {
    this.material_id = i['_id'];
    this.material_name = i['material_name'];
    // for (let group of this.groups_data) {
    //   if (group['subject'] == this.material_id) {
    //     this.group_id = group['_id']
    //   }
    // }
    this.getChapters();
    // this.reviewtopic = i['material_name'];
    
    // }
    // else {
    //   this.reviewtopic = i['material_name'];
    //   this.chapters = []
    // }
  }

  myMaterial(c: any) {
    this.router.navigate(['/material', this.material_id, c['chapter_url'], c['_id'], this.group_id]);
  }

  getChapters() {
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
    }
    var url = environment.server_url + "get/chapters/" + this.material_id;
    this.cache_serv.getPages(url).subscribe(
      data => {
        this.cache_serv.responseCache.set(url, data);
        data = data['data'];
        this.chapters = [];
        for (let i in data) {
          if (data[i] != null) {
            data[i]['chapter_url'] = data[i]['chapter_name'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
            this.chapters.push(data[i]);
          }
        }
        if (this.uid == "none" && this.chapters.length > 0) {
          var chapter_title = this.chapters[0]['chapter_name'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
          // this.router.navigate(['/home/material', this.material_id, chapter_title, this.chapters_list[0]['_id']]);
        }
        this.getUserActivity();
      },
      error => {
        console.log(error);
      }
    )
  }

  getUserActivity() {
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
    }
    var url = environment.server_url + "get_user_activity_by_material_id/" + this.group_id + "/" + this.material_id;
    this.http.get(url, httpOptions).subscribe(
      data => {
        this.user_activity_status = data['activity'];
        this.last_activity = data['last_activity'];
        this.last_activity_ids = [];
        if (this.last_activity && this.last_activity.length > 0) {
          for (let act of this.last_activity) {
            let act_id = Object.keys(act)[0];
            this.last_activity_ids.push(act_id);
          }
          // if (this.last_activity != null) {
          //   for(let chapter of this.chapters) {
          //     if(chapter["_id"] == this.last_activity["chapter_id"]) {
          //       this.last_activity["chapter_details"] = chapter;
          //     }
          //   }
          // }
          this.last_activity_chapters = [];
          for (let id of this.last_activity_ids) {
            for (let chapter in this.chapters) {
              if (this.chapters[chapter]['_id'] == id) {
                this.last_activity_chapters.push(this.chapters[chapter]);
                this.chapters.splice(chapter, 1);
              }
            }
          }
        }
      }, error => {
        console.log(error);
      }
    )
  }

  getMaterials() {

    this.http.get(environment.trainer_url + "get/materials").subscribe(
      data => {
        // this.getUserGroups();
        this.group_materials = JSON.parse(localStorage.getItem("groupcourse"));
        // let d = this.http1.readMessage();
        // this.group_materials = d
        // console.log(this.group_materials);
      },
      error => {
        this.group_materials = JSON.parse(localStorage.getItem("groupcourse"));
        // let d = this.http1.readMessage();
        // this.group_materials = d
        // console.log(this.group_materials);
        // console.log(error);
      }
    );
  }

  // getUserGroups() {
  //   var access_token_cookie = localStorage.getItem("access_token_cookie");
  //   var url = environment.server_url + "get/student/groups";
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'content-Type': 'application/json',
  //       'Access-Control-Allow-Origin': '*',
  //       'authorization': 'Bearer ' + access_token_cookie
  //     })
  //   };
  //   this.http.get(url, httpOptions).subscribe(
  //     data => {
  //       this.group_materials = JSON.parse(localStorage.getItem("groupcourse"))

  //       console.log(this.group_materials)
  //       console.log(data)
  //       this.user_registered_courses = [];
  //       this.groups_data = data;
  //       for (let group of this.groups_data) {
  //         this.user_registered_courses.push(group['subject']);
  //       }
  //       if (this.user_registered_courses.length > 0) {
  //         this.material_id = this.user_registered_courses[0];
  //         this.group_id = this.groups_data[0]['_id'];
  //         this.getChapters();
  //       }
  //     }, error => {
  //       this.group_materials = JSON.parse(localStorage.getItem("groupcourse"))

  //       console.log(this.group_materials)
  //       console.log(error);
  //     }
  //   )
  // }

  // calculate() {
  //   for(let chapter of this.chapters) {
  //     var chapter_data = sample_data[this.material_id][chapter['_id']];
  //     var page_keys = Object.keys(chapter_data);
  //     let mcq_time = 0;
  //     let challenge_time = 0;
  //     let read_time = 0;

  //     let mcq_marks = 0;
  //     let challenge_marks = 0;
  //     let read_marks = 0;
  //     for( let page_key of page_keys) {
  //       if ("mcq" in chapter_data[page_key]) {
  //         mcq_time += 7
  //         mcq_marks += chapter_data[page_key]["mcq"];
  //       } 
  //       if("read" in chapter_data[page_key]) {
  //         read_time += 5
  //         read_marks += 1
  //       } 
  //       if("challange" in chapter_data[page_key]) {
  //         challenge_time += 15
  //         challenge_marks += 5
  //       }
  //     }
  //     var total_time = challenge_time + read_time + mcq_time;
  //     var total_marks = challenge_marks + read_marks + mcq_marks;
  //     this.overall_activity_status[chapter['_id']] = {"total_time": total_time, "total_marks": total_marks,
  //       "mcq_time": mcq_time, "challenge_time": challenge_time, "read_time": read_time,
  //       "mcq_marks": mcq_marks, "challenge_marks": challenge_marks, "read_marks": read_marks
  //     };
  //   }
  //   var chapter_keys = Object.keys(this.overall_activity_status);
  //   var total_chapters_time = 0
  //   var total_chapters_read_time = 0;
  //   var total_chapters_mcq_time = 0;
  //   var total_chapters_challenge_time = 0;

  //   var total_chapters_marks = 0
  //   var total_chapters_read_marks= 0;
  //   var total_chapters_mcq_marks = 0;
  //   var total_chapters_challenge_marks = 0;
  //   for(let chapter_key of chapter_keys) {
  //     total_chapters_time += this.overall_activity_status[chapter_key]['total_time'];
  //     total_chapters_read_time += this.overall_activity_status[chapter_key]['read_time'];
  //     total_chapters_mcq_time += this.overall_activity_status[chapter_key]['mcq_time'];
  //     total_chapters_challenge_time += this.overall_activity_status[chapter_key]['challenge_time'];

  //     total_chapters_marks += this.overall_activity_status[chapter_key]['total_marks'];
  //     total_chapters_read_marks += this.overall_activity_status[chapter_key]['read_marks'];
  //     total_chapters_mcq_marks += this.overall_activity_status[chapter_key]['mcq_marks'];
  //     total_chapters_challenge_marks += this.overall_activity_status[chapter_key]['challenge_marks'];
  //   }
  //   this.overall_activity_status["total_chapters_marks"] = total_chapters_marks;
  //   this.overall_activity_status["total_chapters_read_marks"] = total_chapters_read_marks;
  //   this.overall_activity_status["total_chapters_mcq_marks"] = total_chapters_mcq_marks;
  //   this.overall_activity_status["total_chapters_challenge_marks"] = total_chapters_challenge_marks;

  //   this.overall_activity_status["total_chapters_time"] = total_chapters_time;
  //   this.overall_activity_status["total_chapters_read_time"] = total_chapters_read_time;
  //   this.overall_activity_status["total_chapters_mcq_time"] = total_chapters_mcq_time;
  //   this.overall_activity_status["total_chapters_challenge_time"] = total_chapters_challenge_time;
  // }

  // calculate_user_data() {
  //   this.user_activity_status = {}
  //   for(let chapter of this.chapters) {
  //     var chapter_data = user_data[this.material_id][chapter['_id']];
  //     var page_keys = Object.keys(chapter_data);
  //     let mcq_time = 0;
  //     let challenge_time = 0;
  //     let read_time = 0;
  //     let mcq_marks = 0;
  //     let challenge_marks = 0;
  //     let read_marks = 0;
  //     for( let page_key of page_keys) {
  //       if ("mcq" in chapter_data[page_key]) {
  //         mcq_time += 7
  //         mcq_marks += chapter_data[page_key]["mcq"];
  //       } 
  //       if("read" in chapter_data[page_key]) {
  //         read_time += 5
  //         read_marks += 1
  //       } 
  //       if("challange" in chapter_data[page_key]) {
  //         challenge_time += 15
  //         challenge_marks += 5
  //       }
  //     }
  //     var total_time = challenge_time + read_time + mcq_time;
  //     var total_marks = challenge_marks + read_marks + mcq_marks;
  //     this.user_activity_status[chapter['_id']] = {"total_time": total_time, 
  //     "mcq_time": mcq_time, "challenge_time": challenge_time, "read_time": read_time, "total_marks": total_marks,
  //     "mcq_marks": mcq_marks, "challenge_marks": challenge_marks, "read_marks": read_marks};
  //   }
  //   var chapter_keys = Object.keys(this.user_activity_status);
  //   var total_chapters_time = 0
  //   var total_chapters_read_time = 0;
  //   var total_chapters_mcq_time = 0;
  //   var total_chapters_challenge_time = 0;

  //   var total_chapters_marks = 0
  //   var total_chapters_read_marks= 0;
  //   var total_chapters_mcq_marks = 0;
  //   var total_chapters_challenge_marks = 0;
  //   for(let chapter_key of chapter_keys) {
  //     total_chapters_time += this.user_activity_status[chapter_key]['total_time'];
  //     total_chapters_read_time += this.user_activity_status[chapter_key]['read_time'];
  //     total_chapters_mcq_time += this.user_activity_status[chapter_key]['mcq_time'];
  //     total_chapters_challenge_time += this.user_activity_status[chapter_key]['challenge_time'];

  //     total_chapters_marks += this.user_activity_status[chapter_key]['total_marks'];
  //     total_chapters_read_marks += this.user_activity_status[chapter_key]['read_marks'];
  //     total_chapters_mcq_marks += this.user_activity_status[chapter_key]['mcq_marks'];
  //     total_chapters_challenge_marks += this.user_activity_status[chapter_key]['challenge_marks'];
  //   }
  //   this.user_activity_status["total_chapters_time"] = total_chapters_time;
  //   this.user_activity_status["total_chapters_read_time"] = total_chapters_read_time;
  //   this.user_activity_status["total_chapters_mcq_time"] = total_chapters_mcq_time;
  //   this.user_activity_status["total_chapters_challenge_time"] = total_chapters_challenge_time;

  //   this.user_activity_status["total_chapters_marks"] = total_chapters_marks;
  //   this.user_activity_status["total_chapters_read_marks"] = total_chapters_read_marks;
  //   this.user_activity_status["total_chapters_mcq_marks"] = total_chapters_mcq_marks;
  //   this.user_activity_status["total_chapters_challenge_marks"] = total_chapters_challenge_marks;
  // }

  // get_material_data() {
  //   var url = environment.server_url + "get/material_details_by_id/" + this.material_id;
  //   this.http.get(url).subscribe(
  //     data => {
  //       this.material_name = data['material_name'];
  //     }, error => {
  //       console.log(error);
  //     }
  //   )
  // }

}
