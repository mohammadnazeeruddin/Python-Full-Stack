import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOpentasksComponent } from './my-opentasks.component';

describe('MyOpentasksComponent', () => {
  let component: MyOpentasksComponent;
  let fixture: ComponentFixture<MyOpentasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOpentasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOpentasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
