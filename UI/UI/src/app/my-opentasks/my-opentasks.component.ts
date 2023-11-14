import { environment } from 'src/environments/environment';
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-opentasks',
  templateUrl: './my-opentasks.component.html',
  styleUrls: ['./my-opentasks.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MyOpentasksComponent implements OnInit {

  // data variable
  mcqTasks :any;
  contentTask :any;
  challengeTask :any;
  expandedElement:any = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource2: MatTableDataSource<{}>;

  TaskMaterial(task_data: any){
    console.log(task_data);
    var chapter_name = task_data['topic'][0]['chapter_name'].replace(/[^a-zA-Z0-9 ]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 100);
    var chapter_id = task_data['topic'][0]['_id'];
    // console.log('material', task_data['course']['_id'], chapter_name, chapter_id, task_data['group_id'])
    this.router.navigate(['/task_material', task_data['course']['_id'], chapter_name, chapter_id, task_data['group_id'], task_data['task_id']])
  }

  // data columns
  mcqCols = ['topic','page_no','lockdate','targetdate','status','btn'];
  contentCols = ['topic','page_no','lockdate','targetdate','status','btn'];
  challengeCols = ['topic','page_no','lockdate','targetdate','status','btn'];

  //  table filter function
  applyFilter(filterValue: string) {
    this.mcqTasks.filter = filterValue.trim().toLowerCase();
  }

  getTasks() {
    this.contentTask = new MatTableDataSource();
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    var url = environment.server_url + "get_student_related_tasks";
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
    }

    this.http.get(url, httpOptions).subscribe(
      data => {
        console.log(data)
        var task_data: any = data;
        for(let task of task_data) {
          let date = new Date(task['date']);
          task['date'] = new Date(task['date']).toLocaleString();
          task['targetdate'] = new Date(date.setDate( date.getDate() + 2)).toLocaleString();
        }
        this.contentTask = new MatTableDataSource(task_data);
      },
      error => {
        console.log(error);
      }
    );
    

    // this.mcqTasks = new MatTableDataSource();
    // this.mcqTasks =  trueData['targets']['open']['mcq'];
    // this.mcqTasks.paginator = this.paginator;
    // this.challengeTask = new MatTableDataSource();
    // this.challengeTask =  trueData['targets']['submitted']['challenge'];
  }

  get_tasks(_id) {
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    var url = environment.server_url +'get/group_tasks';
    const body = {
      '_id': _id
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + access_token_cookie,
      })
    }
    this.http.post(url, body, httpOptions).subscribe(data => {
      // console.log(data, "called")
      let tasks: any;
      for (let d in data) {
        let date = new Date(data[d]['date']);
        data[d]['task_no'] = Number(d) + 1;
        data[d]['date'] =  new Date(data[d]['date']).toLocaleString();
        data[d]['target_date'] = new Date(date.setDate( date.getDate() + 2)).toLocaleString();
        data[d]['course']['material_name'] = data[d]['course']['material_name'].toUpperCase();
      }
      tasks = data;
      this.dataSource2 = new MatTableDataSource(tasks);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
    })
  }

  @ViewChild('paginator', { "static": false }) paginator2: MatPaginator;
  @ViewChild(MatSort, { "static": false }) sort2: MatSort;

  constructor(public http:HttpClient,public router:Router) { }

  ngOnInit() {
    this.getTasks()
  }
}

