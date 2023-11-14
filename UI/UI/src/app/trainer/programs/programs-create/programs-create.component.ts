import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HighlightService } from './../../highlight.service';
import { HttpclientServiceService } from './../../../httpclient-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

function readBase64(file): Promise<any> {
  var reader = new FileReader();
  var future = new Promise((resolve, reject) => {
    reader.addEventListener("load", function () {
      resolve(reader.result);
    }, false);

    reader.addEventListener("error", function (event) {
      reject(event);
    }, false);
    reader.readAsDataURL(file);
  });
  return future;
}
@Component({
  selector: 'app-programs-create',
  templateUrl: './programs-create.component.html',
  styleUrls: ['./programs-create.component.scss']
})
export class ProgramsCreateComponent implements OnInit {
  code_test_id: any = null;
  tags: Array<string> = ['Easy', 'Medium', 'Hard'];

  @ViewChild("ifrm", { static: false }) iframe: ElementRef;

  assessmentForm: FormGroup;
  questionForm: FormGroup;
  codeFlag: boolean = false;
  assessment_data: any = {};
  questions_data: any;
  selected_index: number = 0;
  reviewers = [];
  user: any = JSON.parse(localStorage.getItem('login_data'));
  selected_reviewer: any;

  constructor(public assessmentBuilder: FormBuilder, public questionBuilder: FormBuilder, public http: HttpclientServiceService,
    public highlightService: HighlightService, public router: Router) {

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
    this.code_and_save();
  }

  setValuesToForm(index: number) {
    this.questionForm.patchValue({ "question": this.questions_data['question'] });
    this.questionForm.patchValue({ "code": this.questions_data['code'] });
    this.questionForm.patchValue({ "answer": this.questions_data['answer'] });
    this.questionForm.patchValue({ "question_tag": this.questions_data['question_tag'] });
    this.questionForm.patchValue({ "tags": this.questions_data['tags'] });
    this.questionForm.patchValue({ "topic": this.questions_data['topic'] });
  }

  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }

  ngOnDestroy() {
    localStorage.removeItem("program_id")
  }

  alert_popup() {
    document.getElementById('alert').style.display = 'block';
    setTimeout(function () {
      document.getElementById('alert').style.display = 'none';
    }, 3000);
  }

  code_error() {
    document.getElementById('error').style.display = 'block';
    setTimeout(function () {
      document.getElementById('error').style.display = 'none';
    }, 4000);
  }

  postQuestion() {
    if (this.questionForm.valid) {
      var url = 'insert/proQuestions';
      var body = this.questionForm.value;

      if (this.code_test_id != null) {
        body['_id'] = this.code_test_id;
      } else {
        console.log(this.code_test_id)
      }
      var url = 'insert/proQuestions';
      var body = this.questionForm.value;
      this.http.postMethod(url, body).subscribe(
        data => {
          this.alert_popup();
          document.getElementById("alert").innerHTML = "Code Test Saved!";
          this.questions_data = body;
          this.code_test_id = data['_id']

          localStorage.setItem("program_id", this.code_test_id)
          var iframe = this.iframe.nativeElement.contentWindow.location.reload(true);
          iframe.src = iframe.src;
          // this.questionForm.reset();
        },
        error => {
          console.log(error);
          this.code_error();
          document.getElementById("error").innerHTML = "Error:Syntax or Indentation error occurred in your code blog..!";
        }
      )
    }
  }
  code_and_save() {
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
