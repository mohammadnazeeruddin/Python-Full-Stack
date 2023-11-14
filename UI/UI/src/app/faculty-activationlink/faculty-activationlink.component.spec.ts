import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyActivationlinkComponent } from './faculty-activationlink.component';

describe('FacultyActivationlinkComponent', () => {
  let component: FacultyActivationlinkComponent;
  let fixture: ComponentFixture<FacultyActivationlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyActivationlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyActivationlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
