import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyForgotPasswordComponent } from './faculty-forgot-password.component';

describe('FacultyForgotPasswordComponent', () => {
  let component: FacultyForgotPasswordComponent;
  let fixture: ComponentFixture<FacultyForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
