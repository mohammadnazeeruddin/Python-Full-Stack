import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreepopupComponent } from './treepopup.component';

describe('TreepopupComponent', () => {
  let component: TreepopupComponent;
  let fixture: ComponentFixture<TreepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
