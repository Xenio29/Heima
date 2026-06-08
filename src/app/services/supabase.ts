import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Profile {
  id?: string,
  email: string,
  password: string,
  displayName: string
}

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      return null;
    }
    return data.user;
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select('email, password, displayName')
      .eq('id', user.id)
      .single();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  signUpWithPassword(email: string, password: string) {
    return this.supabase.auth.signUp({
      email,
      password,
    });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };

    return this.supabase.from('profiles').upsert(update);
  }
}
