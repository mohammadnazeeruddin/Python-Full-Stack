import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';

import { GroupsComponent } from './groups.component';
import { CreateComponent } from './create/create.component';
import { PopupComponent } from './popup/popup.component';
import { AssessmentresultComponent } from '../groups/assessmentresult/assessmentresult.component';
import { HighlightService } from './../highlight.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    GroupsComponent,
    CreateComponent,
    PopupComponent,
    AssessmentresultComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedModule,
    NgApexchartsModule,
  ],

  entryComponents: [
    PopupComponent,
    CreateComponent
  ],
  providers: [HighlightService]
})
export class GroupsModule { }
