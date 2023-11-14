import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpclientServiceService } from '../../../httpclient-service.service';
import { Router, NavigationStart, RoutesRecognized, ActivatedRoute, NavigationEnd } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as Prism from 'prismjs';
import { HighlightService } from '../../highlight.service';
import { Location } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-assessmentresult',
  templateUrl: './assessmentresult.component.html',
  styleUrls: ['./assessmentresult.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AssessmentresultComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  name: string;
  columnsToDisplay = ['s.no', 'email', 'group_id', 'assessment_id', 'trail_id', 'percent', 'time', 'date'];
  data: any;
  userdata: any;
  backUrl: any;
  message: string;
  previousUrl: any;
  serdata: any;
  spinner = false;
  result: any
  @ViewChild('paginator', { 'static': true }) paginator: MatPaginator;
  @ViewChild('sort', { 'static': true }) sort: MatSort;

  constructor(public http: HttpclientServiceService, private _location: Location, public router: Router, public route: ActivatedRoute,
    public highlightService: HighlightService) {

    route.params.subscribe(params => {
      this.name = params['name'];
      let data = {}
      data['email'] = params['email'];
      this.getUserResult(data);
    })
  }

  getUserResult(data) {
    this.spinner = true;
    const url = 'get/user_assessment_result';
    this.http.postMethod(url, data).subscribe(data => {
      console.log(data)
      this.spinner = false;
      if (data['flag'] == true) {
        for (let i = 0; i < data['data']['length']; i++) {
          let z = new Date(data['data'][i]['date'])
          data['data'][i]['s.no'] = i + 1
          data['data'][i]['date'] = z.toString().split("GMT")[0]
        }
        this.dataSource = new MatTableDataSource(data['data']);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else {
        this.message = "No user attempted this assessment";
      }
    },
      error => {
        this.spinner = false;
        console.log(error);
      }
    );
  }

  getUserAssessmentResult(element) {
    console.log(element)
    this.spinner = true;
    const url = 'get/user_assessment';
    const body = {
      'email': element['email'],
      'assessment_id': element['assessment_id'],
      'trail_id': element['trail_id']
    }
    this.http.postMethod(url, body).subscribe(data => {
      console.log(data['data'])
      this.spinner = false;
      if (data['flag'] == true) {
        this.getAssessmentData(data['data'])
      }
    })
  }

  getAssessmentData(element) {
    console.log(element)
    this.spinner = true;
    const correctAnswers = [];
    let c = 0;
    let d = 0;
    const url = 'get/assessment';

    const body = {
      assessment_id: Number(element.assessment_id)
    };
    this.http.postMethod(url, body).subscribe(data => {
      this.spinner = false;
      let correctAnswers = []
      for (let i in data[0].questions) {
        correctAnswers.push(data[0].questions[i]['answer'])
      }
      // const options = [];
      for (let q of data[0].questions) {
        console.log(q)
        const d = [];
        for (let o in q['options']) {
          // console.log(o)
          d.push({ [o]: q['options'][o] });
        }
        q['options'] = d;
      }

      // console.log(correctAnswers)
      for (let i in data[0].questions) {
        let user = element['result'][i]['answer'].filter((x: any) => !correctAnswers[i].includes(x))
        console.log(user)
        if (user.length > 0) {
          for (let useranswer of user) {
            for (let checkanswer in data[0].questions[i]['options']) {
              console.log(useranswer, Object.keys(data[0].questions[i]['options'][checkanswer])[0])
              if (useranswer == Object.keys(data[0].questions[i]['options'][checkanswer])[0]) {
                data[0].questions[i]['options'][checkanswer]['correct'] = false;
              }
            }
          }
        }
      }
      for (let co in correctAnswers) {
        console.log(co)
        for (let useranswer of correctAnswers[co]) {
          console.log(useranswer)
          for (let checkanswer in data[0].questions[co]['options']) {
            if (useranswer == Object.keys(data[0].questions[co]['options'][checkanswer])[0]) {
              data[0].questions[co]['options'][checkanswer]['correct'] = true;
            }
          }
        }
      }
      this.data= data
      console.log(this.data)

    }, error => {
      this.spinner = false;
      console.log(error);
    }
    );
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }

  ngOnInit() { }

  backClicked() {
    this._location.back();
  }

}


