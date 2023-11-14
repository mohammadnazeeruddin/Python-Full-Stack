import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { HttpclientServiceService } from './../../httpclient-service.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { PopupComponent } from './popup/popup.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CreateComponent } from './create/create.component';
import Swal from 'sweetalert2'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupsComponent implements OnInit {

  tree_data = []
  treeControl: any;
  tree_dataSource: any;
  hasChild: any;
  @ViewChild('myButton', { static: false }) public myButtonRef: ElementRef

  dataSource: MatTableDataSource<any>;
  dataSource4: MatTableDataSource<any>;
  groupid: any;
  displayedColumns: string[] = ['s.no', 'name', 'email', 'no_attempts', 'percentage', 'details'];
  groups_data: any;
  groups_data1: any;
  displayedColumns4: string[] = ['s.no', 'email', 'percentage', 'status'];
  spinner = false;
  index = 0;

  @ViewChild('paginator', { "static": false }) paginator: MatPaginator;
  @ViewChild(MatSort, { "static": false }) sort: MatSort;
  @ViewChild('paginator', { "static": false }) paginator1: MatPaginator;
  @ViewChild(MatSort, { "static": false }) sort1: MatSort;
  @ViewChild('paginator', { "static": false }) paginator2: MatPaginator;
  @ViewChild(MatSort, { "static": false }) sort2: MatSort;
  @ViewChild('paginator', { "static": false }) paginator3: MatPaginator;
  @ViewChild(MatSort, { "static": false }) sort3: MatSort;
  group_id: any;
  message: string;
  material_list: Object;
  user = JSON.parse(localStorage.getItem("login_data"));
  access_token_cookie = this.user['access_token_cookie']
  // @ViewChild("chart", { "static": false }) chart: ChartComponent;

  constructor(public http: HttpClient, public http1: HttpclientServiceService, public router: Router, public dialog: MatDialog) {

    let d = {}
    let c = { 'name': 'jgsd', 'jjfd': 'skjfhr', 'skjv': 'sjfhj' }
    this.getMaterials()
    d['1'] = c
    console.log(d)
    let e = {}
    e['2'] = { 'jfh': 'jsg', 'jsfhg': 'jfshg', 'jksfj': 'jhf' }
    d = Object.assign(d, e);
    console.log(d)
    let fg = {};
    fg['4'] = {'fjhj':'kajfh', 'kjsh':'mhgh', 'jkjg':'jafh'}
    d = Object.assign(d, fg);
    console.log(d)

  }

  createBatch() {
    const dialogRef = this.dialog.open(CreateComponent, {
      disableClose: true,
      data: { 'type': 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result['flag'] == true) {
        console.log(result)
        Swal.fire(result['group_id'], result["msg"], "success");
        this.get_groups()
      }
    });
  }


  add_course() {
    console.log(this.groups_data[this.index])
    const dialogRef = this.dialog.open(CreateComponent, {
      disableClose: true,
      data: { 'type': 'add_course', 'group_id': this.groups_data[this.index]['_id'], 'material_data': this.material_list, 'selected_courses': this.groups_data[this.index].course }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result == true) {
        this.get_groups()
      }
    });
  }



  cardClick(data, i) {
    console.log(data, i)
    this.index = i;
    // this.batch_name = data['batch_name']
    this.get_tasks(data[i]['_id'])
    this.getGroupData(data[i]['_id'])
    this.getChallengeData(data[i]['_id'])
    this.getOverallStatus(data[i]['_id'])
    // this.gettasksData(data['batch_name'])
  }

  getMaterials() {
    // var url = environment.server_url + "create/admin";
    //   console.log(url)
    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Access-Control-Allow-Origin': '*',
    //       'content-type': 'application/json'
    //     })
    //   }
    this.http1.getMethod("get/materials").subscribe(
      data => {
        console.log(data)
        this.material_list = data;
        // this.user = JSON.parse(localStorage.getItem("login_data"));
        // if(this.user) {
        //   // this.router.navigate(['/material/'+ this.material_list[0]['_id'] + "/none/none"]);
        //   this.router.navigate(['/trainer']);
        // }
      },
      error => {
        console.log(error);
      }
    )
  }

  get_task_data(task_id: string) {
    var url = environment.server_url + "get_task_compleation_status_of_students_in_group";
    var body = JSON.stringify({ "group_id": this.groups_data[this.index]['_id'], "task_id": task_id })
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token_cookie,
      })
    }
    this.http.post(url, body, httpOptions).subscribe(
      data => {
        let task_data: any = data;
        this.dataSource4 = new MatTableDataSource(task_data);
      },
      error => {
        console.log(error);
      }
    )
  }

  ngOnInit() {
    this.get_groups();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.groups_data, event.previousIndex, event.currentIndex);
  }

  // Getting groups
  get_groups() {
    this.spinner = true;
    var url = environment.server_url + "get/groups";
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token_cookie,

      })
    }
    this.http.get(url, httpOptions).subscribe(
      data => {
        console.log(data)
        this.spinner = false;
        this.groups_data = data['groups'];
        this.groups_data1 = data['groups'];
        console.log(this.groups_data);
        if (this.groups_data.length > 0) {

          this.get_tasks(this.groups_data[this.index]['_id'])
          this.getGroupData(this.groups_data[this.index]['_id'])
          this.getChallengeData(this.groups_data[this.index]['_id'])
          this.getOverallStatus(this.groups_data[this.index]['_id'])
          // for (let mat of this.groups_data) {
          //   for (let mat_na of mat['course']) {
          //     console.log(mat_na['material_name']);
          //   }
          // }
        }
      }, error => {
        console.log(error)
        if (error.status == 422) {
          this.router.navigate(['/login']);
        }
        this.spinner = false;
      }
    );
  }

  // Add members to the group
  addMembers(index) {
    this.spinner = true;
    let url = environment.server_url + "post/updateGroup";
    let body = JSON.stringify({ "group_id": this.groups_data[this.index]['_id'] })
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token_cookie,

      })
    }
    this.http.post(url, body, httpOptions).subscribe(
      data => {
        this.spinner = false;
        this.openDialog(data);
      }, error => {
        this.spinner = false;
        console.log(error);
      }
    );
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      disableClose: true,
      data: {'type': 'join_students',"batch_name": data.batch_name, "code": data.code }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  dataSource2: MatTableDataSource<any>;
  groupid2: any;
  displayedColumns2: string[] = ['task_no', 'date', 'target_date', 'course', 'completion_status'];

  // get_tasks(group_id) {
  //   let url = 'get/group_tasks';
  //   const body = {
  //     'group_id': group_id
  //   };
  //   this.http1.postMethod(url, body).subscribe(data => {
  //     let tasks: any
  //     for (let d in data) {
  //       data[d]['task_no'] = Number(d) + 1
  //       let date = new Date(data[d]['date']);
  //       data[d]['target_date'] = new Date(date.setDate( date.getDate() + 2));
  //     }
  //     tasks = data
  //     this.dataSource2 = new MatTableDataSource(tasks);
  //     this.dataSource2.paginator = this.paginator2;
  //     this.dataSource2.sort = this.sort2;
  //   })
  // }

  get_tasks(_id) {
    var url = environment.server_url + 'get/group_tasks';
    const body = {
      '_id': _id
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token_cookie,
      })
    }
    this.http.post(url, body, httpOptions).subscribe(data => {
      // console.log(data, "called")
      let tasks: any;
      for (let d in data) {
        let date = new Date(data[d]['date']);
        data[d]['task_no'] = Number(d) + 1;
        data[d]['date'] = new Date(data[d]['date']).toLocaleString();
        data[d]['target_date'] = new Date(date.setDate(date.getDate() + 2)).toLocaleString();
        data[d]['course']['material_name'] = data[d]['course']['material_name'].toUpperCase();
      }
      tasks = data;
      this.dataSource2 = new MatTableDataSource(tasks);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
    })
  }


  getGroupData(group_id) {
    this.spinner = true;
    var url = environment.server_url + 'get_group_mcqs_result/by_groupId';
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.access_token_cookie,

      })
    }
    const body = {
      'group_id': group_id
    };
    this.http.post(url, body, httpOptions).subscribe(
      data => {
        this.spinner = false;
        if (data['flag'] === true) {
          for (let p in data['data']) {
            data['data'][p]['percent'] = (data['data'][p]['percent'] * 100) / 10
          }
          this.dataSource = new MatTableDataSource(data['data']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error => {
        this.spinner = false;
        console.log(error);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  showGroupMembers(group_id) {
    let route = 'trainer/groups/groupdetails/' + group_id;
    this.router.navigate([route]);
  }

  assessments(row, name, email) {
    if (row.length > 0) {
      let url = '/trainer/groups/assessmentresult' + '/' + name + '/' + email;
      this.router.navigate([url]);
    }
    else {
      this.message = 'No student attempted assessment';
    }
  }

  dataSource1: MatTableDataSource<any>;
  groupid1: any;
  displayedColumns1: string[] = ['s.no', 'name', 'email', 'no_attempts', 'percentage', 'details'];

  getChallengeData(batch) {
    let data: any;
    // if (Object.keys(this.ChallengeData[0]).includes(batch)) {
    //   data = this.ChallengeData[0][batch];
    // }
    this.dataSource1 = new MatTableDataSource(this.ChallengeData);
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort1;
  }


  showTree(topic) {
    // const dialogRef = this.dialog.open(TreepopupComponent, {
    //   hasBackdrop: true,
    //   data: { 'type': 'tree', 'topic': topic, 'trigger': this.myButtonRef }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // });
  }

  dataSource3: MatTableDataSource<any>;
  groupid3: any;
  displayedColumns3: string[] = ['s.no', 'name', 'email', 'percentage'];

  // Get overall status
  getOverallStatus(batch) {
    this.dataSource3 = new MatTableDataSource(this.over_all);
    this.dataSource3.paginator = this.paginator3;
    this.dataSource3.sort = this.sort3;
  }


  ChallengeData = [{
    'challenges_attempted': 7,
    'email': 'bharatinilam@gmail.com',
    'name': 'Bharati Nilam',
    'percent': 42,
    's.no': 1
  },
  {
    'challenges_attempted': 3,
    'email': 'ksrinub@gmail.com',
    'name': 'K Srinu',
    'percent': 99,
    's.no': 2
  },
  {
    'challenges_attempted': 2,
    'email': 'maheshpuppala21@gmail.com',
    'name': 'Mahesh Puppala',
    'percent': 10,
    's.no': 3
  },
  {
    'challenges_attempted': 4,
    'email': 'kataribhargavi1@gmail.com',
    'name': 'Katari Bhargavi',
    'percent': 66,
    's.no': 4
  },
  {
    'challenges_attempted': 1,
    'email': 'swathirao1511@gmail.com',
    'name': 'Swathirao Suguru',
    'percent': 28,
    's.no': 5
  },
  {
    'challenges_attempted': 6,
    'email': 'mahendhar008@gmail.com',
    'name': 'Mahendhar Reddy',
    'percent': 48,
    's.no': 6
  },
  {
    'challenges_attempted': 4,
    'email': 'ravulakavya06@gmail.com',
    'name': 'Ravula Kavya',
    'percent': 21,
    's.no': 7
  },
  {
    'challenges_attempted': 9,
    'email': 'srujand123@gmail.com',
    'name': 'Srujan Chintu',
    'percent': 44,
    's.no': 8
  },
  {
    'challenges_attempted': 7,
    'email': 'sailakshmanbandaru@gmail.com',
    'name': 'Sai Lakshman Babu Bandaru',
    'percent': 45,
    's.no': 9
  },
  {
    'challenges_attempted': 5,
    'email': 'saratchaitanyaveluri@gmail.com',
    'name': 'Sarat Chaitanya',
    'percent': 77,
    's.no': 10
  },
  {
    'challenges_attempted': 6,
    'email': 'abhishekaaveti@gmail.com',
    'name': 'Abhi Abhishek',
    'percent': 72,
    's.no': 11
  },
  {
    'challenges_attempted': 4,
    'email': 'tharunrao063@gmail.com',
    'name': 'Tharun Tej Rao',
    'percent': 56,
    's.no': 12
  },
  {
    'challenges_attempted': 8,
    'email': 'gsuraj541@gmail.com',
    'name': 'Goutham Suraj',
    'percent': 13,
    's.no': 13
  },
  {
    'challenges_attempted': 7,
    'email': 'navyasahithibandi.30@gmail.com',
    'name': 'Navya Sahithi',
    'percent': 77,
    's.no': 14
  },
  {
    'challenges_attempted': 6,
    'email': 'spoorthy7777@gmail.com',
    'name': 'Spoorthy Chandra',
    'percent': 90,
    's.no': 15
  },
  {
    'challenges_attempted': 7,
    'email': 'ravanamsridevi@gmail.com',
    'name': 'Ravanam Sridevi',
    'percent': 32,
    's.no': 16
  },
  {
    'challenges_attempted': 2,
    'email': 'mkmanikanta251@gmail.com',
    'name': 'Mani Kanta',
    'percent': 17,
    's.no': 17
  }]

  over_all = [{
    'email': 'bharatinilam@gmail.com',
    'name': 'Bharati Nilam',
    'percent': 30,
    's.no': 1
  },
  { 'email': 'ksrinub@gmail.com', 'name': 'K Srinu', 'percent': 48, 's.no': 2 },
  {
    'email': 'maheshpuppala21@gmail.com',
    'name': 'Mahesh Puppala',
    'percent': 78,
    's.no': 3
  },
  {
    'email': 'kataribhargavi1@gmail.com',
    'name': 'Katari Bhargavi',
    'percent': 36,
    's.no': 4
  },
  {
    'email': 'swathirao1511@gmail.com',
    'name': 'Swathirao Suguru',
    'percent': 48,
    's.no': 5
  },
  {
    'email': 'mahendhar008@gmail.com',
    'name': 'Mahendhar Reddy',
    'percent': 97,
    's.no': 6
  },
  {
    'email': 'ravulakavya06@gmail.com',
    'name': 'Ravula Kavya',
    'percent': 85,
    's.no': 7
  },
  {
    'email': 'srujand123@gmail.com',
    'name': 'Srujan Chintu',
    'percent': 88,
    's.no': 8
  },
  {
    'email': 'sailakshmanbandaru@gmail.com',
    'name': 'Sai Lakshman Babu Bandaru',
    'percent': 85,
    's.no': 9
  },
  {
    'email': 'saratchaitanyaveluri@gmail.com',
    'name': 'Sarat Chaitanya',
    'percent': 75,
    's.no': 10
  },
  {
    'email': 'abhishekaaveti@gmail.com',
    'name': 'Abhi Abhishek',
    'percent': 35,
    's.no': 11
  },
  {
    'email': 'tharunrao063@gmail.com',
    'name': 'Tharun Tej Rao',
    'percent': 64,
    's.no': 12
  },
  {
    'email': 'gsuraj541@gmail.com',
    'name': 'Goutham Suraj',
    'percent': 42,
    's.no': 13
  },
  {
    'email': 'navyasahithibandi.30@gmail.com',
    'name': 'Navya Sahithi',
    'percent': 72,
    's.no': 14
  },
  {
    'email': 'spoorthy7777@gmail.com',
    'name': 'Spoorthy Chandra',
    'percent': 86,
    's.no': 15
  },
  {
    'email': 'ravanamsridevi@gmail.com',
    'name': 'Ravanam Sridevi',
    'percent': 32,
    's.no': 16
  },
  {
    'email': 'mkmanikanta251@gmail.com',
    'name': 'Mani Kanta',
    'percent': 32,
    's.no': 17
  }]

}