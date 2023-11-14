import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpclientServiceService } from 'src/app/httpclient-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HighlightService } from '../../highlight.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programs-edit',
  templateUrl: './programs-edit.component.html',
  styleUrls: ['./programs-edit.component.scss']
})
export class ProgramsEditComponent implements OnInit {
  @ViewChild('myDiv', { static: false }) myDiv: ElementRef;
  @ViewChild("ifrm", { static: false }) iframe: ElementRef;

  question_id: string;
  questions_data: any;
  questionForm: FormGroup;
  tags: Array<string> = ['Easy', 'Medium', 'Hard'];
  ids: any[] = [];
  list_of_questions: any = []
  data: any;

  isShown: boolean = false;


  constructor(public route: ActivatedRoute, private httpClient: HttpClient, public router: Router, private _location: Location, public http: HttpclientServiceService, public questionBuilder: FormBuilder, public highlightService: HighlightService) {
    this.route.params.subscribe(data => {
      this.question_id = data['id'];
      if (this.question_id != null) {
        this.get_proQuestion();
      }
    })

    this.questionForm = questionBuilder.group({
      question: [null, [Validators.required]],
      code: [null, [Validators.required]],
      topic: [null, [Validators.required]],
      answer: [null, [Validators.required]],
      question_tag: [null, [Validators.required]],
      tags: [null, [Validators.required]],
    })
  }

  ngOnInit() {
    this.ctrl_and_save();
  }

  alert_popup() {
    document.getElementById('alert').style.display = 'block';

    setTimeout(function () {
      document.getElementById('alert').style.display = 'none';
      document.getElementById('error').style.display = 'none';
    }, 3000);
  }
  code_error() {
    document.getElementById('error').style.display = 'block';
    setTimeout(function () {
      document.getElementById('error').style.display = 'none';
    }, 4000);
  }
  get_proQuestion() {
    var url = 'get/proQuestion_by_id';
    var body = JSON.stringify({ "_id": this.question_id })
    this.http.postMethod(url, body).subscribe(
      data => {
        this.questions_data = data;
        this.setValuesToForm();
      },
      error => {
        console.log(error);
      }
    )
  }

  setValuesToForm() {
    this.questionForm.patchValue({ "question": this.questions_data['question'] });
    this.questionForm.patchValue({ "code": this.questions_data['code'] });
    this.questionForm.patchValue({ "answer": this.questions_data['answer'] });
    this.questionForm.patchValue({ "question_tag": this.questions_data['question_tag'] });
    this.questionForm.patchValue({ "tags": this.questions_data['tags'] });
    this.questionForm.patchValue({ "topic": this.questions_data['topic'] });
  }

  ngAfterViewChecked() {
    this.highlightService.highlightAll();
    this.get_proQuestion_()
  }

  updateQuestion() {
    var url = 'update/proQuestions';
    var body = this.questionForm.value;
    body['_id'] = this.question_id;
    body = JSON.stringify(body);
    this.http.postMethod(url, body).subscribe(
      data => {
        this.alert_popup();
        document.getElementById("alert").innerHTML = "Changes Saved!";
        var iframe = this.iframe.nativeElement.contentWindow.location.reload(true);
        iframe.src = iframe.src;
      },
      error => {
        console.log(error);
        this.code_error();
        document.getElementById("error").innerHTML = "Error:Syntax or Indentation error occurred in your code blog..!";
      }
    )
  }
  ngOnDestroy() {
    localStorage.removeItem("program_id")
  }
  backClicked() {
    this._location.back();
  }


  get_proQuestion_() {
    var url = environment.server_url + "get/proQuestions"
    this.httpClient.get(url).subscribe(
      (data) => {
        this.list_of_questions = data['questions'];
      });
  }


  ctrl_and_save() {

    // this method is to save code_test by using ctrl+s keys.
    document.onkeydown = function (event) {
      event || window.event;
      if (event.ctrlKey) {
        var c = event.which || event.keyCode;
        switch (c) {
          case 83:
            event.preventDefault();
            document.getElementById("button").click();

            break;

        }
      }
    };
  }

}
