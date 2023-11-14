import { Router } from '@angular/router';
import { HttpclientServiceService } from './../../httpclient-service.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
// import { AssessmentresultComponent } from './../share/assessmentresult/assessmentresult.component';
import { MatTabChangeEvent } from '@angular/material';
import { Location } from '@angular/common';
import { ConductComponent } from './conduct/conduct.component';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {

  index: Number;
  spinner = false;
  displayedColumns3: string[] = ['id', 'name', 'author', 'course', 'status', 'reviewer', 'post_date', 'conduct'];
  displayedColumns4: string[] = ['s.no', 'assessment_id', 'trail_id', 'group_id', 'details'];

  expandedElement: any | null;

  // dataSource: MatTableDataSource<any>;
  // pendingDataSource: MatTableDataSource<any>;
  // forRevieweDataSource: MatTableDataSource<any>;
  conductDataSource: MatTableDataSource<any>;
  conductedDataSource: MatTableDataSource<any>;

  // @ViewChild('paginator', { 'static': true }) paginator: MatPaginator;
  // @ViewChild('paginator1', { 'static': true }) paginator1: MatPaginator;
  // @ViewChild('paginator2', { 'static': true }) paginator2: MatPaginator;
  @ViewChild('paginator3', { 'static': true }) paginator3: MatPaginator;
  @ViewChild('paginator4', { 'static': true }) paginator4: MatPaginator;

  // @ViewChild('sort', { 'static': true }) sort: MatSort;
  // @ViewChild('sort1', { 'static': true }) sort1: MatSort;
  // @ViewChild('sort2', { 'static': true }) sort2: MatSort;
  @ViewChild('sort3', { 'static': true }) sort3: MatSort;
  @ViewChild('sort4', { 'static': true }) sort4: MatSort;


  constructor(public http: HttpclientServiceService, public router: Router,
    private _location: Location, public dialog: MatDialog) {
    // console.log(localStorage);
    // this.index = Number(localStorage.getItem('indexes'));
    // this.callTabs(this.index);
    // this.onLinkClick(this.index);
    this.getAllReviewedAssessments();
  }

  ngOnInit() {
    // this.getreviewedAssessments();
  }

  createAssessment() {
    this.router.navigate(['/trainer/assessments/create']);
  }

  createfromqb() {
    this.router.navigate(['/trainer/assessments/create_from_qb'])
  }

  openDialog(group_id: any, assess_id: any): void {
    const dialogRef = this.dialog.open(ConductComponent, {
      disableClose: true,
      data: { "group_id": group_id, "code": assess_id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  conductAssessment(row: any) {
    this.openDialog(row['_id'], row['assessment_id'])
    // localStorage.setItem('conduct_details', JSON.stringify({ 'assess_doc_id': row['_id'], 'assess_id': row['assessment_id'] }));
    // this.router.navigate(['/trainer/assessments/conduct']);
  }

  getAllReviewedAssessments() {
    this.spinner = true;
    var url = 'get/all_reviewed_assessments';
    this.http.getMethod(url).subscribe(
      data => {
        console.log(data)
        this.spinner = false;
        var assess_list = [];
        for (let i in data) {
          assess_list.push(data[i]);
        }
        this.conductDataSource = new MatTableDataSource(assess_list);
        this.conductDataSource.paginator = this.paginator3;
        this.conductDataSource.sort = this.sort3;
      },
      error => {
        this.spinner = false;
        console.log(error);
      }
    );
  }

  editAssessment(row) {
    if (row['status'] == 'draft') {
      localStorage.setItem('assessment_id', row['_id']);
      this.router.navigate(['/home/assessments/create']);
    } else {
      localStorage.setItem('assessment_edit_id', row['_id']);
      this.router.navigate(['/home/assessments/edit']);
    }
  }

  // applyFilter(filterValue: string, tab_num: number) {
  //   if (tab_num == 1) {
  //     this.dataSource.filter = filterValue.trim().toLowerCase();
  //     if (this.dataSource.paginator) {
  //       this.dataSource.paginator.firstPage();
  //     }
  //   }

  //   if (tab_num == 2) {
  //     this.pendingDataSource.filter = filterValue.trim().toLowerCase();
  //     if (this.pendingDataSource.paginator) {
  //       this.pendingDataSource.paginator.firstPage();
  //     }
  //   }

  //   if (tab_num == 3) {
  //     this.forRevieweDataSource.filter = filterValue.trim().toLowerCase();
  //     if (this.forRevieweDataSource.paginator) {
  //       this.forRevieweDataSource.paginator.firstPage();
  //     }
  //   }
  // }

  getConductedAssessments() {
    this.spinner = true;
    let url = 'get/conducted_assessments';
    this.http.getMethod(url).subscribe(
      data => {
        this.spinner = false;
        this.conductedDataSource = new MatTableDataSource(data['data']);
        this.conductedDataSource.paginator = this.paginator4;
        this.conductedDataSource.sort = this.sort4;
      }, error => {
        this.spinner = false;
        console.log(error)
      });
  }

  onLinkClick(event: MatTabChangeEvent) {
    this.index = event.index;
    if (this.index == 1) {
      this.getConductedAssessments();
    }
  }

  // callTabs(i: any) {
  //   if (i == 1) {
  //     this.getPendingAssessments();
  //   }
  //   if (i == 2) {
  //     this.getForRevieweAssessments();
  //   }
  //   if (i == 3) {
  //     this.getAllReviewedAssessments();
  //   }
  //   if (i == 4) {
  //     
  //   }
  // }

  assessmentDetails(assessment_id, trail_id) {
    let route = 'home/assessments/assessmentresult/' + assessment_id + '/' + trail_id;
    this.router.navigate([route]);
  }

  // ngOnDestroy() {
  //   localStorage.removeItem('index');
  // }

}
