import { Router } from '@angular/router';
import { HighlightService } from './../../highlight.service';
import { HttpclientServiceService } from './../../../httpclient-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// import { MsgpopupComponent } from '../../msgpopup/msgpopup.component';

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
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  hours: Array<string> = ['00', '01', '02', '03'];
  minutes: Array<any> = [];
  weightage: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  Type: Array<string> = ['MCQ', 'QA', 'PROGRAM', 'STRATEGY'];
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
  reviewers = [];
  user: any = JSON.parse(localStorage.getItem('login_data'));
  selected_reviewer: any;
  durationInSeconds = 1;
  show: boolean = false;
  constructor(public assessmentBuilder: FormBuilder, public questionBuilder: FormBuilder, public http1: HttpclientServiceService,
    public http: HttpClient,public highlightService: HighlightService, public router: Router, private _snackBar: MatSnackBar, private _location: Location,
    public dialog: MatDialog) {
    this.assessmentForm = assessmentBuilder.group({
      assessment_name: ['', [Validators.required]],
      duration: ['', [Validators.required]],
    })

    this.questionForm = questionBuilder.group({
      question: ['', [Validators.required]],
      code: [null],
      course: ['', [Validators.required]],
      topic: ['', [Validators.required]],
      // options: ['', [Validators.required]],
      weightage: [null, [Validators.required]],
      answer: [null, [Validators.required]],
      explanation: [null, [Validators.nullValidator]],
    })
  }

  ngOnInit() {

    this.ctrl_and_save()
    //minutes
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.minutes.push('0' + i.toString())
      } else {
        this.minutes.push(i.toString())
      }
    }
    this.assessment_id = localStorage.getItem("assessment_id");
    console.log(this.assessment_id)
    if (this.assessment_id != null) {
      this.getAssessment();
    // } else {
    }
    this.getMaterials();

  }

  // code
  update_code(event) {
    if (document.getElementById("code_blog")) {
      document.getElementById("code_blog").innerText = event.replace(/\n/g, "<br/>");
    }
  }

  materials: any;
  // getting courses
  select_courses: any;

  //materials
  getMaterials() {
    let url = 'get/materials';
    this.http1.getMethod(url).subscribe(
      data => {
        this.select_courses = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  // Getting user selected material 
  material_name: string;

  // user selected material
  selectMaterial(e: any) {
    // console.log(e.value)
    this.material_name = e.value
    this.chapter_name = ''
    // console.log(this.chapter_name)
    this.getChapters(e.value['_id'])
  }

  // getting chapters
  chapters: any;
  getChapters(id) {
    // console.log(id)
    let url = 'get/chapters/' + id;
    this.http1.getMethod(url).subscribe(
      data => {
        // console.log(data)
        this.chapters = data['data'];
        // console.log(this.materials)
      },
      error => {
        console.log(error);
      }
    )
  }

  // user selected chapter
  chapter_name: any = '';
  selectChapter(e: any) {
    // console.log(e)
    this.chapter_name = e.value
  }

  // when click on add option this func is called, a block with option and text area will appeared
  addConfigBlock() {
    // console.log(this.options_list)
    if (this.options_list.length < 6) {
      this.options_list.push([null, null])
      for (let i in this.options_list) {
        // console.log(this.opkeys[i])
        this.options_list[i][0] = this.opkeys[i];
      }
    }
    // console.log(this.options_list)
  }

  alert_popup() {
    document.getElementById('alert').style.display = 'block';
    setTimeout(function () {
      document.getElementById('alert').style.display = 'none';
    }, 2000);
  }

  // saving a question
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

  // get creted assesssment
  getAssessment() {
    var access_token_cookie = localStorage.getItem("access_token_cookie");
      const httpOptions = {
        headers: new HttpHeaders({
          'content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'authorization': 'Bearer ' + access_token_cookie
        })
      }
      // var url = environment.server_url + "create/assessment";
      // this.http.post(url, this.assessmentForm.value, httpOptions).subscribe(
      //   data => {
    var url =environment.server_url +  'assessment_by_id';
    var body = JSON.stringify({ "_id": this.assessment_id })
    this.http.post(url, body, httpOptions).subscribe(
      data => {
        console.log(data)
        this.assessment_data = data;
        // console.log(data['questions'])
        this.questions_list = data['questions'];
        // console.log(this.questions_list)
        this.assessmentForm.patchValue({ "assessment_name": this.assessment_data['assessment_name'] });
        // this.assessmentForm.patchValue({ "type": this.assessment_data['type'] });
        this.assessmentForm.patchValue({ "duration": this.assessment_data['duration'] });
        // this.assessmentForm.patchValue({ "topic": this.assessment_data['topic'] });
        // this.material_name = this.assessment_data['course'];
        // this.chapter_name = this.assessment_data['topic'];
        // console.log(this.assessmentForm.value)
        this.questions_list.push(null);
        this.setValuesToForm(this.selected_index);
        this.show = true;
        // this.select_courses = [this.assessment_data['course']]
        // this.chapters = [this.assessment_data['topic']]
      }, error => {
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
        this.questionForm.patchValue({ "weightage": this.questions_list[index]['weightage'] });
        this.questionForm.patchValue({ "answer": this.questions_list[index]['answer'] });
        this.questionForm.patchValue({ "course": this.questions_list[index]['course']['material_name'] });
        this.questionForm.patchValue({ "topic": this.questions_list[index]['topic']['chapter_name'] });
        this.questionForm.patchValue({ "explanation": this.questions_list[index]['explanation'] });

        var opt_keys = Object.keys(this.questions_list[index]['options']);
        var opt_val = Object.values(this.questions_list[index]['options']);

        for (let i in opt_keys) {
          this.options_list.push([opt_keys[i], opt_val[i]]);
        }
        console.log(this.questionForm.value)
      }
      else {
        this.questionForm.reset();
      }
    }
  }

  ngAfterViewChecked() {
    this.highlightService.highlightAll();
  }

  createAssessment($ev, value: any) {
      $ev.preventDefault();
      // tslint:disable-next-line:forin

      // tslint:disable-next-line:forin
      for (let c in this.assessmentForm.controls) {
        this.assessmentForm.controls[c].markAsTouched();
      }
      console.log(this.assessmentForm.value)
    if (this.assessmentForm.valid) {
      console.log(this.assessmentForm.value)
      var access_token_cookie = localStorage.getItem("access_token_cookie");
      const httpOptions = {
        headers: new HttpHeaders({
          'content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'authorization': 'Bearer ' + access_token_cookie
        })
      }
      var url = environment.server_url + "create/assessment";
      this.http.post(url, this.assessmentForm.value, httpOptions).subscribe(
        data => {
          console.log(data)
          if (data['flag'] = true) {
            this.assessment_data = data;
            this.show = true;
            localStorage.setItem("assessment_id", this.assessment_data['_id']);
          }
          else {
            this.show = false;
            this.assessment_data = data;
          }
          alert(data['msg']);
          // console.log(data)

        },
        error => {
          console.log(error);
        }
      )
    }
  }

  reset() {
    localStorage.removeItem('assessment_id');
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
 
  postQuestion($ev, value: any) {
    $ev.preventDefault();
    let options = {};
    for (let i in this.options_list) {
      options[this.options_list[i][0]] = this.options_list[i][1]
    }
    for (let c in this.questionForm.controls) {
      this.questionForm.controls[c].markAsTouched();
    }
    console.log(this.questionForm.value)
    if (this.questionForm.valid) {
      var access_token_cookie = localStorage.getItem("access_token_cookie");
      const httpOptions = {
        headers: new HttpHeaders({
          'content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'authorization': 'Bearer ' + access_token_cookie
        })
      }
      if (this.questions_list[this.selected_index] == null) {
      var url = environment.server_url+'insert/assessQuestions';
      // this.http.post(url, this.assessmentForm.value, httpOptions).subscribe(
      //   data => {
        var body = { "question": this.questionForm.value };
        body['question']['options'] = options;
        body['_id'] = this.assessment_data['_id'];
        // body['course'] = this.material_name['_id'];
        // body['topic'] = this.chapter_name['_id']
        console.log(body)
        this.http.post(url, JSON.stringify(body), httpOptions).subscribe(
          data => {
            console.log(data)
            this.openSnackBar(data['msg'])
            body['question']['_id'] = data['_id']
            console.log(this.questions_list, body['question'], this.questions_list[this.selected_index])
            this.questions_list[this.selected_index] = body['question'];
            console.log(this.questions_list, body['question'], this.questions_list[this.selected_index])
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
        var url = environment.server_url+'update/assessQuestion';
        // console.log(this.questions_list,this.selected_index,  this.questions_list[this.selected_index])
        // console.log(this.questionForm.value, this.assessment_data['_id'], options, this.selected_index, this.questions_list)
        var body = { "question": this.questionForm.value };
        body['question']['options'] = options;
        body['question']['_id'] = this.questions_list[this.selected_index]['_id'];
        body['question_id'] = this.questions_list[this.selected_index]['_id'];
        body['assess_id'] = this.assessment_data['_id'];
        console.log(body)
        this.http.post(url, body, httpOptions).subscribe(
          data => {
            this.openSnackBar(data['msg'])
            this.getAssessment()
            this.nextf(this.selected_index)
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  submitForReview() {
    var access_token_cookie = localStorage.getItem("access_token_cookie");
      const httpOptions = {
        headers: new HttpHeaders({
          'content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'authorization': 'Bearer ' + access_token_cookie
        })
      }
      // if (this.questions_list[this.selected_index] == null) {
      var url = environment.server_url+'update/assessStatus';
    // var url = "update/assessStatus";
    var body = JSON.stringify({ "_id": this.assessment_id, "status": "reviewed" });
    this.http.post(url, body, httpOptions).subscribe(
      data => {
        // console.log(data)
        this.openSnackBar(data['msg'])
        this.router.navigate(['trainer/assessments'])
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



  // deleteQuestion(i) {

  //   const dialogRef = this.dialog.open(MsgpopupComponent, {
  //     width: '400px',
  //     data: { type: 'delete' }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     if (result == true) {
  //       var url = 'delete/assessQuestion';
  //       var body = {
  //         'question_id': this.questions_list[i]['_id'],
  //         'assess_id': this.assessment_data['_id']
  //       }
  //       this.http.postMethod(url, body).subscribe(
  //         data => {
  //           this.openSnackBar(data['msg'])
  //           this.getAssessment()
  //         },
  //         error => {
  //           console.log(error);
  //         }
  //       );
  //     }
  //   });
  // }
  ngOnDestroy() {
    localStorage.removeItem('assessment_id');
  }

  openSnackBar(message: string) {
    // console.log(message)
    this._snackBar.openFromComponent(PizzaPartyComponent, {
      duration: this.durationInSeconds * 1000,
      data: message
    });
  }

  clear(pos: number) {
    // console.log(pos)
    this.options_list.splice(pos, 1);
    for (let i in this.options_list) {
      this.options_list[i][0] = this.opkeys[i];
    }
  }

  clearCode(pos: number) {
    this.codeFlag = false;
  }

  back() {
    this._location.back();
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
export class PizzaPartyComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}