import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyLoginComponent } from './faculty-login.component';

describe('FacultyLoginComponent', () => {
  let component: FacultyLoginComponent;
  let fixture: ComponentFixture<FacultyLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
