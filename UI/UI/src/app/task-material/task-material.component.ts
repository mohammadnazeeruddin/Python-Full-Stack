
import { ChallengePopupComponent } from './../challenge-popup/challenge-popup.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title, Meta, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, PLATFORM_ID, Inject, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HighlightService } from 'src/app/shared/highlight.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { take } from 'rxjs/operators';
import { CachingService } from 'src/app/shared/caching.service';
import TimeMe from 'timeme.js';
import { TreepopupComponent } from '../treepopup/treepopup.component';
import { MatSnackBar } from '@angular/material';
import * as $ from 'jquery';
import { Location } from '@angular/common';
import { FeedbackComponent } from '../feedback/feedback.component';
import { map, skipUntil, takeUntil, repeat, sample, scan } from 'rxjs/operators';
import { Subject, interval } from 'rxjs';
import { Pipe } from '@angular/core';


@Component({
  selector: 'app-task-material',
  templateUrl: './task-material.component.html',
  styleUrls: ['./task-material.component.scss']
})
@Pipe({ name: 'safeHtml' })
export class TaskMaterialComponent implements OnInit {
  @HostListener('window:beforeunload')
  post_activity_data() {
    var body = {
      "read_time": TimeMe.getTimeOnCurrentPageInSeconds(),
      "time_stamp": this.date.toUTCString()
    }
    if ((this.access_token_cookie != null) && TimeMe.getTimeOnCurrentPageInSeconds() && (TimeMe.getTimeOnCurrentPageInSeconds() > 30)) {
      // this.activity.sendActivity(body);
    }
    TimeMe.resetRecordedPageTime("material");
  }

  @ViewChild('pageNavBar', { "static": false })
  page_nav: ElementRef;

  @ViewChild('side_nav', { "static": false })
  side_nav: ElementRef;

  @ViewChild('material_div', { "static": false })
  material_div: ElementRef;

  @ViewChild('note_text', { "static": false })
  note_text: ElementRef;

  @ViewChild('body_margin', { "static": false })
  body_margin: ElementRef;

  @ViewChild("side_code_editor", { "static": false })
  side_code_editor: ElementRef;

  @ViewChild("iframe_code", { "static": false })
  iframe_code: ElementRef;

  note_flag: boolean;
  code_side_button: boolean;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  access_token_cookie = localStorage.getItem('access_token_cookie');

  constructor(public highlightService: HighlightService,
    public http: HttpClient,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public titleService: Title,
    public meta: Meta,
    private sanitizer: DomSanitizer,
    public media: MediaMatcher,
    public cache_serv: CachingService,
    private _snackBar: MatSnackBar,
    private location: Location,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.mobileQuery = media.matchMedia('(max-width: 768px)');
      // this._mobileQueryListener = () => ChangeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
    }
  }

  image = (`url(${'assets/images/profile.png'})`);

  dots = [];
  durationInSeconds = 2;
  commenter_name: string = null;
  commenter_email: string = null;
  comment: string = null;
  isBrowser: boolean;

  chapters_list: Array<any> = [];
  most_popular: any = [];
  posts = [];
  no_of_posts: number = 10;
  topics = [];
  no_of_topics: number = 5;
  data: any;
  page_data: any;
  pages_list: any;
  page_num: number = 0;
  user_data: any;
  all_blogs_data: any;
  uid: any;
  spinner: boolean = false;
  date = new Date();

  fabs = [];
  questions: Array<any> = [];
  firstNumber: number;
  lastNumber: number;
  selectedIndex: Array<number> = [];
  correct_answers: Array<any> = [];
  mcq_result: Array<any> = [];

  totalpages: number;
  left: number;
  right: number;
  material_id: string;
  take_notes: string;

  material_status: any;
  material_name: string;

  // material code editor blog
  editor_flag: boolean;
  route_observable_flag: boolean = true;
  group_id: any;
  flags: any = [];
  tree_data: any = [];
  checked_data: any = [];
  material_data: any

  chapter_name: string;
  page_name: string;
  code_blog_position: number;
  code_blogs_count = 0;
  mcq_index = 0;

  openChallengeDialog(type: string, exercise_data: any) {
    localStorage.setItem("material_exercise", JSON.stringify(exercise_data));
    const dialogRef = this.dialog.open(ChallengePopupComponent, {
      data: { 'type': type, "material_id": this.material_id, "chapter_id": this.uid, "page_num": this.page_num }
    });
  }


  onDone(topic): void {
    this.flags = []
    var headers = new HttpHeaders({
      "content-type": "application/json",
      // "authorization": "Bearer " + this.access_token_cookie
    });
    var url = environment.server_url + "get_task";
    var body = JSON.stringify({
      'group_id': this.group_id,
      '_id': topic
    });
    this.http.post(url, body, { "headers": headers }).subscribe(
      data => {
        // console.log(data)
        var material_task: any = data
        this.tree_data = []
        for (let material of this.material_data) {
          if (material['material_id'] == topic) {
            let children = []
            for (let chapter of material['chapter_data']) {
              this.flags.push(false)
              let page_data = []
              for (let pages of chapter['page_data']) {
                let page_child = {}
                page_child['page_number'] = String(pages['page_number'])
                page_child['name'] = pages['page_name']
                page_child['isSelected'] = false
                page_child['isAssigned'] = false
                page_child['task'] = ''
                page_data.push(page_child)
              }
              children.push({ 'name': chapter['chapter_name'], '_id': chapter['chapter_id'], 'isSelected': false, 'task': '', 'children': page_data })
            }
            this.tree_data.push({ 'children': children })
            break;
          }
        }
        if (material_task.length > 0) {
          for (let chapter_id of material_task[0]['material_data']['chapter_data']) {
            for (let chapter of this.tree_data[0]['children']) {
              if (chapter_id['_id'] == chapter['_id']) {
                for (let page1 of chapter_id['page_data']) {
                  for (let pages of chapter['children']) {
                    if (String(pages['page_number']) == page1['page_number']) {
                      pages['isSelected'] = page1['isAssigned']
                      pages['isAssigned'] = page1['isAssigned']
                      pages['task'] = false

                      // pages['task'] = '#17a2b8';
                    }
                  }
                }
                chapter['isSelected'] = true
                chapter['isAssigned'] = true
                chapter['task'] = false
              }
            }
          }
          this.onDone1(topic)
        }
      }
    )
  }
  video_imgs = false
  video_img() {
    var element = document.getElementById("video_id");
    if (this.video_imgs == true) {
      this.video_imgs = false
      element.classList.remove("nav_video_1");
    } else {
      this.video_imgs = true
      element.classList.add("nav_video_1");
    }
  }
  // material_name:string
  onDone1(topic): void {
    // this.flags = []
    var headers = new HttpHeaders({
      "content-type": "application/json",
      // "authorization": "Bearer " + this.access_token_cookie
    });
    var url = environment.server_url + "get_particular_task";
    var body = JSON.stringify({
      'group_id': this.group_id,
      '_id': this.task_id
    });
    this.http.post(url, body, { "headers": headers }).subscribe(
      data => {
        // console.log(data['tasks'][0]['task'])
        var material_task: any = data['tasks'][0]['task'];
        // this.tree_data = []
        // for (let material of this.material_data) {
        //   if (material['material_id'] == topic) {
        //     console.log(material)
        //     // this.material_name = material['material_name']
        //     let children = []
        //     for (let chapter of material['chapter_data']) {
        //       this.flags.push(false)
        //       let page_data = []
        //       for (let pages of chapter['page_data']) {
        //         // console.log(pages)
        //         let page_child = {}
        //         page_child['page_number'] = String(pages['page_number'])
        //         page_child['name'] = pages['page_name']
        //         page_child['isSelected'] = false
        //         page_child['isAssigned'] = false
        //         page_data.push(page_child)
        //       }
        //       children.push({ 'name': chapter['chapter_name'], '_id': chapter['chapter_id'], 'isSelected': false, 'children': page_data })
        //     }
        //     this.tree_data.push({ 'children': children })
        //     break;
        //   }
        // }
        var k = Object.keys(material_task)
        for (let chapter_id of material_task[k[0]]) {
          // console.log(chapter_id)
          for (let chapter of this.tree_data[0]['children']) {
            let ch = Object.keys(chapter_id)[0]
            if (chapter['_id'] == ch) {
              for (let page1 in chapter_id[ch]) {
                for (let pages of chapter['children']) {
                  // console.log(typeof (pages))
                  // console.log(typeof (page1), chapter_id[ch][page1])
                  if (pages['page_number'] == page1 && chapter_id[ch][page1] == true) {
                    // console.log(typeof (page1), chapter_id[ch][page1])
                    pages['isSelected'] = true
                    pages['isAssigned'] = true
                    pages['visible'] = true
                    pages['task'] = true
                    // console.log(pages)
                    // break
                  }
                }
              }
              chapter['isSelected'] = true
              chapter['isAssigned'] = true
              chapter['visible'] = true
              chapter['task'] = true
            }
          }
        }
        // }

        for (let chapter of this.tree_data[0]['children']) {
          if (chapter['_id'] == this.uid) {
            for (let pages of chapter['children']) {
              if (pages['page_number'] == this.page_num && pages['isAssigned']) {
                // console.log("time_me() called", pages);
                this.time_me();
              }
            }
          }
        }
      }
    )
  }

  assign_task() {
    const dialogRef = this.dialog.open(TreepopupComponent, {
      disableClose: true,
      data: { "group_id": this.group_id, "data": this.checked_data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        let assigned_tasks = {}
        let assigned_tasks1 = {}
        for (let chapter of this.tree_data[0]['children']) {
          if (chapter['isSelected']) {
            if ('isAssigned' in chapter && chapter['isAssigned']) {
              continue;
            } else {
              for (let page of chapter['children']) {
                if (page['isSelected']) {
                  if ('isAssigned' in page && page['isAssigned']) {
                    continue;
                  } else {
                    let page_number;
                    let isAssigned;
                    if (chapter['_id'] in assigned_tasks) {
                      page_number = page['page_number']
                      isAssigned = true
                      assigned_tasks[chapter['_id']][page_number] = { 'isAssigned': isAssigned }
                    } else {
                      let p = {}
                      page_number = page['page_number']
                      isAssigned = true
                      p[page_number] = { 'isAssigned': isAssigned }
                      assigned_tasks[chapter['_id']] = p
                    }
                  }
                }
              }
            }
          }
        }
        assigned_tasks1[this.material_id] = assigned_tasks;
        var headers = new HttpHeaders({
          "content-type": "application/json",
          // "authorization": "Bearer " + this.access_token_cookie
        });
        var url = environment.server_url + "assign_tasks";
        var body = JSON.stringify({
          'group_id': this.group_id,
          'task': assigned_tasks1
        });
        this.http.post(url, body, { "headers": headers }).subscribe(
          data => {
            if (data['status'] == '200') {
              this.router.navigate(['/home'])
              this.openSnackBar("Successfully assigned task", 'msg')
            }
            else {
              this.openSnackBar(data['msg'], 'msg')
            }
          }, error => {
            console.log(error)
          }
        )
      }
    });
  }

  expand(i) {
    this.flags[i] = !(this.flags[i])
    localStorage.setItem('flags', JSON.stringify(this.flags))
  }
  expand_all() {
    let flags = JSON.parse(localStorage.getItem("flags"))
    if (flags == null) {
      for (let i in this.flags) {
        this.flags[i] = true
      }
      localStorage.setItem("flags", JSON.stringify(this.flags))
    } else {
      for (let i in this.flags) {
        this.flags[i] = true
      }
      localStorage.setItem("flags", JSON.stringify(this.flags))
    }
  }

  collapse_all() {
    let flags = JSON.parse(localStorage.getItem("flags"))
    if (flags == null) {
      for (let i in this.flags) {
        this.flags[i] = false
      }
      localStorage.setItem("flags", JSON.stringify(this.flags))
    } else {
      for (let i in this.flags) {
        this.flags[i] = false
      }
      localStorage.setItem("flags", JSON.stringify(this.flags))
    }
  }

  back() {
    // this.lo
    this.router.navigate(['/mytasks']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar'],
    });
  }

  message: any = '';

  chaps(mat_id, chap_name, chap_id, group_id, task_id, checked_status) {
    // console.log(checked_status, this.message);
    if (checked_status == true) {
      this.message = ''
      // this.show_material = true
      this.router.navigate(['/task_material', mat_id, chap_name, chap_id, group_id, task_id]);
     
    } else {
      this.message = "You are Allowed to view the page because it is not given in task "
      // console.log(checked_status, this.message);
      // this.show_material = false
      // console.log(this.show_material);

    }
    var element = document.getElementById("video_id");
    if (this.video_imgs == true) {
      this.video_imgs = false
      element.classList.remove("nav_video_1");
    }
    // this.flags = this.flags
  }
  // chaps(mat_id, chap_name, chap_id, group_id, task_id) {
  //   // console.log(mat_id, chap_name, chap_id, group_id);
  //   this.router.navigate(['/task_material', mat_id, chap_name, chap_id, group_id, task_id]);
  //   // this.flags = this.flags
  // }

  // onChange(e, i, c, isChecked, level) {
  //   console.log(e)
  //   if (level == 1) {
  //     // this.tree_data[0]['isSelected'] = isChecked.checked;
  //     for (let child of e['children']) {
  //       child['isSelected'] = isChecked.checked;
  //     }
  //     var isAtleastOneChecked: boolean;
  //     for (let child of e['children']) {
  //       if (child['isSelected']) {
  //         isAtleastOneChecked = true;
  //         break;
  //       }
  //     }
  //     if (isAtleastOneChecked) {
  //       e['isSelected'] = true;
  //       c['isSelected'] = true;
  //     } else {
  //       e['isSelected'] = false;
  //     }
  //     if (isChecked.checked == true) {
  //       if (e['isSelected'] == true) {
  //         this.checked_data.push(e)
  //       } else {
  //         let ind = this.checked_data.splice(this.checked_data.indexOf(e), 1)
  //       }
  //     } else {
  //       let ind = this.checked_data.splice(this.checked_data.indexOf(e), 1)
  //     }
  //   }
  //   if (level == 2) {

  //     if (isChecked.checked) {
  //       e['isSelected'] = true;
  //     } else {
  //       e['isSelected'] = false;
  //     }

  //     var isSiblingOneChecked: boolean;
  //     for (let sibling of c['children']) {
  //       if (sibling['isSelected']) {
  //         isSiblingOneChecked = true;
  //         break
  //       }
  //     }
  //     if (isSiblingOneChecked) {
  //       c['isSelected'] = true;
  //     } else {
  //       c['isSelected'] = false;
  //     }
  //     if (isChecked.checked == true) {
  //       if (c['isSelected'] == true) {
  //         this.checked_data.push(c)
  //       } else {
  //         let ind = this.checked_data.splice(this.checked_data.indexOf(c), 1)
  //       }
  //     }
  //     else {
  //       if (c['isSelected'] == false) {
  //         let ind = this.checked_data.splice(this.checked_data.indexOf(c), 1)
  //       }
  //     }
  //   }
  //   localStorage.setItem('tree_data', JSON.stringify(this.tree_data))
  // }

  sendUserActivity(material_id, chapter_id, page_id, activity) {
    var headers = new HttpHeaders({
      "content-type": "application/json",
      "authorization": "Bearer " + this.access_token_cookie
    });
    var read_time = activity['read_time']
    var time_stamp = activity['time_stamp']
    var mcqs_score = []
    var final_mcq_score = JSON.parse(localStorage.getItem('mcqs_result'));
    if (final_mcq_score != null) {
      for (let x of final_mcq_score) {
        mcqs_score.push(x['correctans'])
      }
      var high_mcqs_score = mcqs_score.reduce((prev, current) => (prev.y > current.y) ? prev : current)
    } else {
      high_mcqs_score = 0;
    }
    // var score = activity['mcq']
    var activity_ = []
    var score_: number;
    var high_mcq_score = [];

    if (read_time >= 2) {
      activity_.push(
        {
          "no_of_sec": read_time,
          "time_stamp": time_stamp,
        });
    } else {
      activity_.push(
        {
          "no_of_sec": 0,
          "time_stamp": time_stamp,
        });
    }
    // if (score_ > 0) {
    //   score_ = activity['mcq']
    // } else {
    //   score_ = 0;
    // }
    
    var url = environment.server_url + "store/userActivity";
    var body = JSON.stringify({
      "material_data": {
        "material_id": material_id,
        "material_name": this.material_name,
        "chapter_data": [{
          "chapter_id": chapter_id,
          "chapter_name": this.chapter_name,
          "pages": {
            "page": this.page_num,
            "page_name": this.page_data[0]['data'],
            "reading": {
              "reading_activity": activity_,
            },
            "practice": {
              "total_practice_time": this.total_practice_time,
              "blocks_count": this.code_blogs_count,
              "blocks_executed": this.removeduplicates(this.blocks_executed).length,
              "practice_activities": this.practice_user_act,
            },
            "mcqs": {
              "score": high_mcqs_score,
              "attempts": [
                {
                  "number_of_attempts": this.quiz_attempts,
                  "completed_time": this.mcqs_completed_time,
                  "pos": this.mcq_index,
                  "time_stamp": time_stamp
                }
              ]
            }
          }
        }
        ],
      }
    });
    this.blocks_executed.length = 0;
    this.total_practice_time = 0;

    this.http.post(url, body, { "headers": headers }).subscribe(
      data => {
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    localStorage.removeItem("flags");
    localStorage.removeItem("tree_data");
    // this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  reload() {
    window.location.reload();
  }

  home() {
    this.router.navigate(['home']);
  }
  task_id: any;
  // chapter_name: any;
  ngOnInit() {
    this.route.paramMap.subscribe(data => {
      // console.log(data)
      var old_uid;
      var old_material_id;
      var old_page_num;
      if (this.uid != null) {
        old_uid = this.uid;
        old_material_id = this.material_id;
        old_page_num = this.page_num;
      }
      this.group_id = data.get("group_id");
      this.uid = data.get("id");
      this.material_id = data.get("material_id");
      this.chapter_name = data.get("chapter_title")
      // console.log(this.chapter_name)
      this.task_id = data.get("task_id")
      this.get_task_status(this.task_id)
      if (old_uid != null || old_uid != undefined) {
        this.reset_time_me(old_material_id, old_uid, old_page_num);
      }
      if (this.material_id != 'undefined' && this.material_id != "none") {
        this.getChapters();
        this.tree_data = JSON.parse(localStorage.getItem('tree_data'))
        if (this.tree_data == null) {
          this.get_material(this.material_id)
        }
        var flags = JSON.parse(localStorage.getItem('flags'))
        if (flags != null) {
          this.flags = flags
        }
        if (this.uid != "none") {
          this.set_and_get_page_num();
        }
      }
    });

    var notes = localStorage.getItem("take_notes");
    if (notes != "null" && notes != "undefined") {
      this.take_notes = notes;
    }
    this.keyboard_keys();
    this.get_material_data();
    if (this.isBrowser) {
      window.scroll(0, 0);
    }
  }

  get_task_status(_id) {
    var headers = new HttpHeaders({
      "content-type": "application/json",
      "authorization": "Bearer " + this.access_token_cookie
    });
    var url = environment.server_url + "get_task_status";
    var body = JSON.stringify({
      '_id': _id
    });
    this.http.post(url, body, { "headers": headers }).subscribe(
      data => {
        // console.log(data)
        if (data['flag'] == true && data['data']['task_status'][0]['feedback'] == null) {
          const dialogRef = this.dialog.open(FeedbackComponent, {
            disableClose: true,
            data: { '_id': _id }

          });

        }
        // this.material_data = data;
        // console.log(data)
      },
      error => {
        console.log(error)
      }
    )
  }

  time_me() {
    TimeMe.initialize({
      currentPageName: "material", // current page
      idleTimeoutInSeconds: 120, // stop recording time due to inactivity
    });
  }

  get_material(material_id) {
    var headers = new HttpHeaders({
      "content-type": "application/json",
      // "authorization": "Bearer " + this.access_token_cookie
    });
    var url = environment.server_url + "get_group_material_status";
    var body = JSON.stringify({
      '_id': material_id
    });
    this.http.post(url, body, { "headers": headers }).subscribe(
      data => {
        this.material_data = data;
        // console.log(data)
        this.onDone(this.material_id)
      },
      error => {
        console.log(error)
      }
    )
  }

  reset_time_me(material_id, chapter_id, page_id, mcq_score: number = null) {

    // console.log(material_id, chapter_id, page_id)
    var body = {
      "read_time": TimeMe.getTimeOnCurrentPageInSeconds(),
      "time_stamp": this.date.toUTCString()
    }
    if (mcq_score != null && mcq_score != undefined) {
      // console.log('if block')
      body['mcq'] = mcq_score;
      if (TimeMe.getTimeOnCurrentPageInSeconds() && (TimeMe.getTimeOnCurrentPageInSeconds() > 2)) {
        if (this.tree_data && this.tree_data.length > 0) {
          for (let chapter of this.tree_data[0]['children']) {
            if (chapter['_id'] == chapter_id) {
              for (let pages of chapter['children']) {
                if (pages['page_number'] == page_id && pages['isAssigned']) {
                  // console.log("sent");
                  this.sendUserActivity(material_id, chapter_id, page_id, body);
                }
              }
            }
          }
        }
      }
    } else {
      if (TimeMe.getTimeOnCurrentPageInSeconds() && (TimeMe.getTimeOnCurrentPageInSeconds() > 2)) {
        if (this.tree_data && this.tree_data.length > 0) {
          for (let chapter of this.tree_data[0]['children']) {
            if (chapter['_id'] == chapter_id) {
              for (let pages of chapter['children']) {
                if (pages['page_number'] == page_id && pages['isAssigned']) {
                  this.sendUserActivity(material_id, chapter_id, page_id, body);
                  this.practice_user_act = {}
                  this.high_mcq_score = [];
                  this.mcqs_completed_time = 0;
                }
              }
            }
          }
        }
      }
    }
    TimeMe.resetRecordedPageTime("material");
    if (this.tree_data && this.tree_data.length > 0) {
      for (let chapter of this.tree_data[0]['children']) {
        if (chapter['_id'] == this.uid) {
          for (let pages of chapter['children']) {
            // console.log("kok uid",pages['page_number'], this.page_num, pages['isAssigned'])
            if (pages['page_number'] == this.page_num && pages['isAssigned']) {
              // console.log("time_me()", this.uid, this.page_num, pages['isAssigned']);
              this.time_me();
            }
          }
        }
      }
    }
  }

  set_and_get_page_num() {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (('page' in params)) {
        this.page_num = Number(params['page'])
        if (this.chapters_list && this.chapters_list.length > 0) {
          this.changePageFun(this.page_num, false);
        } else {
          this.changePageFun(this.page_num, true);
        }
      } else {
        this.page_num = 0;
        this.getPage(true);
      }
    });
  }

  get_material_data() {
    var url = environment.server_url + "get/material_details_by_id/" + this.material_id;
    this.http.get(url).subscribe(
      data => {
        this.material_name = data['material_name'];
      }, error => {
        console.log(error);
      }
    )
  }

  getUserMaterialStatus() {
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
    }
    var url = environment.server_url + "get_user_material_status";
    this.http.get(url, httpOptions).subscribe(
      data => {
        this.material_status = data;
        if ('material_status' in data) {
          if (this.material_id in data['material_status']) {
            if (this.data['_id'] in data['material_status'][this.material_id]) {
              this.prepDataForStatusUpdate(this.page_num);
            } else {
              this.prepDataForStatusUpdate(1)
            }
          } else {
            this.prepDataForStatusUpdate(1)
          }
        }
        else {
          this.prepDataForStatusUpdate(1)
        }
      }, error => {
        console.log(error);
      }
    );
  }

  prepDataForStatusUpdate(page_num) {
    var body = { "material_id": this.material_id, "chapter_id": this.data['_id'], "pages": page_num }
    this.updateMaterialStatus(body);
  }

  signout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  updateMaterialStatus(body) {
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
    }
    var url = environment.server_url + "get_user_material_status";
    body = JSON.stringify(body);
    this.http.post(url, body, httpOptions).subscribe(
      data => {
        this.material_status = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  ngDoCheck() {
  }

  open_note_text() {
    var display = this.note_text.nativeElement.style.display;
    if (display == "none") {
      this.note_text.nativeElement.style.display = "block";
      this.note_flag = true;
    } else {
      this.save_note_text();
      this.note_flag = false;
      this.note_text.nativeElement.style.display = "none";
    }
  }

  save_note_text() {
    localStorage.setItem("take_notes", this.take_notes)
  }

  scroll_to_element(el: HTMLElement) {
    el.scrollIntoView();
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
        // console.log(data);
        this.chapters_list = [];
        for (let i in data) {
          if (data[i] != null) {
            data[i]['chapter_url'] = data[i]['chapter_name'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
            this.chapters_list.push(data[i]);
          }
        }
        if (this.uid == "none" && this.chapters_list.length > 0) {
          var chapter_title = this.chapters_list[0]['chapter_name'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
          this.router.navigate(['/task_material', this.material_id, chapter_title, this.chapters_list[0]['_id'], this.group_id, this.task_id]);
        }
      },
      error => {
        console.log(error);
      }
    )
  }
  changePageFun(id: number, page_name, need_all_pages_data: boolean = false) {
    this.flag = false;
    this.flag = true;
    var old_material_id = this.material_id;
    var old_page_num = this.page_num;
    var old_chapter_id = this.uid
    this.page_num = id;
    this.page_name = page_name;
    if (this.uid != null || this.uid != undefined) {
      this.getPage(need_all_pages_data);
      localStorage.removeItem('material_editor_user_activity');
      this.high_mcq_score = [];
    }
    const queryParams: Params = { page: this.page_num };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
    this.reset_time_me(old_material_id, old_chapter_id, old_page_num);
    this.quiz_attempts = 0;
    var element = document.getElementById("video_id");
    if (this.video_imgs == true) {
      this.video_imgs = false
      element.classList.remove("nav_video_1");
    }
  }

  changePage(id: number, need_all_pages_data: boolean) {
    this.page_num = id;
    if (this.uid != null || this.uid != undefined) {
      this.getPage(need_all_pages_data);
    }
  }

  getPage(need_all_pages_data: boolean) {
    // this.spinner = true;
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
    }
    var url = environment.server_url + 'get/page_by_chapter_and_page_id/' + this.material_id + "/" + this.uid + "/" + this.page_num;
    if (need_all_pages_data) {
      url = url + "/" + true;
    }
    this.cache_serv.getPages(url).subscribe(
      data => {
        const pagesFromCache = this.cache_serv.responseCache.get(url);

        if (pagesFromCache) {
          // something
        } else {
          for (let i = 0; i < data['page_data'].length; i++) {

            if (data['page_data'][i]['name'] == 'text') {
              data['page_data'][i]['data'] = this.sanitizer.bypassSecurityTrustHtml(data['page_data'][i]['data']);

            }
            else if (data['page_data'][i]['name'] == 'image') {
              let format_data = data['page_data'][i]['data'];
              data['page_data'][i]['data'] = 'data:image/' + data['page_data'][i]['file_type'].split('.')[1] + ';base64,' + format_data;

            }
          }
          this.cache_serv.responseCache.set(url, data);
        }

        if ("all_pages" in data) {
          this.pages_list = data['all_pages'];
          var dots_num = this.pages_list.length;
          this.dots = []
          for (let di = 0; di < dots_num; di++) {
            this.dots.push(1);
          }
        }
        this.page_data = data['page_data'];
        this.spinner = false;
        this.load_new_mcqs();
      },
      error => {
        console.log(error);
        this.spinner = false;
      }
    );
  }

  getChapter() {
    this.pages_list = [];
    this.page_data = [];

    this.spinner = true;
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
    }
    var url = environment.server_url + 'get/chapter_by_id';
    var body = JSON.stringify({ 'chapter_id': this.uid, 'material_id': this.material_id });
    this.http.post(url, body, httpOptions).subscribe(data => {
      this.spinner = false;
      this.data = data;
      this.titleService.setTitle(this.data['blog_data'][0]['data']);
      this.meta.updateTag({ name: "title", content: this.data['blog_data'][0]['data'] });
      // this.meta.updateTag({ name: "keywords", content: this.data['tags'].join(",") });
      // this.meta.updateTag({ name: "description", content: this.data['blog_data'][1]['data'] });
      for (let i = 0; i < this.data["blog_data"].length; i++) {
        if (this.data["blog_data"][i]['name'] == 'text') {
          this.data['blog_data'][i]['data'] = this.sanitizer.bypassSecurityTrustHtml(this.data['blog_data'][i]['data']);
        }
        else if (this.data["blog_data"][i]['name'] == 'image') {
          let format_data = this.data['blog_data'][i]['data'];
          this.data['blog_data'][i]['data'] = 'data:image/' + this.data['blog_data'][i]['file_type'].split('.')[1] + ';base64,' + format_data;
        }
      }
    }, error => {
      this.spinner = false;
      this.router.navigate(['/login']);
      console.log(error);
    })

    if (this.most_popular.length <= 0) {
      var url1 = environment.server_url + 'get/popular';
      this.http.get(url1).subscribe(data => {
        this.most_popular = [];
        for (let i in data) {
          data[i]['preview_text'] = data[i]['preview_text'].replace(/<[^>]*>/g, '');
          data[i]['preview_text'] = data[i]['preview_text'].replace('&nbsp;', '');
          data[i]['preview_text'] = data[i]['preview_text'].replace('&ensp;', '');
          data[i]['preview_text'] = data[i]['preview_text'].replace('&emsp;', '');
          data[i]['url_title'] = data[i]['title'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
          this.most_popular.push(data[i]);
        }
      }, error => {
        console.log(error);
      })
    }
  }

  backup_data: any;
  load_new_mcqs() {
    var blogs_count = 0;
    this.selectedIndex = [];
    this.correct_answers = [];
    this.mcq_result = [];
    for (let i in this.page_data) {
      this.selectedIndex.push(1);
      let answers = [];
      if (this.page_data[i]['name'] == "page") {
        if ('embedded_url' in this.page_data[i]) {
          this.page_data[i]['embedded_url'] = this.sanitizer.bypassSecurityTrustHtml(this.page_data[i]['embedded_url']);
        } else {
          this.page_data[i]['embedded_url'] = '';
        }
      }
      if (this.page_data[i]['name'] == 'mcq') {
        for (let que of this.page_data[i]['questions']) {
          if (que['question'] != "") {
            let options_list = [];
            if (que['options'][0].length) {
              for (let opt of que['options']) {
                let options = {};
                options[opt[0]] = opt[1];
                options_list.push(options);
              }
              que['options'] = options_list;
            }
            try {
              que['answer'] = que['answer'].split(', ')
            } catch{
              que['answer'] = que['answer']
            }
            answers.push(que['answer']);
            que['result'] = null;
          }
        }
        for (let index in this.page_data[i]['questions']) {
          if (this.page_data[i]['questions'][index]['question'] == "") {
            this.page_data[i]['questions'].splice(index, 1)
          } else {
            this.page_data[i]['questions'][index]['number'] = String(Number(index) + 1);
            this.page_data[i]['questions'][index]['color'] = '#959c9b';
            this.page_data[i]['questions'][index]['checked'] = 'null';
          }
        }
        this.backup_data = $.extend(true, {}, this.page_data)
        this.code_blogs_count = blogs_count
        this.correct_answers.push(answers);
      } else {
        this.correct_answers.push([]);
      }
      this.mcq_result.push(null);
      if (this.page_data[i]['name'] == 'code' && this.page_data[i]['class'] == 'language-python') {
        blogs_count = blogs_count + 1;

      }
    }
  }

  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }

  openArticle(chapter: any) {
    var chapter_title = chapter['chapter_name'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);;
    this.router.navigate(['/material', chapter_title, chapter['_id']]);
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  ok(main_ind) {
    this.flag = true
    // this.page_data[main_ind]['questions'] = thi
    // console.log(this.backup_data[main_ind]['questions'])
    this.page_data[main_ind]['questions'] = this.backup_data[main_ind]['questions']
    this.mcq_result[main_ind] = []
    this.load_new_mcqs()
  }


  copyMessage(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  postdata(data: any) {
    var title = data['title'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
    this.router.navigate(['/home/post', title, data['_id']]);
  }

  getQuestions_by_topic() {
    var body = { topic: "Strings" };
    var userData = JSON.parse(localStorage.getItem('userData'));
    const access_token = userData['access_token_cookie'];
    if (localStorage.getItem('data') == null) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': 'Bearer ' + access_token
        })
      };
      var url = environment.quiz_url + 'get/random/level/questions';
      this.http.post(url, body, httpOptions).subscribe(data => {
        this.questions = data['data'];
        // this.len = this.questions.length;
        // if (this.questions.length === 0) {
        //   this.message = 'Currently there are no Questions.';
        // } else {
        let index = 0;
        for (const i of this.questions) {
          index = index + 1;
          const d = [];
          // tslint:disable-next-line:forin
          for (const j in i['options']) {
            d.push({ [j]: i['options'][j] });
          }
          i['options'] = d;
          i['_id'] = index;
          // i['len'] = this.len;
          i['color'] = '#959c9b'; //gray
          i['result'] = null;
          i['checked'] = 'null';
        }
        this.controlfabicons()
        // }
      }, error => {
        console.log(error)
      });
    }
  }

  controlfabicons() {
    if (this.questions) {
      if (this.questions.length <= 5) {
        this.fabs = []
        for (let i1 = 1; i1 <= this.questions.length; i1++) {
          this.fabs.push(i1);
        }
        this.firstNumber = this.fabs[0];
      }
      else if (this.questions.length > 5) {
        this.fabs = []
        let c = 0
        for (let i1 = 1; i1 <= this.questions.length; i1++) {
          c = c + 1
          this.fabs.push(i1)
          if (c == 5) {
            break;
          }
        }
        this.firstNumber = this.fabs[0]
        this.lastNumber = this.fabs[this.fabs.length - 1]
      }
    }
  }

  next(i = null) {
    if (i != null) {
      this.lastNumber = i;
    }
    let lastelement = this.fabs[this.fabs.length - 1];
    this.fabs = []
    let c = 0
    for (let i = lastelement + 1; i <= this.questions.length; i++) {
      c = c + 1;
      if (i) {
        this.fabs.push(i)
        if (c == 5) {
          break;
        }
      }
    }
    this.lastNumber = this.fabs[this.fabs.length - 1];
    this.firstNumber = this.fabs[0];
  }

  previous(j = null) {
    // console.log("came t previou")
    if (j != null) {
      this.firstNumber = j;
    }
    let lastelement = this.fabs[0];
    this.fabs = []
    let c = 0
    for (let i = lastelement - 1; i <= this.questions.length; i--) {
      c = c + 1
      this.fabs.push(i)
      if (i && c == 5) {
        break;
      }
    }
    this.fabs = this.fabs.reverse()
    this.firstNumber = this.fabs[0]
    this.lastNumber = this.fabs[this.fabs.length - 1]
  }

  selectQuestion(main_ind: number, i, _id) {
    this.changeColor(main_ind, this.selectedIndex[main_ind], _id);
    this.selectedIndex[main_ind] = i;
  }

  selectQuestion1(main_ind: number, i, _id) {
    this.selectedIndex[main_ind] = i;
  }
  changeColor(main_ind: number, i, _id) {
    const k = [];
    for (const j of this.page_data[main_ind]['questions']) {
      for (const c of j['options']) {
        if ((j['checked'] === 'null') && j['number'] === String(this.selectedIndex[main_ind])) {
          j['color'] = '#df2f34';
          //red #e91e63 '#d3272d'
        }
        if (c['checked'] === true) {
          j['color'] = '#199a8a';
          //blue
          break;
        } else
          if (c['checked'] === false) {
            j['color'] = '#eb9b11';
          }
      }
    }
  }

  onChangeQuestion(s, isChecked: boolean, _id, que_ind, opIn, main_ind: number) {
    // console.log(s)
    s.checked = isChecked;
    this.page_data[main_ind]['questions'][que_ind]['options'][opIn]['checked'] = isChecked;
    this.page_data[main_ind]['questions'][que_ind]['checked'] = isChecked;
    // localStorage.setItem('data', JSON.stringify(this.questions));
  }

  start_quiz() {
    this.flag = false
    this.start()
  }

  flag: boolean = true
  flag1: boolean = true

  Review() {
    this.flag1 = false

  }

  mcqs_completed_time: any;
  start$ = new Subject();
  stop$ = new Subject();
  record$ = new Subject();
  timer$ = interval(100).pipe(
    skipUntil(this.start$),
    takeUntil(this.stop$),
    repeat(),
    map(time => time / 60)
  );
  timeList$ = this.timer$.pipe(
    sample(this.record$),
    scan<number>((list, time) => [...list, time], [])
  )
  start() {
    this.start$.next();
  }
  stop() {
    this.stop$.next();
    this.record$.next();
    var mcqs_timer = document.getElementById('timeme').innerText;
    this.mcqs_completed_time = mcqs_timer
  }
  question_len = []; //total quiz questions length
  high_mcq_score = [];
  quiz_attempts = 0;

  submit(main_ind, code: any) {
    var mcqs_position = code['position']
    this.mcq_index = mcqs_position
    const user_selected_ans = {};
    for (const num of this.page_data[main_ind]['questions']) {
      for (let c of num['options']) {
        if (c['checked'] === true) {
          try {
            user_selected_ans[String(Number(num['number']) - 1)].push(Object.keys(c)[0]);
          } catch {
            user_selected_ans[String(Number(num['number']) - 1)] = [Object.keys(c)[0]];
          }
        }
      }
    }
    // // tslint:disable-next-line:no-shadowed-variable
    for (let c in this.page_data[main_ind]['questions'].length) {
      if (user_selected_ans === '') {
        user_selected_ans[c] = [];
      }
    }
    let i = 0;
    let diff: any;
    let unans = 0;
    let j: any;
    // tslint:disable-next-line:forin
    for (j in this.correct_answers[main_ind]) {
      if (user_selected_ans[j]) {
      } else {
        user_selected_ans[j] = [];
        unans += 1;
      }
      diff = this.correct_answers[main_ind][j].filter((x: any) => !user_selected_ans[j].includes(x)).concat(user_selected_ans[j].filter((x: any) => !this.correct_answers[main_ind][j].includes(x)));
      if (diff.length === 0) {
        i = i + 1;
      } else {
      }
    }
    const percent = (i / this.page_data[main_ind]['questions'].length) * 100;
    let result: any;
    let ti: any = localStorage.getItem('time');
    result = {
      'Unanswered': unans, 'selectedAnswer': user_selected_ans, 'percent': Math.round(percent), 'len': this.page_data[main_ind]['questions'].length, 'correctans': i, 'data': this.page_data[main_ind]['questions']
    };
    var mcqs_info = JSON.parse(localStorage.getItem('mcqs_result'));
    // this.high_mcq_score.push(result);
    // localStorage.setItem('mcqs_result', JSON.stringify(this.high_mcq_score));
    if (mcqs_info == null) {
      this.high_mcq_score.push(result)
      localStorage.setItem('mcqs_result', JSON.stringify(this.high_mcq_score));
    } else {
      // this.high_mcq_score.push(mcqs_info)
      // this.high_mcq_score.push(result)
      mcqs_info.push(result)
      localStorage.setItem('mcqs_result', JSON.stringify(mcqs_info))
    }
    // console.log(this.high_mcq_score)
    // console.log(mcqs_info, "info")
    this.question_len.push(this.page_data[main_ind]['questions'].length)
    this.mcq_result[main_ind] = result;
    // this.reset_time_me(this.material_id, this.uid, this.page_num, result['correctans'])
    this.review(this.page_data[main_ind]['questions'], this.correct_answers, main_ind)
    // localStorage.removeItem('material_editor_user_activity');
    document.getElementById('quiz_attempt')
    this.quiz_attempts += 1
    this.stop();
  }
  review(q, c, main_ind) {
    for (const num of q) {
      for (let c of num['options']) {
        if (c['checked'] === true) {
          num['color'] = '#199a8a'
          // console.log(num['answer'], Object.keys(c)[0])
          if (num['answer'].includes(Object.keys(c)[0])) {
            c['correct_ans'] = true
          } else {
            c['correct_ans'] = false
          }
        }
      }
      // console.log(this.selectedIndex[main_ind])
      this.selectedIndex[main_ind] = 1
      // console.log(this.selectedIndex[main_ind])
      // console.log(num)
    }
  }

  nextf(main_ind: number, i, _id) {
    this.changeColor(main_ind, i, _id);
    if (this.page_data[main_ind]['questions'].length - 1 === i) {
      this.selectedIndex[main_ind] = i;
    } else {
      this.selectedIndex[main_ind] += 1;
    }
    if (this.lastNumber) {
      if (this.lastNumber == _id) {
        this.lastNumber = _id
        this.next(this.lastNumber)
      }
    }
  }
  nextf1(main_ind: number, i, _id) {
    if (this.page_data[main_ind]['questions'].length - 1 === i) {
      this.selectedIndex[main_ind] = i;
    } else {
      this.selectedIndex[main_ind] += 1;
    }
    if (this.lastNumber) {
      if (this.lastNumber == _id) {
        this.lastNumber = _id
        this.next(this.lastNumber)
      }
    }
  }

  backf(main_ind: number, i, _id) {
    this.changeColor(main_ind, i, _id);
    if (this.selectedIndex[main_ind] === 1) {
    }
    if (i > 0) {
      this.selectedIndex[main_ind] -= 1;
    } else {
      this.selectedIndex[main_ind] = i;
    }
    if (this.firstNumber) {
      if (this.firstNumber == this.fabs[0] && this.firstNumber == _id) {
        //   this.lastNumber = _id
        this.previous(this.firstNumber)
        // this.next(this.lastNumber)
      }
    }
  }
  backf1(main_ind: number, i, _id) {
    if (this.selectedIndex[main_ind] === 1) {
    }
    if (i > 0) {
      this.selectedIndex[main_ind] -= 1;
    } else {
      this.selectedIndex[main_ind] = i;
    }
    this.changeColor(main_ind, this.selectedIndex[main_ind], i);
    if (this.firstNumber) {
      if (this.firstNumber == this.fabs[0] && this.firstNumber == _id) {
        //   this.lastNumber = _id
        this.previous(this.firstNumber)
        // this.next(this.lastNumber)
      }
    }
  }

  code_editor(index: any, code: any) {
    localStorage.setItem("code_material", code["data"]);
    var code_blog_position_ = code['position']
    // console.log(code_blog_position_)
    localStorage.setItem('code_position', code_blog_position_)
    this.refresh_iframe(code);
    this.code_side_event(index);

  }

  refresh_iframe(code: string) {
    var frame = this.iframe_code.nativeElement.contentWindow;
    frame.document.getElementById('code_refresh').click();
    localStorage.removeItem('material_editor_user_activity')
  }
  practice_user_act = {}
  blocks_executed = []
  removeduplicates(dup) {
    return dup.filter((value, index) => dup.indexOf(value) === index);
  }
  total_practice_time = 0

  code_side_event(_code_index) {
    if (this.editor_flag) {
      this.editor_flag = false;
      var practice_act = localStorage.getItem('material_editor_user_activity');
      var pract = JSON.parse(practice_act)
      var code_ind = pract['code_index']
      // console.log(this.practice_user_act)
      var total_readtime_ = pract['practice_time']
      this.total_practice_time += total_readtime_
      this.blocks_executed.push(code_ind)
      delete pract['code_index']
      this.practice_user_act[code_ind] = pract
      var frame = this.iframe_code.nativeElement.contentWindow;
      frame.document.getElementById('reset_timeme').click();

    } else {
      this.editor_flag = true;
      var frame = this.iframe_code.nativeElement.contentWindow;
      frame.document.getElementById('type_activity').click();
    }
    var class_list = this.side_code_editor.nativeElement.classList;
    if (class_list.contains("container_code1")) {
      this.side_code_editor.nativeElement.classList.remove("container_code1");
    } else {
      this.side_code_editor.nativeElement.classList.add("container_code1");
    }
    // console.log(this.blocks_executed)
  }

  material_shell(index: any, code: any) {
    localStorage.setItem("code_shell", code);
    if (this.page_data[index]['show']) {
      this.page_data[index]['show'] = false;
    } else {
      this.page_data[index]['show'] = true;
    }
  }

  keyboard_keys() {
    document.onkeyup = function (event) {
      if (event.shiftKey && event.which == 79) {
        document.getElementById("editorkeys").click();
      }
      else if (event.ctrlKey && event.shiftKey && event.which == 88) {
        document.getElementById("editorkeys").click();
      }
    };
  };

}
