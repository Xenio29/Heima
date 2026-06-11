import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Profile {
  id?: string,
  household_id?: string,
  display_name: string
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
      .select('id, display-name, household_id')
      .eq('id', user.id)
      .single();
  }

  householdByJoinCode(joinCode: string) {
    return this.supabase
      .from('households')
      .select('*')
      .eq('join_code', joinCode)
      .single();
  }

  createHousehold(name: string, joinCode: string) {
    return this.supabase
      .from('households')
      .insert([{ name, join_code: joinCode }])
      .select()
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
    };

    return this.supabase.from('profiles').upsert(update);
  }

  
  public get client() {
    return this.supabase;
  }
  
}
