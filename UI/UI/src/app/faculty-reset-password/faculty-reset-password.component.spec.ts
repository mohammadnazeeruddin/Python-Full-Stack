import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyResetPasswordComponent } from './faculty-reset-password.component';

describe('FacultyResetPasswordComponent', () => {
  let component: FacultyResetPasswordComponent;
  let fixture: ComponentFixture<FacultyResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
