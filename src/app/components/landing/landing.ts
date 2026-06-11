import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
export class Landing implements OnInit, OnDestroy {

  router = inject(Router);

  flowData: FlowData = {
    userID: '',
    email: '',
    displayName: '',
    householdName: '',
    joinCode: ''
  };

  private supabase = inject(Supabase);

  flowType!: 'creating' | 'joining';

  currentStep: 'start' | 'auth' | 'displayName' | 'householdName' | 'recap' = 'start';

  // --- Typing animation ---
  private readonly words = ['Planning', 'Groceries', 'Meals', 'Chores', 'Sports', 'Assistant'];
  private wordIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  typedText = '';

  ngOnInit(): void {
    this.tick();
  }

  ngOnDestroy(): void {
    this.stopTyping();
  }

  private stopTyping(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private tick(): void {
    const currentWord = this.words[this.wordIndex];

    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.typedText = currentWord.slice(0, this.charIndex);

    let delay: number;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      delay = 1800;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      delay = 400;
    } else {
      delay = this.isDeleting ? 60 : 100;
    }

    this.timeoutId = setTimeout(() => this.tick(), delay);
  }

  // --- Flow logic ---

  startFlow(flowType: 'creating' | 'joining'): void {
    this.stopTyping(); // ← stop animation when user starts a flow
    this.flowType = flowType;
    this.currentStep = 'auth';
  }

  async getHouseholdName(joinCode: string): Promise<void> {
    const { data, error } = await this.supabase.householdByJoinCode(joinCode);
    if (error) {
      console.error('Error:', error);
      this.flowData.householdName = 'Not found';
      return;
    }
    this.flowData.householdName = data?.name || 'Not found';
  }

  onAuthCompleted(data: { email: string; id: string }): void {
    this.flowData.email = data.email;
    this.flowData.userID = data.id;
    this.currentStep = 'displayName';
  }

  onDisplayNameCompleted(data: { displayName: string }): void {
    this.flowData.displayName = data.displayName;
    this.currentStep = 'householdName';
  }

  async onHouseholdCompleted(data: { action: 'creating' | 'joining' | null; householdName: string; joinCode: string }): Promise<void> {
    if (data.action === 'creating') {
      this.flowData.householdName = data.householdName;
    } else if (data.action === 'joining') {
      this.flowData.joinCode = data.joinCode;
      await this.getHouseholdName(data.joinCode);
    }
    this.currentStep = 'recap';
  }

  async OnRecapConfirmed(): Promise<void> {
    try {
      let householdId: string | undefined;

      if (this.flowType === 'creating') {
        const joinCode = crypto.randomUUID().slice(0, 8).toUpperCase();
        const { data, error } = await this.supabase.createHousehold(this.flowData.householdName, joinCode);
        if (error) throw error;
        householdId = data.id;
        this.flowData.joinCode = joinCode;
      }

      if (this.flowType === 'joining') {
        const { data, error } = await this.supabase.householdByJoinCode(this.flowData.joinCode);
        if (error) throw error;
        householdId = data.id;
      }

      if (!householdId) throw new Error('No household ID found');

      const { error: profileError } = await this.supabase.updateProfile({
        id: this.flowData.userID,
        display_name: this.flowData.displayName,
        household_id: householdId
      });

      if (profileError) throw profileError;

      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('❌ Error in recap confirmation:', error);
    }
  }
}