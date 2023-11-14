import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramsCreateComponent } from './programs-create.component';

describe('ProgramsCreateComponent', () => {
  let component: ProgramsCreateComponent;
  let fixture: ComponentFixture<ProgramsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
