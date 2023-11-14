import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengePopupComponent } from './challenge-popup.component';

describe('ChallengePopupComponent', () => {
  let component: ChallengePopupComponent;
  let fixture: ComponentFixture<ChallengePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
