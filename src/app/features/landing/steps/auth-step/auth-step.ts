import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-step',
  imports: [FormsModule],
  templateUrl: './auth-step.html',
  styleUrl: './auth-step.scss',
})
export class AuthStep {
  @Output() authCompleted = new EventEmitter<{email: string, password: string}>();

  formData = {
    email: '',
    password: ''
  }

  submitData() {
    this.authCompleted.emit({ email: this.formData.email, password: this.formData.password });
  }
}
