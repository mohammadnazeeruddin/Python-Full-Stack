// import { MsgpopupComponent } from './../../msgpopup/msgpopup.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { HttpclientServiceService } from './../../../httpclient-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-conduct',
  templateUrl: './conduct.component.html',
  styleUrls: ['./conduct.component.scss']
})
export class ConductComponent implements OnInit {

  conduct_details: any;
  conductForm: FormGroup;
  group_ids: Array<any> = [];
  minDateStart: Date = new Date();

  constructor(public conductBuilder: FormBuilder, 
    public http: HttpclientServiceService, 
    public router: Router,
    public dialog: MatDialog, public dialogRef: MatDialogRef<ConductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.conductForm = conductBuilder.group({
      type: ['', [Validators.required]],
      group_id: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]]
      // topics: ['', [Validators.required]],
      // type: ['', [Validators.required]],
      // hours: ['', [Validators.required]],
      // minutes: ['', [Validators.required]],
      // reviewer: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.conduct_details = JSON.parse(localStorage.getItem('conduct_details'));
    this.getGroups();
  }

  // openDialog(msg: any): void {
  //   const dialogRef = this.dialog.open(MsgpopupComponent, {
  //     width: '400px',
  //     data: {"msg": msg,type: 'conduct'}
  //   });
  // }

  getGroups() {
    var url = 'get/groups';
    this.http.getMethod(url).subscribe(
      data => {
        for (let i in data['groups']) {
          this.group_ids.push(data['groups'][i]['group_id'])
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  conductAssessment() {
    if (this.conductForm.valid) {
      var url = "conduct/offline/assessment";
      var body = this.conductForm.value;
      body['assessment_id'] = this.conduct_details['assess_id'];
      body['assess_doc_id'] = this.conduct_details['assess_doc_id'];
      body = JSON.stringify(body);
      this.http.postMethod(url, body).subscribe(
        data => {
          this.dialogRef.close(true);
          // this.openDialog("Conduct Assessment request was successful")
          // this.router.navigate(['/home/assessments']);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  dateChange(event: any) {
    console.log(event);
  }

}
