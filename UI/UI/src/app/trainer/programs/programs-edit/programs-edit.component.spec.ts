import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsEditComponent } from './programs-edit.component';

describe('ProgramsEditComponent', () => {
  let component: ProgramsEditComponent;
  let fixture: ComponentFixture<ProgramsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
