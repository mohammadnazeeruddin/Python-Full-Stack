import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Status {
  status: string;
  message: string;
  code: number;
}


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) { }

  getClassList(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.baseUrl}getClassList`);
  }
  getStudentByClass(id): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.baseUrl}getStudentByClass/${id}`);
  }
  getFaculty(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.baseUrl}getFaculty`);
  }
  getSubjectByClass(id): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.baseUrl}getSubjectByClass/${id}`);
  }
  getSlot(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.baseUrl}getSlot`);
  }
  saveAttendance(student): Observable<Status> {
    return this.http.post<Status>(`${this.baseUrl}saveAttendance`, student);
  }

  checkslot(slot): Observable<Status> {
  return this.http.post<Status>(`${this.baseUrl}checkSlot`, slot);
  }

  saveSlot(slot): Observable<Status> {
    return this.http.post<Status>(`${this.baseUrl}saveTimeTable`, slot);
  }

  gettimetablebyid(id): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.baseUrl}getTimeTableByClassId/${id}`)
  }

  getattedanceReport(obje): Observable<Array<any>> {
    return this.http.post<Array<any>> (`${this.baseUrl}getAttendance`, obje);
  }

}
