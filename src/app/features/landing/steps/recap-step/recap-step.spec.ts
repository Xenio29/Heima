import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapStep } from './recap-step';

describe('RecapStep', () => {
  let component: RecapStep;
  let fixture: ComponentFixture<RecapStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecapStep],
    }).compileComponents();

    fixture = TestBed.createComponent(RecapStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
