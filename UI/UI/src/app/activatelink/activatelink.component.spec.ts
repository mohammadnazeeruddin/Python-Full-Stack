import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatelinkComponent } from './activatelink.component';

describe('ActivatelinkComponent', () => {
  let component: ActivatelinkComponent;
  let fixture: ComponentFixture<ActivatelinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivatelinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivatelinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
