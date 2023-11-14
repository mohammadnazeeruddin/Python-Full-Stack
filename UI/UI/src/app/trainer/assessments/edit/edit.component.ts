import { Router } from '@angular/router';
import { HighlightService } from './../../highlight.service';
import { HttpclientServiceService } from './../../../httpclient-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  durationInSeconds = 1;
  hours: Array<string> = ['00', '01', '02', '03'];
  minutes: Array<any> = [];
  Type: Array<string> = ['MCQ', 'QA', 'PROGRAM', 'STRATEGY'];
  select_courses: Array<string> = ['Python', 'Data Science', 'AWS'];
  select_languages: Array<string> = ['abap', 'actionscript', 'ada', 'apacheconf', 'apl',
    'applescript', 'arduino', 'arff', 'asciidoc', 'asm6502', 'aspnet', 'autohotkey',
    'autoit', 'bash', 'basic', 'batch', 'bison', 'brainfuck', 'bro', 'c', 'clike', 'clojure',
    'coffeescript', 'cpp', 'crystal', 'csharp', 'csp', 'css', 'css-extras', 'd', 'dart',
    'diff', 'django', 'docker', 'eiffel', 'elixir', 'elm', 'erb', 'erlang', 'flow', 'fortran',
    'fsharp', 'gedcom', 'gherkin', 'git', 'glsl', 'gml', 'go', 'graphql', 'groovy', 'haml',
    'handlebars', 'haskell', 'haxe', 'hpkp', 'hsts', 'http', 'ichigojam', 'icon',
    'inform7', 'ini', 'io', 'j', 'java', 'javascript', 'jolie', 'json', 'jsx',
    'julia', 'keyman', 'kotlin', 'latex', 'less', 'liquid', 'lisp', 'livescript',
    'lolcode', 'lua', 'makefile', 'markdown', 'markup', 'markup-templating',
    'matlab', 'mel', 'mizar', 'monkey', 'n4js', 'nasm', 'nginx', 'nim', 'nix',
    'nsis', 'objectivec', 'ocaml', 'opencl', 'output >>', 'oz', 'python', 'parigp', 'parser', 'pascal',
    'perl', 'php', 'php-extras', 'plsql', 'powershell', 'processing', 'prolog',
    'properties', 'protobuf', 'pug', 'puppet', 'pure', 'q', 'qore', 'r',
    'reason', 'renpy', 'rest', 'rip', 'roboconf', 'ruby', 'rust', 'sas', 'sass', 'scala',
    'scheme', 'scss', 'smalltalk', 'smarty', 'soy', 'sql', 'stylus', 'swift', 'tap', 'tcl',
    'textile', 'tsx', 'tt2', 'twig', 'typescript', 'vbnet', 'velocity', 'verilog', 'vhdl',
    'vim', 'visual-basic', 'wasm', 'wiki', 'xeora', 'xojo', 'xquery', 'yaml'
  ];
  assessmentForm: FormGroup;
  questionForm: FormGroup;
  codeFlag: boolean = false;
  options_list: Array<any> = [];
  opkeys: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F'];
  assessment_data: any = {};
  assessment_id: string;
  questions_list: Array<any> = [null];
  selected_index: number = 0;
  assessment_flag: boolean = false;
  reviewers = [];
  user: any = JSON.parse(localStorage.getItem('login_data'));
  selected_reviewer: any = [];
  reviewer_ids: any = [];

  constructor(public assessmentBuilder: FormBuilder, public questionBuilder: FormBuilder, public http: HttpclientServiceService,
    public highlightService: HighlightService, public router: Router,private _snackBar: MatSnackBar) {
    this.assessmentForm = assessmentBuilder.group({
      course: ['', [Validators.required]],
      topics: ['', [Validators.required]],
      type: ['', [Validators.required]],
      hours: ['', [Validators.required]],
      minutes: ['', [Validators.required]],
      reviewer: ['', [Validators.required]]
    })

    this.questionForm = questionBuilder.group({
      question: ['', [Validators.required]],
      code: [null],
      // options: ['', [Validators.required]],
      answer: [null, [Validators.required]],
      explanation: [null, [Validators.nullValidator]],
    })
  }

  ngOnInit() {
    this.ctrl_and_save()
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.minutes.push('0' + i.toString())
      } else {
        this.minutes.push(i.toString())
      }
    }
    this.assessment_id = localStorage.getItem("assessment_edit_id");
    if (this.assessment_id != null) {
      this.assessment_flag = true;
      this.getAssessment();
    } else {
      this.assessment_flag = false;
    }
    this.getReviewers();
  }

  getReviewers(){
    var url = "get/authors/data/by_role";
    this.http.getMethod(url).subscribe( 
      data => {
        for (const i in data) {
          if (this.user['_id'].toLowerCase() === data[i]['_id'].toLowerCase()) {
            continue;
          } else {
            this.reviewers.push(data[i]);
          }
        }
      }, error => {
        console.log(error);
      }
    );
  }

  selectReviewer(event: any) {
    var reviewers = [];
    for ( let i in event.value){
      reviewers.push(event.value[i]['_id']);
    }
    this.selected_reviewer = reviewers;
  }

  clear(pos: number) {
    this.options_list.splice(pos, 1);
    for (let i in this.options_list) {
      this.options_list[i][0] = this.opkeys[i];
    }
  }

  addConfigBlock() {
    if (this.options_list.length < 6) {
      this.options_list.push([null, null])
      for (let i in this.options_list) {
        this.options_list[i][0] = this.opkeys[i];
      }
    }
  }

  getAssessment() {
    var url = 'assessment_by_id';
    var body = JSON.stringify({ "_id": this.assessment_id })
    this.http.postMethod(url, body).subscribe(
      data => {
        console.log(data)
        this.assessment_data = data;
        this.questions_list = data['questions'];
        this.assessmentForm.patchValue({ "course": this.assessment_data['course'] });
        this.assessmentForm.patchValue({ "type": this.assessment_data['type'] });
        this.assessmentForm.patchValue({ "hours": this.assessment_data['hours'] });
        this.assessmentForm.patchValue({ "minutes": this.assessment_data['minutes'] });
        this.assessmentForm.patchValue({ "topics": this.assessment_data['topics'] });
        this.assessmentForm.patchValue({ "reviewer": this.assessment_data['reviewer'] });
        this.questions_list.push(null);
        for( let i in this.assessment_data['reviewer']){
          this.reviewer_ids.push(this.assessment_data['reviewer'][i]['_id']);
        }
        // this.selected_reviewer = this.assessment_data['reviewer'];
        this.setValuesToForm(this.selected_index);
      },
      error => {
        console.log(error);
      }
    )
  }

  setValuesToForm(index: number) {
    this.options_list = [];
    if (this.questions_list.length > 0) {
      if (this.questions_list[index] != null) {
        this.questionForm.patchValue({ "question": this.questions_list[index]['question'] });
        this.questionForm.patchValue({ "code": this.questions_list[index]['code'] });
        this.questionForm.patchValue({ "answer": this.questions_list[index]['answer'] });
        this.questionForm.patchValue({ "explanation": this.questions_list[index]['explanation'] });

        var opt_keys = Object.keys(this.questions_list[index]['options']);
        var opt_val = Object.values(this.questions_list[index]['options']);

        for (let i in opt_keys) {
          this.options_list.push([opt_keys[i], opt_val[i]]);
        }
      }
      else {
        this.questionForm.reset();
      }
    }
  }

  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }

  updateAssessment() {
    if (this.assessmentForm.valid) {
      var url = 'update/assesDetails';
      var body =  this.assessmentForm.value;
      if (this.selected_reviewer.length > 0){
        body['reviewer'] = this.selected_reviewer;
      } else {
        for (let i in this.assessment_data['reviewer']){
          this.selected_reviewer.push(this.assessment_data['reviewer'][i]['_id']);
        }
      }
      body['_id'] = this.assessment_id;
      body = JSON.stringify(body);
      this.http.postMethod(url, body).subscribe(
        data => {
          this.assessment_data = data;
          localStorage.setItem("assessment_edit_id", this.assessment_data['_id']);
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  reset() {
    localStorage.removeItem('assessment_edit_id');
  }

  selectFile(event: any) {
    this.assessment_data['image'] = event.target.files[0];
    this.readURL(event.target);
  }

  readURL(input) {
    if (input.files && input.files[0]) {
      readBase64(input.files[0]).then((data: any) => {
        var img_data = data;
        data = data.split(";");
        let data_type = data[0];
        try {
          this.assessment_data['file_type'] = '.' + data_type.split('/')[1];
        }
        catch{
          this.assessment_data['file_type'] = '.' + data_type.split('/')[0];
        }
        this.assessment_data['image'] = img_data;
      })
    }
  }

  postQuestion() {
    let options = {};
    for (let i in this.options_list) {
      options[this.options_list[i][0]] = this.options_list[i][1]
    }
    if (this.questionForm.valid) {
      console.log(this.questions_list[this.selected_index])
      if (this.questions_list[this.selected_index] == null) {
        var url = 'insert/assessQuestions';
        var body = { "question": this.questionForm.value };
        body['question']['options'] = options;
        body['_id'] = this.assessment_data['_id'];
        this.http.postMethod(url, body).subscribe(
          data => {
            this.openSnackBar(data['msg'])
            this.questions_list[this.selected_index] = body['question'];
            this.questionForm.reset();
            this.options_list = [];
            this.questions_list.push(null);
            this.selected_index = this.questions_list.length - 1;
          },
          error => {
            console.log(error);
          }
        )
      } else {
        console.log(this.questions_list[this.selected_index])
        var url = 'update/assessQuestion';
        var body = { "question": this.questionForm.value };
        body['question']['options'] = options;
        body['question']['_id'] = this.questions_list[this.selected_index]['_id'];
        body['question_id'] = this.questions_list[this.selected_index]['_id'];
        body['assess_id'] = this.assessment_data['_id'];
        console.log(body['question_id'])
        this.http.postMethod(url, body).subscribe(
          data => {
            this.openSnackBar(data['msg'])
            this.getAssessment()
            this.nextf(this.selected_index)
            // this.selected_index = this.selected_index+1;

          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }
  alert_popup() {
    document.getElementById('alert').style.display = 'block';
    setTimeout(function () {
      document.getElementById('alert').style.display = 'none';
    }, 2000);
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
  markAsreviewed() {
    var url = "update/assessStatus";
    var body = JSON.stringify({"_id": this.assessment_id, "status": "reviewed"});
    this.http.postMethod(url, body).subscribe(
      data => {
        this.router.navigate(['home/assessments'])
      },
      error => {

      }
    )
  }

  nextf(i) {
    if (this.questions_list.length === i) {
      this.selected_index = i;
    } else {
      this.setValuesToForm(this.selected_index + 1);
      this.selected_index += 1;
    }
  }

  backf(i) {
    if (i > 0) {
      this.setValuesToForm(this.selected_index - 1);
      this.selected_index -= 1;
    } else {
      this.selected_index = i;
    }
  }
  deleteQuestion(i) {
    var url = 'delete/assessQuestion';
    var body = {
      'question_id': this.questions_list[i]['_id'],
      'assess_id': this.assessment_data['_id']
    }
    this.http.postMethod(url, body).subscribe(
      data => {
        this.openSnackBar(data['msg'])
        this.getAssessment()
      },
      error => {
        console.log(error);
      }
    );
  }
  ngOnDestroy() {
    console.log('destroyed');
    // localStorage.removeItem('assessment_edit_id');
  }
  openSnackBar(message: string) {
    this._snackBar.openFromComponent(PizzaParty1Component, {
      duration: this.durationInSeconds * 1000,
      data: message
    });
  }

}
@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [`
    .example-pizza-party {
      color: #fff;
    }
  `],
})
export class PizzaParty1Component {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}