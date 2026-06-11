import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-display-name-step',
  imports: [FormsModule],
  templateUrl: './display-name-step.html',
  styleUrl: './display-name-step.scss',
})
export class DisplayNameStep {
  @Output() displayNameCompleted = new EventEmitter<{displayName: string}>();

  formData = {
    displayName: ''
  }

  submitData() {
    this.displayNameCompleted.emit({displayName: this.formData.displayName});
  }
}
