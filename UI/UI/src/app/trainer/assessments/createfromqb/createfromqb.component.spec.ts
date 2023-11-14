import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatefromqbComponent } from './createfromqb.component';

describe('CreatefromqbComponent', () => {
  let component: CreatefromqbComponent;
  let fixture: ComponentFixture<CreatefromqbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatefromqbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatefromqbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
