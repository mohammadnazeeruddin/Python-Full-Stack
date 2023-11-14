import { TrainerComponent } from './trainer.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialComponent } from './material/material.component';

const routes: Routes = [
  {
    path: "",
    component: TrainerComponent,
    children: [
      { path: "material/:material_id/:chapter_title/:id/:group_id", component: MaterialComponent },
      { path: "programs", loadChildren: () => import('./programs/programs.module').then(m => m.ProgramsModule) },
      {
        path: "groups",
        loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
      },
      { path: "assessments", loadChildren: () => import('./assessments/assessments.module').then(m => m.AssessmentsModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainerRoutingModule { }
