import { Component, inject } from '@angular/core';
import { AuthStep } from '../../features/landing/steps/auth-step/auth-step';
import { DisplayNameStep } from '../../features/landing/steps/display-name-step/display-name-step';
import { HouseholdNameStep } from '../../features/landing/steps/household-name-step/household-name-step';
import { RecapStep } from '../../features/landing/steps/recap-step/recap-step';
import { FlowData } from '../../models/flow-data';
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [AuthStep, DisplayNameStep, HouseholdNameStep, RecapStep],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

  router = inject(Router);

  flowData: FlowData = {
    userID: '',
    email: '',
    displayName: '',
    householdName: '',
    joinCode: ''
  }

  private supabase = inject(Supabase)

  flowType!: 'creating' | 'joining';

  currentStep: 'start' | 'auth' | 'displayName' | 'householdName' | 'recap' = 'start';

  async getHouseholdName(joinCode: string) {
    const { data, error } = await this.supabase.householdByJoinCode(joinCode);
  
    if (error) {
      console.error('Error:', error);
      this.flowData.householdName = 'Not found';
      return;
    }
    
    this.flowData.householdName = data?.name || 'Not found';
  }


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
    console.log('1. displayName received:', data.displayName);
    this.flowData.displayName = data.displayName;
    console.log('2. setting step to householdName');
    this.currentStep = 'householdName';
    console.log('3. currentStep is now:', this.currentStep);
  }

  async onHouseholdCompleted(data: {action: 'creating' | 'joining' | null, householdName: string, joinCode: string}) {
    console.log('4. householdCompleted received:', data);

    if (data.action === 'creating') {
      this.flowData.householdName = data.householdName;
    } else if (data.action === 'joining') {
      this.flowData.joinCode = data.joinCode;
      await this.getHouseholdName(data.joinCode);
    }

    console.table(this.flowData);
    console.log('6. setting step to recap');
    this.currentStep = 'recap';
    console.log('7. currentStep is now:', this.currentStep);
  }

  async OnRecapConfirmed() {
    try {
      let householdId: string | undefined;

      // ✅ CASE 1: Creating a household
      if (this.flowType === 'creating') {

        // Generate join code (simple example)
        const joinCode = crypto.randomUUID().slice(0, 8).toUpperCase();

        const { data, error } = await this.supabase.createHousehold(
          this.flowData.householdName,
          joinCode
        );

        if (error) throw error;

        householdId = data.id;
        this.flowData.joinCode = joinCode;
      }

      // ✅ CASE 2: Joining existing household
      if (this.flowType === 'joining') {
        const { data, error } = await this.supabase.householdByJoinCode(
          this.flowData.joinCode
        );

        if (error) throw error;

        householdId = data.id;
      }

      if (!householdId) {
        throw new Error('No household ID found');
      }

      // ✅ Update profile with household ID
      const { error: profileError } = await this.supabase.updateProfile({
        id: this.flowData.userID,
        display_name: this.flowData.displayName,
        household_id: householdId
      });

      if (profileError) throw profileError;

      console.log('✅ Profile successfully created/updated');

      // ✅ Navigate to dashboard or next page
      this.router.navigate(['/dashboard']);

    } catch (error) {
      console.error('❌ Error in recap confirmation:', error);
    }
  }
}
