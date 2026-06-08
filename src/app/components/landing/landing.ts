import { Component } from '@angular/core';
import { AuthStep } from '../../features/landing/steps/auth-step/auth-step';
import { DisplayNameStep } from '../../features/landing/steps/display-name-step/display-name-step';
import { HouseholdNameStep } from '../../features/landing/steps/household-name-step/household-name-step';
import { RecapStep } from '../../features/landing/steps/recap-step/recap-step';

@Component({
  selector: 'app-landing',
  imports: [AuthStep, DisplayNameStep, HouseholdNameStep, RecapStep],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  flowData = {
    email: '',
    password: '',
    displayName: '',
    householdName: '',
    joinCode: ''
  }

  flowType: 'creating' | 'joining' | null = null;

  currentStep: 'start' | 'auth' | 'displayName' | 'householdName' | 'recap' = 'start';

  startFlow(flowType: 'creating' | 'joining') {
    this.flowType = flowType;

    this.currentStep = 'auth';
  }

  onAuthCompleted(data: {email: string, password: string}) {
    this.flowData.email = data.email;
    this.flowData.password = data.password;

    this.currentStep = 'displayName';
  }
}
