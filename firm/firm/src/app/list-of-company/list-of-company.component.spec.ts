import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCompanyComponent } from './list-of-company.component';

describe('ListOfCompanyComponent', () => {
  let component: ListOfCompanyComponent;
  let fixture: ComponentFixture<ListOfCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
