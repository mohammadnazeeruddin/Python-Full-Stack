import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from './services/attendance.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from 'selenium-webdriver/http';
import { NotificationService } from './services/notification.service';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    HttpClient,
    HttpClientModule,
    MatSnackBarModule
  ],
  declarations: [],
  providers: [AttendanceService, NotificationService]
})
export class CoreModule { }
