import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isExpanded:boolean;
  user = JSON.parse(localStorage.getItem("login_data"));

  constructor(public router:Router) {
   }

  signout() {
    localStorage.clear();
    this.router.navigate(['admin/login']);
  }

  ngOnInit() {
  }

}
