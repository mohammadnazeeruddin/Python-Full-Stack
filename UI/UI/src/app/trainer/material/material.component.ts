// import { ChallengePopupComponent } from './../challenge-popup/challenge-popup.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, PLATFORM_ID, Inject, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HighlightService } from '../highlight.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { take } from 'rxjs/operators';
import { material_data } from './../../shared/material';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TreepopupComponent } from '../treepopup/treepopup.component';
import * as $ from 'jquery';

// import { CachingService } from 'src/app/shared/caching.service';
// import TimeMe from 'timeme.js';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']
})
export class MaterialComponent implements OnInit {

  material_data: any;

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
  tree_data: any = [];
  group_id: any;

  constructor(
    public highlightService: HighlightService,
    public http: HttpClient,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public titleService: Title,
    public meta: Meta,
    private sanitizer: DomSanitizer,
    public media: MediaMatcher,
    private _location: Location,
    private _snackBar: MatSnackBar,
    // public cache_serv: CachingService,
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
  flags: any = [];
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

  // openChallengeDialog(type: string, exercise_data: any) {
  //   localStorage.setItem("material_exercise", JSON.stringify(exercise_data));
  //   const dialogRef = this.dialog.open(ChallengePopupComponent, {
  //     data: { 'type': type, "material_id": this.material_id, "chapter_id": this.uid, "page_num": this.page_num}
  //   });
  // }

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
    this.http.post(url, body, { "headers": headers }).subscribe(
      data => {
      }, error => {
        console.log(error);
      }
    );
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
        console.log(data)
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
                page_data.push(page_child)
              }
              children.push({ 'name': chapter['chapter_name'], '_id': chapter['chapter_id'], 'isSelected': false, 'children': page_data })
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
                    }
                  }
                }
                chapter['isSelected'] = true
                chapter['isAssigned'] = true
              }
            }
          }
        }
      }
    )
  }

  ngOnDestroy() {
    localStorage.removeItem("flags")
    localStorage.removeItem("tree_data")
  }

  reload() {
    window.location.reload();
  }

  home() {
    this.router.navigate(['home']);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(data => {
      this.group_id = data.get('group_id')
      if (this.uid != null) {

        // this.reset_time_me();
      }
      this.uid = data.get("id");
      this.material_id = data.get("material_id");
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
    // this.time_me();
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
        this.onDone(this.material_id);
      },
      error => {
        console.log(error);
      }
    )
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

  // time_me() {
  //   TimeMe.initialize({
  //     currentPageName: "material", // current page
  //     idleTimeoutInSeconds: 120, // stop recording time due to inactivity
  //   });
  // }

  // reset_time_me(mcq_score:number= null) {
  //   console.log("reset_time_me was called")
  //   var body = {
  //     "read_time": TimeMe.getTimeOnCurrentPageInSeconds(),
  //     "time_stamp": this.date.toUTCString()
  //   }
  //   if (mcq_score != null && mcq_score != undefined) {
  //     console.log('if block')
  //     body['mcq'] = mcq_score;
  //     this.sendUserActivity(this.material_id, this.uid, this.page_num, body);
  //   } else {
  //     console.log("else block")
  //     if (TimeMe.getTimeOnCurrentPageInSeconds() && (TimeMe.getTimeOnCurrentPageInSeconds() > 30)) {
  //       console.log("sent")
  //       this.sendUserActivity(this.material_id, this.uid, this.page_num, body);
  //     }
  //   }
  //   TimeMe.resetRecordedPageTime("material");
  //   this.time_me();
  // }

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
        // console.log("getPage");
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

  back() {
    this.router.navigate(['/trainer/groups']);
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
  // openDialog(): void {
  //   const dialogRef = this.dialog.open(TreepopupComponent, {
  //     disableClose: true,
  //     data: { "group_id": this.group_id, "data": this.checked_data }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  // assign_task() {
  //   const dialogRef = this.dialog.open(TreepopupComponent, {
  //     disableClose: true,
  //     data: { "group_id": this.group_id, "data": this.checked_data }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == true) {
  //       let assigned_tasks = {}
  //       let assigned_tasks1 = {}
  //       for (let chapter of this.tree_data[0]['children']) {
  //         if (chapter['isSelected']) {
  //           if ('isAssigned' in chapter && chapter['isAssigned']) {
  //             continue;
  //           } else {
  //             for (let page of chapter['children']) {
  //               if (page['isSelected']) {
  //                 if ('isAssigned' in page && page['isAssigned']) {
  //                   continue;
  //                 } else {
  //                   let page_number;
  //                   let isAssigned;
  //                   if (chapter['_id'] in assigned_tasks) {
  //                     page_number = page['page_number']
  //                     isAssigned = true
  //                     assigned_tasks[chapter['_id']][page_number] = { 'isAssigned': isAssigned }
  //                   } else {
  //                     let p = {}
  //                     page_number = page['page_number']
  //                     isAssigned = true
  //                     p[page_number] = { 'isAssigned': isAssigned }
  //                     assigned_tasks[chapter['_id']] = p
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       assigned_tasks1[this.material_id] = assigned_tasks;
  //       var headers = new HttpHeaders({
  //         "content-type": "application/json",
  //         // "authorization": "Bearer " + this.access_token_cookie
  //       });
  //       var url = environment.server_url + "assign_tasks";
  //       var body = JSON.stringify({
  //         'group_id': this.group_id, 
  //         'task': assigned_tasks1
  //       });
  //       this.http.post(url, body, { "headers": headers }).subscribe(
  //         data => {
  //           if (data['status'] == '200') {
  //             this.router.navigate(['/trainer/groups'])
  //             this.openSnackBar("Successfully assigned task", 'msg')
  //           }
  //           else {
  //             this.openSnackBar(data['msg'], 'msg')
  //           }
  //         }, error => {
  //           console.log(error)
  //         }
  //       )
  //     }
  //   });
  // }

  assign_task() {
    const dialogRef = this.dialog.open(TreepopupComponent, {
      disableClose: true,
      data: { "group_id": this.group_id, "data": this.checked_data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result['flag'] == true) {
        let assigned_tasks = {}
        let assigned_tasks1 = {}
        for (let chapter of this.tree_data[0]['children']) {
          if (chapter['isSelected']) {
            for (let page of chapter['children']) {
              if (page['isSelected']) {
                if (page['isAssigned']) {
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
        assigned_tasks1[this.material_id] = assigned_tasks;
        var headers = new HttpHeaders({
          "content-type": "application/json",
        });
        var url = environment.server_url + "assign_tasks";
        var body = JSON.stringify({
          'group_id': this.group_id,
          'task': assigned_tasks1,
          'no_of_valid_days': result['days']
        });
        this.http.post(url, body, { "headers": headers }).subscribe(
          data => {
            if (data['status'] == '200') {
              this.router.navigate(['/trainer/groups'])
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar'],
    });
  }

  save_note_text() {
    localStorage.setItem("take_notes", this.take_notes)
  }

  scroll_to_element(el: HTMLElement) {
    el.scrollIntoView();
  }

  // getChapters() {
  //   var url = environment.quiz_url + "get/chapters/" + "id"
  //   this.http.get(url).subscribe(
  //     data => {
  //       console.log(data);
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   )
  // }

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
    this.http.get(url).subscribe(
      data => {
        // this.cache_serv.responseCache.set(url, data);
        data = data['data'];
        this.chapters_list = [];
        for (let i in data) {
          if (data[i] != null) {
            data[i]['chapter_url'] = data[i]['chapter_name'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
            this.chapters_list.push(data[i]);
          }
        }
        if (this.uid == "none" && this.chapters_list.length > 0) {
          var chapter_title = this.chapters_list[0]['chapter_name'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
          this.router.navigate(['/trainer/material', this.material_id, chapter_title, this.chapters_list[0]['_id'], this.group_id]);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  changePageFun(id: number, need_all_pages_data: boolean = false) {
    // this.reset_time_me();
    this.page_num = id;
    if (this.uid != null || this.uid != undefined) {
      this.getPage(need_all_pages_data);
    }
    const queryParams: Params = { page: this.page_num };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    })
  }

  changePage(id: number, need_all_pages_data: boolean) {
    this.page_num = id;
    if (this.uid != null || this.uid != undefined) {
      this.getPage(need_all_pages_data);
    }
  }

  getPage(need_all_pages_data: boolean) {
    console.log(need_all_pages_data)
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
    this.http.get(url).subscribe(
      data => {
        // const pagesFromCache = this.cache_serv.responseCache.get(url);
        // if (pagesFromCache) {
        //   // something
        // } else {
        for (let i = 0; i < data['page_data'].length; i++) {
          if (data['page_data'][i]['name'] == 'text') {
            data['page_data'][i]['data'] = this.sanitizer.bypassSecurityTrustHtml(data['page_data'][i]['data']);
          }
          else if (data['page_data'][i]['name'] == 'image') {
            let format_data = data['page_data'][i]['data'];
            data['page_data'][i]['data'] = 'data:image/' + data['page_data'][i]['file_type'].split('.')[1] + ';base64,' + format_data;
          }
        }
        // this.cache_serv.responseCache.set(url, data);
        // }

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
        this.correct_answers.push(answers);
      } else {
        this.correct_answers.push([]);
      }
      this.mcq_result.push(null);
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

  ok(main_ind) {
    this.flag = true
    // this.page_data[main_ind]['questions'] = thi
    console.log(this.backup_data[main_ind]['questions'])
    this.page_data[main_ind]['questions'] = this.backup_data[main_ind]['questions']
    this.mcq_result[main_ind] = []
    this.load_new_mcqs()
  }


  postdata(data: any) {
    var title = data['title'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
    this.router.navigate(['/home/post', title, data['_id']]);
  }

  // getQuestions_by_topic() {
  //   var body = { topic: "Strings" };
  //   var userData = JSON.parse(localStorage.getItem('userData'));
  //   const access_token = userData['access_token_cookie'];
  //   if (localStorage.getItem('data') == null) {
  //     const httpOptions = {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         'Access-Control-Allow-Origin': '*',
  //         'Authorization': 'Bearer ' + access_token
  //       })
  //     };
  //     var url = environment.quiz_url + 'get/random/level/questions';
  //     this.http.post(url, body, httpOptions).subscribe(data => {
  //       this.questions = data['data'];
  //       // this.len = this.questions.length;
  //       // if (this.questions.length === 0) {
  //       //   this.message = 'Currently there are no Questions.';
  //       // } else {
  //       let index = 0;
  //       for (const i of this.questions) {
  //         index = index + 1;
  //         const d = [];
  //         // tslint:disable-next-line:forin
  //         for (const j in i['options']) {
  //           d.push({ [j]: i['options'][j] });
  //         }
  //         i['options'] = d;
  //         i['_id'] = index;
  //         // i['len'] = this.len;
  //         i['color'] = '#959c9b'; //gray
  //         i['result'] = null;
  //         i['checked'] = 'null';
  //       }
  //       this.controlfabicons()
  //       // }
  //     }, error => {
  //       console.log(error)
  //     });
  //   }
  // }

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
    console.log(s)
    s.checked = isChecked;
    this.page_data[main_ind]['questions'][que_ind]['options'][opIn]['checked'] = isChecked;
    this.page_data[main_ind]['questions'][que_ind]['checked'] = isChecked;
    // localStorage.setItem('data', JSON.stringify(this.questions));
  }

  start_quiz() {
    this.flag = false
  }

  flag: boolean = true
  flag1: boolean = true

  Review() {
    this.flag1 = false

  }
  // onChange(s, isChecked: boolean, _id, que_ind, opIn, main_ind: number) {
  //   s.checked = isChecked;
  //   this.page_data[main_ind]['questions'][que_ind]['options'][opIn]['checked'] = isChecked;
  //   this.page_data[main_ind]['questions'][que_ind]['checked'] = isChecked;
  //   // localStorage.setItem('data', JSON.stringify(this.questions));
  // }

  chaps(mat_id, chap_name, chap_id, group_id) {
    this.router.navigate(['trainer/material', mat_id, chap_name, chap_id, group_id])
    // this.flags = this.flags
  }

  checked_data: any = [];

  onChange(e, i, c, isChecked, level) {
    if (level == 1) {
      // this.tree_data[0]['isSelected'] = isChecked.checked;
      for (let child of e['children']) {
        child['isSelected'] = isChecked.checked;
      }
      var isAtleastOneChecked: boolean;
      for (let child of e['children']) {
        if (child['isSelected']) {
          isAtleastOneChecked = true;
          break;
        }
      }
      if (isAtleastOneChecked) {
        e['isSelected'] = true;
        c['isSelected'] = true;
      } else {
        e['isSelected'] = false;
      }
      if (isChecked.checked == true) {
        if (e['isSelected'] == true) {
          this.checked_data.push(e)
        } else {
          let ind = this.checked_data.splice(this.checked_data.indexOf(e), 1)
        }
      } else {
        let ind = this.checked_data.splice(this.checked_data.indexOf(e), 1)
      }
    }
    if (level == 2) {

      if (isChecked.checked) {
        e['isSelected'] = true;
      } else {
        e['isSelected'] = false;
      }

      var isSiblingOneChecked: boolean;
      for (let sibling of c['children']) {
        if (sibling['isSelected']) {
          isSiblingOneChecked = true;
          break
        }
      }
      if (isSiblingOneChecked) {
        c['isSelected'] = true;
      } else {
        c['isSelected'] = false;
      }
      if (isChecked.checked == true) {
        if (c['isSelected'] == true) {
          this.checked_data.push(c)
        } else {
          let ind = this.checked_data.splice(this.checked_data.indexOf(c), 1)
        }
      }
      else {
        if (c['isSelected'] == false) {
          let ind = this.checked_data.splice(this.checked_data.indexOf(c), 1)
        }
      }
    }
    localStorage.setItem('tree_data', JSON.stringify(this.tree_data))
  }

  submit(main_ind) {
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
    console.log(user_selected_ans, this.correct_answers[main_ind])
    let i = 0;
    let diff: any;
    let unans = 0;
    let j: any;
    // tslint:disable-next-line:forin
    for (j in this.correct_answers[main_ind]) {
      console.log(j)
      if (user_selected_ans[j]) {
      } else {
        user_selected_ans[j] = [];
        unans += 1;
      }
      diff = this.correct_answers[main_ind][j].filter((x: any) => !user_selected_ans[j].includes(x)).concat(user_selected_ans[j].filter((x: any) => !this.correct_answers[main_ind][j].includes(x)));
      if (diff.length === 0) {
        i = i + 1;
      } else {
        console.log(diff)
      }
    }
    const percent = (i / this.page_data[main_ind]['questions'].length) * 100;
    let result: any;
    let ti: any = localStorage.getItem('time');
    result = {
      'Unanswered': unans, 'selectedAnswer': user_selected_ans, 'percent': Math.round(percent), 'len': this.page_data[main_ind]['questions'].length, 'correctans': i, 'data': JSON.stringify(this.page_data[main_ind]['questions'])
    };
    // this.reset_time_me(result['correctans'])
    this.mcq_result[main_ind] = result;
    this.review(this.page_data[main_ind]['questions'], this.correct_answers, main_ind)
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
      console.log(this.selectedIndex[main_ind])
      this.selectedIndex[main_ind] = 1
      console.log(this.selectedIndex[main_ind])
      console.log(num)
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

  code_editor(index: any, code: any) {
    localStorage.setItem("code_material", code);
    this.refresh_iframe(code);
    this.code_side_event();

    // if (this.page_data[index]['show']) {
    //   this.page_data[index]['show'] = false;
    // } else {
    //   this.page_data[index]['show'] = true;
    // }
  }

  refresh_iframe(code: string) {
    var frame = this.iframe_code.nativeElement.contentWindow;
    frame.document.getElementById('code_refresh').click();
  }

  code_side_event() {
    var element = document.getElementById("editorkeys");
    console.log(element)
    if (this.editor_flag) {
      this.editor_flag = false;
      element.classList.remove("code_side_button_1");
    } else {
      this.editor_flag = true;
      element.classList.add("code_side_button_1");
    }
    var class_list = this.side_code_editor.nativeElement.classList;
    if (class_list.contains("container_code1")) {
      this.side_code_editor.nativeElement.classList.remove("container_code1");
      
    } else {
      this.side_code_editor.nativeElement.classList.add("container_code1");
    }
    // if (this.code_side_button) {
    //   this.code_side_button = false;
    // } else {
    //   this.code_side_button = true;
    // }
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
