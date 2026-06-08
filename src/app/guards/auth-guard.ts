import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Supabase } from '../services/supabase';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(Supabase);
  const router = inject(Router);

  const { data } = await supabase.supabase.auth.getSession();

  if (data.session) {
    return true;
  }

  return router.createUrlTree(['']);
};
