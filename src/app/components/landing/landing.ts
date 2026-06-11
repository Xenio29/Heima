import { Component } from '@angular/core';
import { AuthStep } from '../../features/landing/steps/auth-step/auth-step';
import { DisplayNameStep } from '../../features/landing/steps/display-name-step/display-name-step';
import { HouseholdNameStep } from '../../features/landing/steps/household-name-step/household-name-step';
import { RecapStep } from '../../features/landing/steps/recap-step/recap-step';
import { FlowData } from '../../models/flow-data';

@Component({
  selector: 'app-landing',
  imports: [AuthStep, DisplayNameStep, HouseholdNameStep, RecapStep],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  flowData: FlowData = {
    userID: '',
    email: '',
    displayName: '',
    householdName: '',
    joinCode: ''
  }

  flowType!: 'creating' | 'joining';

  currentStep: 'start' | 'auth' | 'displayName' | 'householdName' | 'recap' = 'start';

  startFlow(flowType: 'creating' | 'joining') {
    this.flowType = flowType;

    this.currentStep = 'auth';
  }

  onAuthCompleted(data: {email: string, id: string}) {
    this.flowData.email = data.email;
    this.flowData.userID = data.id;
    this.currentStep = 'displayName';
  }

  onDisplayNameCompleted(data: {displayName: string}) {
    this.flowData.displayName = data.displayName;
    this.currentStep = 'householdName';
  }

  onHouseholdCompleted(data: {action: 'creating' | 'joining' | null, householdName: string, joinCode: string}) {
    if (data.action === 'creating') {
      this.flowData.householdName = data.householdName;
    } else if (data.action === 'joining') {
      this.flowData.joinCode = data.joinCode;
    }

    this.currentStep = 'recap';
  }
}
