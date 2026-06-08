import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthStep } from './auth-step';

describe('AuthStep', () => {
  let component: AuthStep;
  let fixture: ComponentFixture<AuthStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthStep],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
