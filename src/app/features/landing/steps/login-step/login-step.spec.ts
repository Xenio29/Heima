import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStep } from './login-step';

describe('LoginStep', () => {
  let component: LoginStep;
  let fixture: ComponentFixture<LoginStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginStep],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
