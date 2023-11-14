import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminTrainersComponent } from './admin-trainers/admin-trainers.component';
import { AdminAccessComponent } from './admin-access/admin-access.component';
import { InstitutionsComponent } from './institutions/institutions.component';


const routes: Routes = [
  
  {path:'',component:AdminComponent,children:
  [
    // {path:'',redirectTo:'institutions',pathMatch:'full'},
    {path: 'institutions', component:InstitutionsComponent},
    {path:'courses',component:AdminCoursesComponent},
    {path:'trainers',component:AdminTrainersComponent},
    {path:'access',component:AdminAccessComponent},
 
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
