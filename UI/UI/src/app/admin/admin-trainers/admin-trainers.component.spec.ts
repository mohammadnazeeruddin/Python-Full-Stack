import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrainersComponent } from './admin-trainers.component';

describe('AdminTrainersComponent', () => {
  let component: AdminTrainersComponent;
  let fixture: ComponentFixture<AdminTrainersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTrainersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
