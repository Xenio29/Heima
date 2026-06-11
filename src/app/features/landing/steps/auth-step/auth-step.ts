import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../../../services/supabase';

@Component({
  selector: 'app-auth-step',
  imports: [FormsModule],
  templateUrl: './auth-step.html',
  styleUrl: './auth-step.scss',
})
export class AuthStep {
  loading = false;
  userID = ''

  @Output() authCompleted = new EventEmitter<{ email: string, id: string}>();

  formData = {
    email: '',
    password: '',
  };

  constructor(private readonly supabase: Supabase) {}

  async submitData(): Promise<void> {
    try {
      this.loading = true;

      const {data, error } = await this.supabase.signUpWithPassword(
        this.formData.email,
        this.formData.password
      );

      if (error) {
        throw error;
      }

      if(data.user?.id === undefined) {
        alert("Error with user ID fetching")
      } else {
        this.userID = data.user.id

        this.authCompleted.emit({
          email: this.formData.email,
          id: this.userID
        });
      }

      this.authCompleted.emit({
        email: this.formData.email,
        id: this.userID
      });
      
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }
}
