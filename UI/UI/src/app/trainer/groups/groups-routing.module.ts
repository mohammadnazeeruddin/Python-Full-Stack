import { CreateComponent } from './create/create.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { AssessmentresultComponent } from '../groups/assessmentresult/assessmentresult.component';

const routes: Routes = [
  {path: '', component: GroupsComponent},
  {path: 'create', component: CreateComponent},
  { path: 'assessmentresult/:name/:email', component: AssessmentresultComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
