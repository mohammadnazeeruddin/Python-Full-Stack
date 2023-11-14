import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductpopupComponent } from './conductpopup.component';

describe('ConductpopupComponent', () => {
  let component: ConductpopupComponent;
  let fixture: ComponentFixture<ConductpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConductpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConductpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
