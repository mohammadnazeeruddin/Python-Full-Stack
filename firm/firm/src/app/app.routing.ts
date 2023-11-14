import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ListOfCompanyComponent } from './list-of-company/list-of-company.component';
import { CompanyRegistrationComponent } from './company-registration/company-registration.component';
import { NewFirmRegistrationComponent } from './new-firm-registration/new-firm-registration.component';


const routes: Routes = [
 { path: '', redirectTo: 'component-one', pathMatch: 'full' },
  { path: 'component-one', component: LoginComponent },
  { path: 'app-company-registration', component: CompanyRegistrationComponent },
  { path: 'app-company-registration/app-list-of-company', component: ListOfCompanyComponent },
  { path: 'app-company-registration/app-new-firm-registration', component: NewFirmRegistrationComponent },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule { }
