import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNameStep } from './display-name-step';

describe('DisplayNameStep', () => {
  let component: DisplayNameStep;
  let fixture: ComponentFixture<DisplayNameStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayNameStep],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayNameStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
