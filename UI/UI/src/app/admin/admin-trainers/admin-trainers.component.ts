import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {trainersData} from '../../shared/adminData'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-admin-trainers',
  templateUrl: './admin-trainers.component.html',
  styleUrls: ['./admin-trainers.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminTrainersComponent implements OnInit {

  trainerCols = ['img','faculty_id','name','batch_cnt','completed','open','time_spent','rating','btn'];
  trainerBatches:any;
  expandedElement:any = null;


  constructor() {

  }
  getTrainers(){
    this.trainerBatches =  new MatTableDataSource();
    this.trainerBatches = trainersData
    console.log(this.trainerBatches)

  }

  ngOnInit() {
    this.getTrainers()
  }

}
