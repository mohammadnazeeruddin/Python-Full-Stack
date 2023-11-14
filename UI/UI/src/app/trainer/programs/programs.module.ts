import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramsRoutingModule } from './programs-routing.module';
import { ProgramsEditComponent } from './programs-edit/programs-edit.component';
import { ProgramsCreateComponent } from './programs-create/programs-create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProgramsComponent } from './programs.component';
import { HighlightService } from '../highlight.service';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [ ProgramsEditComponent,ProgramsCreateComponent, ProgramsComponent],
  imports: [
    CommonModule,
    ProgramsRoutingModule,
    SharedModule,
    MatGridListModule
  ],
  providers: [
    HighlightService
  ]
})
export class ProgramsModule { }
