import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Profile {
  id: string;
  household_id: string;
  created_at: string;
  display_name: string
}

export interface Task {
  id: string;
  household_id: string;
  created_by: string;
  title: string;
  date: string;
  created_at: string;
  is_done: boolean;
  importance: number;
  is_ai_suggested: boolean
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

  async signInWithPassword(email: string, password: string) {
    const {data, error} = await this.supabase.auth.signInWithPassword({email, password})

    return {data, error}
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

  async getTasks(householdId: string, startDate: Date, endDate: Date): Promise<Task[]> {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('household_id', householdId)
      .gte('date', startDate.toISOString())
      .lt('date', endDate.toISOString());

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return data || [];
  }

  async getProfile(userID: string): Promise<Profile | null> {
    const {data, error} = await this.supabase.from('profiles').select('*').eq('id', userID).single();

    if(error) {
      console.error('Error fetching user: ', error);
      return null;
    }

    return data;
  }

  
  public get client() {
    return this.supabase;
  }
  
}
