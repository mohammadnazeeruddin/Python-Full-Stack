import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpclientServiceService } from '../../../httpclient-service.service';
import { MatTabChangeEvent } from '@angular/material';
import { Location } from '@angular/common';
// import { MsgpopupComponent } from './../../msgpopup/msgpopup.component';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HighlightService } from './../../highlight.service';

@Component({
  selector: 'app-createfromqb',
  templateUrl: './createfromqb.component.html',
  styleUrls: ['./createfromqb.component.scss']
})
export class CreatefromqbComponent implements OnInit {
  spinner: boolean;
  index: number;
  show: boolean = false;
  user: any = JSON.parse(localStorage.getItem('login_data'));
  selectedIndex: any = 0;
  assessmentForm: FormGroup;

  constructor(public http: HttpclientServiceService,
    private _location: Location,
    public dialog: MatDialog,
    public assessmentBuilder: FormBuilder,
    public questionBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public highlightService: HighlightService) {

    // For creating ASSESSMENT (tab0).

    this.assessmentForm = assessmentBuilder.group({
      course: ['', [Validators.required]],
      topic: ['', [Validators.required]],
      // type: ['', [Validators.required]],
      // hours: ['', [Validators.required]],
      minutes: ['', [Validators.required]],
      // reviewer: ['', [Validators.required]]
    })
    // Getting all questions from Q.B (tab1)
    this.getQuestionBank();
  }

  assessment_id: string;
  ngOnInit() {
    this.assessment_id = localStorage.getItem("assessmentid");
    if (this.assessment_id != null) {
      this.show = true;
      // Getting all newly added ASSESSMENTS questions
      this.getAssessment();
    }
    else {
      this.getMaterials();
    }

    // Minutes(tab0)
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.minutes.push('0' + i.toString())
      } else {
        this.minutes.push(i.toString())
      }
    }
    // Getting reviewers(tab0) 
  }

  // Getting Materials 
  materials: any;
  getMaterials() {
    this.spinner = true;
    let url = 'get/materials';
    this.http.getMethod(url).subscribe(
      data => {
        this.materials = data;
        console.log(this.materials)
      },
      error => {
        this.spinner = false;
        console.log(error);
      }
    )
  }

  // Getting user selected material 
  material_name: string;
  selectMaterial(e: any) {
    this.material_name = e.value
    this.getChapters(e.value['_id'])
  }

  // For creating ASSESSMENT (tab0) 

  hours: Array<string> = ['00', '01', '02', '03'];
  minutes: Array<any> = [];
  Type: Array<string> = ['MCQ'];

  // Based On user Selected material getting chapters.
  chapters: any;
  getChapters(id) {
    console.log(id)
    this.spinner = true;
    let url = 'get/chapters/' + id;
    this.http.getMethod(url).subscribe(
      data => {
        this.chapters = data['data'];
        // console.log(this.materials)
      },
      error => {
        this.spinner = false;
        console.log(error);
      }
    )
  }
  // user selected chapter
  chapter_name: any;
  selectChapter(e: any) {
    this.chapter_name = e.value
    // this.case = e.value
    // this.submit()
  }

  // Creating Assessment.
  assessment_data: any = {};
  createAssessment() {
    if (this.assessmentForm.valid) {
      var url = 'create/assessment';
      var body = this.assessmentForm.value;
      body['course'] = this.material_name['_id'];
      body['topic'] = this.chapter_name['_id'];
      body['type'] = 'MCQ'
      body = JSON.stringify(body);
      this.http.postMethod(url, body).subscribe(
        data => {
          if (data['flag'] = true) {
            this.assessment_data = data;
            this.show = true;
            localStorage.setItem("assessmentid", this.assessment_data['_id']);
          }
          else {
            this.show = false;
            this.assessment_data = data;
          }
          alert(data['msg']);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  getAssessment() {
    var url = 'assessment_by_id';
    var body = JSON.stringify({ "_id": this.assessment_id })
    this.http.postMethod(url, body).subscribe(
      data => {
        console.log(data)
        this.assessment_data = data;
        this.createassessment = data['questions'];
        this.questionBank1 = new MatTableDataSource(this.createassessment);
        // for(let i of this.questionBank1.data){
        //     console.log(i);
        //     this.questionBank.data.forEach(l)
        //     // console.log( this.questionBank.data.indexOf(i['id']))
        // }
        // this.questionBank
        this.assessmentForm.patchValue({ "course": this.assessment_data['course'] });
        // this.getChapters(this.assessment_data['course']['_id'])
        // this.assessmentForm.patchValue({ "type": this.assessment_data['type'] });
        // this.assessmentForm.patchValue({ "hours": this.assessment_data['hours'] });
        this.assessmentForm.patchValue({ "minutes": this.assessment_data['minutes'] });
        this.assessmentForm.patchValue({ "topic": this.assessment_data['topic'] });
        this.material_name = this.assessment_data['course'];
        this.chapter_name = this.assessment_data['topic'];
        this.materials = [this.assessment_data['course']]
        this.chapters = [this.assessment_data['topic']]
        console.log(this.chapters)
        // this.questions_list.push(null);
        // this.setValuesToForm(this.selected_index);
      },
      error => {
        console.log(error);
      }
    )
  }

  //////////////////// Getting Question Bank ////////////////////////

  displayedColumns: string[] = ['question', 'topic', 'add'];
  questionBank: MatTableDataSource<any>;
  questionPreview: any;
  options_list: any = []
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  getQuestionBank() {
    this.spinner = true;
    var url = 'get/question_bank';
    this.http.getMethod(url).subscribe(
      data => {
        this.spinner = false;
        var assess_list = [];
        for (let i in data) {
          if (this.questionBank1) {
            for (let j of this.questionBank1.data) {
              if (data[i]['_id'] == j['_id']) {
                data[i]['added'] = true;
                break;
              } else {
                data[i]['added'] = false;
              }
            }
          }
          assess_list.push(data[i]);
        }
        console.log(assess_list)
        this.preview(assess_list[0], 0)
        this.questionBank = new MatTableDataSource(assess_list);
        this.questionBank.paginator = this.paginator;
        this.questionBank.sort = this.sort;
      },
      error => {
        this.spinner = false;
        console.log(error);
      }
    );
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.questionBank.filter = filterValue.trim().toLowerCase();
  }

  createassessment: Array<any> = [];

  add(row, i) {
    console.log(row)
    this.selectedIndex = i
    row['added'] = true
    var url = 'insert/assessQuestions';
    if (row['added'] == true) {
      this.createassessment.push(row)
    }
    var body = { "question": row['_id'] };
    body['_id'] = this.assessment_data['_id'];
    var url = 'insert/question_bank_question';
    this.http.postMethod(url, body).subscribe(
      data => {
        console.log("data")
        this.openSnackBar(data['msg'], 'msg')
        // this.getAssessment()
        // this.nextf(this.selected_index)
      },
      error => {
        console.log(error);
      }
    );
  }


  /////////////////// TAB2222 ///////////////////

  displayedColumns1: string[] = ['question', 'topic', 'clear'];
  questionBank1: MatTableDataSource<any>;
  questionPreview1: any;
  options_list1: any = []
  @ViewChild(MatPaginator, { static: true }) paginators: MatPaginator;
  @ViewChild(MatSort, { static: true }) sorts: MatSort;

  getAssessmentData() {
    var assess_list = [];
    // for (let i in data) {
    //   data[i]['added'] = false;
    //   assess_list.push(data[i]);
    // }
    if (this.createassessment.length > 0) {
      this.preview(this.createassessment[0], 0)
    }
    this.questionBank1 = new MatTableDataSource(this.createassessment);
    this.questionBank1.paginator = this.paginators;
    this.questionBank1.sort = this.sorts;
  }

  onLinkClick(event: MatTabChangeEvent) {
    this.index = event.index;
    if (this.index == 1) {
      this.getAssessmentData()
    }
    if (this.index == 0) {
      this.getQuestionBank()
    }
  }

  clear(data, i) {
    var url = 'delete/assessQuestion';
    var body = {
      'question_id': data['_id'],
      'assess_id': this.assessment_data['_id']
    }
    this.http.postMethod(url, body).subscribe(
      data => {
        this.openSnackBar(data['msg'], 'msg')
        this.getAssessment()
      },
      error => {
        console.log(error);
      }
    );
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['red-snackbar'],
    });
  }

  backClicked() {
    this._location.back();
  }

  //// After adding questions he finally submits assessment.
  submitForReview() {
    var url = "update/assessStatus";
    var body = JSON.stringify({ "_id": this.assessment_id, "status": "pending" });
    this.http.postMethod(url, body).subscribe(
      data => {
        this.openSnackBar(data['msg'], 'msg')
        this._location.back();
      },
      error => {

      }
    )
  }

  // Preview of particular question
  color: any
  preview(data, index) {
    this.selectedIndex = index;
    // this.color = "#fdfcee"
    var opt_keys = Object.keys(data['options']);
    var opt_val = Object.values(data['options']);
    this.options_list = []
    for (let i in opt_keys) {
      this.options_list.push([opt_keys[i], opt_val[i]]);
    }
    this.questionPreview = data
  }

  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }

  ngOnDestroy() {
    // localStorage.removeItem('assessmentid');
  }
}
