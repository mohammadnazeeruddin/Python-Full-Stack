import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpclientServiceService } from 'src/app/httpclient-service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  spinner: boolean = false;
  
  @ViewChild('paginator', { 'static': true }) paginator: MatPaginator;
  @ViewChild('sort', { 'static': true }) sort: MatSort;

  displayedColumns: string[] = ['id', 'topic', 'tags', 'question_tag', 'edit', 'delete'];
  dataSource: MatTableDataSource<any>;
  list_of_questions: any = [];

  constructor(public http: HttpclientServiceService, private httpClient: HttpClient, public router: Router) { }

  ngOnInit() {
    this.getquestions();
  }

 

  getquestions() {
    this.spinner = true;
    var url = 'get/proQuestions';
    this.http.getMethod(url).subscribe(
      data => {
        this.spinner = false;
        data = data['questions'];
        var questions_list = [];
        for (let i in data) {
          questions_list.push(data[i]);
        }
        this.dataSource = new MatTableDataSource(questions_list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.spinner = false;
        console.log(error);
      }
    );
  }

  deleteProgram(row: any, index: number) {
    console.log(index, row);
    this.spinner = true;
    var url = 'delete/program_by_id';
    var body = { "_id": row['_id'] };
    this.http.postMethod(url, body).subscribe(
      data => {
        alert("deleted successfully...!")
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      },
      error => {
        console.log(error);
      }
    )
  }

  createprogram() {
    this.router.navigate(['/trainer/programs/program_create']);
  }

  editProgram(row: any, index: number) {
    localStorage.setItem("program_id", row['_id']);
    this.router.navigate(['/trainer/programs/program_edit', row['_id']]);

  }
}
