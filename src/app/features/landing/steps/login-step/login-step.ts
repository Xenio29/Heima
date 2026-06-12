import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../../../services/supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-step',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-step.html',
  styleUrl: './login-step.scss',
})
export class LoginStep {
  private router = inject(Router);
  private supabase = inject(Supabase);
  loading = false;

  formData = {
    email: '',
    password: ''
  }

  async submitData(): Promise<void> {
    try {
      this.loading = true;

      const {data, error } = await this.supabase.signInWithPassword(
        this.formData.email,
        this.formData.password
      );

      if (error) {
        throw error;
      }

      this.router.navigate(['/dashboard'])
      
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }
}
