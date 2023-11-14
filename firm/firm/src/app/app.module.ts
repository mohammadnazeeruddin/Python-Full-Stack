import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from './components/components.module';
import { NgHttpLoaderModule } from 'ng-http-loader';


import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatFormFieldModule,
} from '@angular/material';
import { LoginComponent } from './login/login.component';
import { CompanyRegistrationComponent } from './company-registration/company-registration.component';
import { ListOfCompanyComponent } from './list-of-company/list-of-company.component';

import { NewFirmRegistrationComponent } from './new-firm-registration/new-firm-registration.component';
import { DialogOverviewExampleDialogComponent } from './list-of-company/dialog.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule

  ],
  declarations: [
    AppComponent,
    LoginComponent,
    CompanyRegistrationComponent,
    ListOfCompanyComponent,
    NewFirmRegistrationComponent,
    DialogOverviewExampleDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [DialogOverviewExampleDialogComponent,
    MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatFormFieldModule

  ],
  entryComponents: [ DialogOverviewExampleDialogComponent],
})
export class AppModule { }



