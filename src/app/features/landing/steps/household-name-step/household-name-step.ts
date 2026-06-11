import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-household-name-step',
  imports: [FormsModule],
  templateUrl: './household-name-step.html',
  styleUrl: './household-name-step.scss',
})
export class HouseholdNameStep {
  @Input() action: 'creating' | 'joining' | null = null;
  @Output() householdInfo = new EventEmitter<{action: 'creating' | 'joining' | null , householdName: string, joinCode: string}>();

  formData = {
    householdName: '',
    joinCode: ''
  }

  submitData() {
    this.householdInfo.emit({action: this.action, householdName: this.formData.householdName, joinCode: this.formData.joinCode});
  }
}
