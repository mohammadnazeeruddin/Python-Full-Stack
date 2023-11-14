import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFirmRegistrationComponent } from './new-firm-registration.component';

describe('NewFirmRegistrationComponent', () => {
  let component: NewFirmRegistrationComponent;
  let fixture: ComponentFixture<NewFirmRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFirmRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFirmRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
