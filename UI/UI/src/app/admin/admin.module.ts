import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminTrainersComponent } from './admin-trainers/admin-trainers.component';
import { AdminAccessComponent } from './admin-access/admin-access.component';
import { SharedModule } from '../shared/shared.module';
import { AdminStudentsComponent } from './admin-students/admin-students.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { PopupComponent } from './popup/popup.component';


@NgModule({
  declarations: [AdminComponent, AdminCoursesComponent, AdminTrainersComponent, AdminAccessComponent, AdminStudentsComponent, InstitutionsComponent, PopupComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ],
  entryComponents: [
    PopupComponent
  ],
})
export class AdminModule { }
