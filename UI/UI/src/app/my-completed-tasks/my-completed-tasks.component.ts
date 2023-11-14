
import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {mainTopics,subTopics,trueData} from '../shared/trueData'
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-my-completed-tasks',
  templateUrl: './my-completed-tasks.component.html',
  styleUrls: ['./my-completed-tasks.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MyCompletedTasksComponent implements OnInit {
// data variable
  mcqTasks :any;
  contentTask :any;
  challengeTask :any;
// data columns
  mcqCols = ['topic','page_no','lockdate','targetdate','submitdate','btn'];
  contentCols = ['topic','page_no','lockdate','targetdate','submitdate','btn'];
  challengeCols = ['topic','page_no','lockdate','targetdate','submitdate','btn'];
//  table filter function
  applyFilter(filterValue: string) {
    this.mcqTasks.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  getRecords(){
    this.mcqTasks = new MatTableDataSource();
    this.mcqTasks =  trueData['targets']['submitted']['mcq'];
    this.mcqTasks.paginator = this.paginator;
    this.contentTask = new MatTableDataSource();
    this.contentTask =  trueData['targets']['submitted']['content'];
    this.challengeTask = new MatTableDataSource();
    this.challengeTask =  trueData['targets']['submitted']['challenge'];


  }

  constructor(public http:HttpClient) {

   }

  ngOnInit() {
    this.getRecords()
  }


}
