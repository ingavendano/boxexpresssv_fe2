import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/layout/public-layout/public-layout').then(m => m.PublicLayout),
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'about-us',
                loadComponent: () => import('./components/about-us/about-us').then(m => m.AboutUs)
            },
            {
                path: 'services',
                loadComponent: () => import('./components/services/services').then(m => m.ServicesComponent)
            },
            {
                path: 'tracking',
                loadComponent: () => import('./components/tracking/tracking.component').then(m => m.TrackingComponent)
            },
            {
                path: 'calendar',
                loadComponent: () => import('./components/travel-calendar/travel-calendar').then(m => m.TravelCalendarComponent)
            }
        ]
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
        canActivate: [() => import('./core/guards/auth.guard').then(m => m.authGuard)],
        children: [
            {
                path: 'travels',
                loadComponent: () => import('./components/admin/travel-admin/travel-admin').then(m => m.TravelAdminComponent)
            },
            {
                path: 'tracking',
                loadComponent: () => import('./components/admin/tracking-admin/tracking-admin').then(m => m.TrackingAdmin)
            },
            {
                path: 'tariffs',
                loadComponent: () => import('./components/admin/tariff-config/tariff-config.component').then(m => m.TariffConfigComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./components/admin/global-settings/global-settings.component').then(m => m.GlobalSettingsComponent)
            },
            {
                path: 'customers',
                loadComponent: () => import('./components/admin/customer-management/customer-management.component').then(m => m.CustomerManagementComponent)
            },
            {
                path: 'packages',
                loadComponent: () => import('./components/admin/package-registration/package-registration.component').then(m => m.PackageRegistrationComponent)
            },
            {
                path: 'statuses',
                loadComponent: () => import('./components/admin/tracking-status-admin/tracking-status-admin').then(m => m.TrackingStatusAdminComponent)
            },
            {
                path: '',
                redirectTo: 'travels',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'customer',
        loadComponent: () => import('./components/admin/admin-layout/admin-layout').then(m => m.AdminLayoutComponent), // Reusing layout for now, or new one
        canActivate: [() => import('./core/guards/auth.guard').then(m => m.authGuard)], // Add Role check ideally
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./components/customer/customer-profile/customer-profile').then(m => m.CustomerProfile)
            },
            {
                path: 'addresses',
                loadComponent: () => import('./components/customer/customer-addresses/customer-addresses').then(m => m.CustomerAddresses)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./components/customer/customer-notifications/customer-notifications').then(m => m.CustomerNotifications)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'tracking',
        loadComponent: () => import('./components/tracking/tracking.component').then(m => m.TrackingComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
