import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Settings } from './components/settings/settings';
import { Landing } from './components/landing/landing';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: 'settings',
        component: Settings,
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: '',
        component: Landing
    }
];
