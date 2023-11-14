import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { trainerApprovalData, trainerApprovedData } from '../../shared/adminData'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { HttpclientServiceService } from './../../httpclient-service.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-access',
  templateUrl: './admin-access.component.html',
  styleUrls: ['./admin-access.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminAccessComponent implements OnInit {

  trainerCols = ['faculty_name', 'email', 'request_date', 'btn'];
  trainerApprovedCols = ['faculty_name', 'email', 'request_date', 'approved_date', 'btn'];

  trainerAccessData: any;
  trainerApprovedData: any;
  expandedElement: any = null;
  dataSource2: MatTableDataSource<any>;
  user = JSON.parse(localStorage.getItem("login_data"));

  sweetApprove(_id) {
    let url = "trainer/approve_or_reject";
    let body = JSON.stringify({
      '_id': _id,
      'status': 'approved'
    })
    Swal.fire({
      title: 'Are you sure to approve trainer?',
      // text: "You want be approve!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
      if (result.value) {
        this.http.postMethod(url, body).subscribe(
          data => {
            console.log(data)

            Swal.fire(
              'approved!',
              data['result'],
              'success'
            )
            this.getTrainers()
            this.getApprovedTrainers()
          }
        )
      }
    })
  }
  sweetCancel(_id) {
    let url = "trainer/approve_or_reject";
    let body = JSON.stringify({
      '_id': _id,
      'status': 'rejected'
    })
    Swal.fire({
      title: 'Are you sure to reject trainer?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.value) {
        this.http.postMethod(url, body).subscribe(
          data => {
            console.log(data)
            Swal.fire(
              'Rejected!',
              data['result'],
              'success'
            )
            this.getTrainers()
            this.getApprovedTrainers()
          }
        )
      }
    })
  }
  constructor(public http: HttpclientServiceService, public router: Router) {

  }
  getTrainers() {
    console.log(this.user)
    this.http.getMethod("get/trainer_requests").subscribe(
      data => {
        console.log(data)
        let requests: any = []
        for (let p in data) {
          console.log(p)
          requests.push(data[p])
        }
        this.trainerAccessData = new MatTableDataSource(requests);

        // this.trainerAccessData = trainerApprovalData
        // console.log(this.trainerAccessData)
      }, error => {
        console.log(error)
        // if (error.status == 422) {
        //   this.router.navigate(['admin/login']);
        // }
      }
    )
  }

getApprovedTrainers(){
  let url = "get/approved_trainers/" + this.user['institution']
  this.http.getMethod(url).subscribe(
    data => {
      console.log(data)
      let requests: any = []
      for (let p in data) {
        console.log(p)
        requests.push(data[p])
      }
      this.trainerApprovedData = new MatTableDataSource(requests);

      // this.trainerAccessData = trainerApprovalData
      // console.log(this.trainerAccessData)
    }, error => {
      console.log(error)
      // if (error.status == 422) {
      //   this.router.navigate(['admin/login']);
      // }
    }
  )
}


  ngOnInit() {
    this.getTrainers()
    this.getApprovedTrainers()
  }

}
