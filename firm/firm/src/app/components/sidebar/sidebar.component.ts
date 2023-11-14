import { Component, OnInit } from '@angular/core';
import { CompanyRegistrationComponent } from 'app/company-registration/company-registration.component';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'app-new-firm-registration', title: 'NewRegistration',  icon: 'dashboard', class: '' },
    { path: 'app-list-of-company', title: 'All Customers',  icon: 'dashboard', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    console.log(this.menuItems);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
