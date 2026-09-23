import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { TrackOrderComponent } from './pages/track-order/track-order.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AdminAnalyticsComponent } from './pages/admin-analytics/admin-analytics.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'track-order', component: TrackOrderComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [adminGuard] },
  { path: 'admin/analytics', component: AdminAnalyticsComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
