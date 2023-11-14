import { HighlightService } from './../highlight.service';

import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsModule } from '../groups/groups.module';
// import { ShareModule } from '../share/share.module';

import { AssessmentsRoutingModule } from './assessments-routing.module';

import { AssessmentsComponent } from './assessments.component';
import { CreateComponent, PizzaPartyComponent } from './create/create.component';
import { EditComponent, PizzaParty1Component } from './edit/edit.component';
import { ConductComponent } from './conduct/conduct.component';
import { CreatefromqbComponent } from './createfromqb/createfromqb.component';
import { ConductpopupComponent } from './conductpopup/conductpopup.component';



@NgModule({
  declarations: [AssessmentsComponent, PizzaParty1Component,PizzaPartyComponent, CreateComponent, EditComponent, ConductComponent, CreatefromqbComponent, ConductpopupComponent],
  
  imports: [
    CommonModule,
    AssessmentsRoutingModule,
    SharedModule,
    GroupsModule,
    // ShareModule
  ],
  entryComponents: [
    PizzaPartyComponent,
    PizzaParty1Component,
    ConductComponent
  ],
  providers: [
    HighlightService
  ]
})
export class AssessmentsModule { }
