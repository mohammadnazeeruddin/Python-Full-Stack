import { ConductComponent } from './conduct/conduct.component';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { AssessmentsComponent } from './assessments.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatefromqbComponent } from './createfromqb/createfromqb.component';

const routes: Routes = [
  { path: '', component: AssessmentsComponent },
  { path: 'create', component: CreateComponent},
  { path: 'edit', component: EditComponent},
  { path: 'conduct', component: ConductComponent},
  {path:'create_from_qb', component: CreatefromqbComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentsRoutingModule { }
