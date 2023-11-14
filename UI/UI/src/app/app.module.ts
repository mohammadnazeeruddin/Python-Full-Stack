import { TaskTreeViewComponent } from './task-tree-view/task-tree-view.component';
import { MyOpentasksComponent } from './my-opentasks/my-opentasks.component';
import { MyCompletedTasksComponent } from './my-completed-tasks/my-completed-tasks.component';
import { MyReportComponent } from './my-report/my-report.component';
import { TreepopupComponent } from './treepopup/treepopup.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ActivatelinkComponent } from './activatelink/activatelink.component';
import { PopupComponent } from './popup/popup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HighlightService } from './shared/highlight.service';
import { ChallengePopupComponent } from './challenge-popup/challenge-popup.component';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentLoginComponent } from './student-login/student-login.component';
import { FacultyLoginComponent } from './faculty-login/faculty-login.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MaterialComponent } from './material/material.component';
import { StudentRegisterComponent } from './student-register/student-register.component';
import { HeaderComponent } from './header/header.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FacultyRegistrationComponent } from './faculty-registration/faculty-registration.component';
import { FacultyForgotPasswordComponent } from './faculty-forgot-password/faculty-forgot-password.component';
import { FacultyResetPasswordComponent } from './faculty-reset-password/faculty-reset-password.component';
import { FacultyActivationlinkComponent } from './faculty-activationlink/faculty-activationlink.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { TaskMaterialComponent } from './task-material/task-material.component';
import {FeedbackComponent} from './feedback/feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentLoginComponent,
    FacultyLoginComponent,
    HomeComponent,
    LoginComponent,
    MaterialComponent,
    StudentRegisterComponent,
    ChallengePopupComponent,
    ForgotPasswordComponent,
    PopupComponent,
    ActivatelinkComponent,
    ForgotPasswordComponent,
    ResetpasswordComponent,
    MyCoursesComponent,
    HeaderComponent,
    TreepopupComponent,
    MyTasksComponent,
    MyReportComponent,
    MyCompletedTasksComponent,
    MyOpentasksComponent,
    TaskTreeViewComponent,
    FacultyRegistrationComponent,
    FacultyForgotPasswordComponent,
    FacultyResetPasswordComponent,
    FacultyActivationlinkComponent,
    AdminloginComponent,
    TaskMaterialComponent,
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgApexchartsModule
  ],
  providers: [HighlightService],
  bootstrap: [AppComponent],
  entryComponents: [ChallengePopupComponent, PopupComponent, TreepopupComponent,FeedbackComponent]
})
export class AppModule { }
