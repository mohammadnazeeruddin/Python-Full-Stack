import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTreeViewComponent } from './task-tree-view.component';

describe('TaskTreeViewComponent', () => {
  let component: TaskTreeViewComponent;
  let fixture: ComponentFixture<TaskTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
