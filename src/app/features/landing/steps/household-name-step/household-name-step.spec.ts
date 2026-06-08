import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdNameStep } from './household-name-step';

describe('HouseholdNameStep', () => {
  let component: HouseholdNameStep;
  let fixture: ComponentFixture<HouseholdNameStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdNameStep],
    }).compileComponents();

    fixture = TestBed.createComponent(HouseholdNameStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
