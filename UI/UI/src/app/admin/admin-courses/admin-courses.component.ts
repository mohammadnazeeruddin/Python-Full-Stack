import { Component, OnInit } from '@angular/core';
import { trainersData,adminBatchesData,adminCourseData } from '../../shared/adminData'


@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit {
  trainersData:any;
  adminCourseData:any;
  hide_list = [];
  expand(pos: number) {
    if (this.hide_list[pos]) {
      this.hide_list[pos] = false
    } else {
      this.hide_list[pos] = true
    }
  }


  constructor() {
    this.trainersData = trainersData;
    this.adminCourseData = adminCourseData
   }

  ngOnInit() {
  }

}
