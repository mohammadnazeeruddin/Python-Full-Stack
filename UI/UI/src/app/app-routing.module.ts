import { FacultyResetPasswordComponent } from './faculty-reset-password/faculty-reset-password.component';
import { FacultyActivationlinkComponent } from './faculty-activationlink/faculty-activationlink.component';
import { FacultyRegistrationComponent } from './faculty-registration/faculty-registration.component';
import { FacultyForgotPasswordComponent } from './faculty-forgot-password/faculty-forgot-password.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ActivatelinkComponent } from './activatelink/activatelink.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { StudentRegisterComponent } from './student-register/student-register.component';
import { MaterialComponent } from './material/material.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { MyReportComponent } from './my-report/my-report.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { TaskMaterialComponent } from './task-material/task-material.component';
// import {FeedbackComponent} from './feedback/feedback.component';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "material/:material_id/:chapter_title/:id/:group_id", component: MaterialComponent },
  { path: "home", component: MyCoursesComponent},
  { path: "home/:group_id", component: MyCoursesComponent},
  { path: "forgotPassword", component: ForgotPasswordComponent },
  { path: "studentRegister", component: StudentRegisterComponent },
  { path: "facultyForgotPassword", component: FacultyForgotPasswordComponent },
  { path: "facultyRegistration", component: FacultyRegistrationComponent },
  { path: "quiz/activate/link/:uid", component: ActivatelinkComponent},
  { path: "faculty/activate_account/:uid", component: FacultyActivationlinkComponent},
  { path: 'forgot/password', component: ForgotPasswordComponent },
  { path: "quiz/reset/password/:uid", component: ResetpasswordComponent },
  { path: "facultyResetPassword/:uid", component: FacultyResetPasswordComponent },
  { path: "mytasks", component: MyTasksComponent },
  { path: "myreport", component: MyReportComponent },
  { path: "admin/login", component: AdminloginComponent },
  { path: "trainer", loadChildren: () => import("./trainer/trainer.module").then(m => m.TrainerModule)},
  { path: "admin", loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: "task_material/:material_id/:chapter_title/:id/:group_id/:task_id", component: TaskMaterialComponent },
  // {path: 'feedback', component: FeedbackComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
