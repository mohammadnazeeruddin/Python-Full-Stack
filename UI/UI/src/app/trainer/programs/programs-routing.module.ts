import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramsCreateComponent } from './programs-create/programs-create.component';
import { ProgramsEditComponent } from './programs-edit/programs-edit.component';
import { ProgramsComponent } from './programs.component';

const routes: Routes = [
  { path: '', component: ProgramsComponent},
  { path: 'program_create', component: ProgramsCreateComponent},
  { path: 'program_edit/:id', component: ProgramsEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramsRoutingModule { }
