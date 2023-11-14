import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { TrainerRoutingModule } from './trainer-routing.module';
import { ProgramsModule } from './programs/programs.module';
import { MaterialComponent } from './material/material.component';
import { TrainerComponent } from '../trainer/trainer.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { StudentstatsComponent } from './studentstats/studentstats.component';
import { PopupComponent } from './popup/popup.component';
import { TreepopupComponent } from './treepopup/treepopup.component';
// import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [TrainerComponent, StudentstatsComponent, PopupComponent, TreepopupComponent, MaterialComponent],
  imports: [
    CommonModule,
    TrainerRoutingModule,
    SharedModule,
    AngularFontAwesomeModule,
    ProgramsModule
  ],
  entryComponents: [
    PopupComponent,
    TreepopupComponent
  ]
})
export class TrainerModule { }
