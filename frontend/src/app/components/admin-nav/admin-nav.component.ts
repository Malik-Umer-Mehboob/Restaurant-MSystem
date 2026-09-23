import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="admin-nav">
      <div class="tabs">
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Menu</a>
        <a routerLink="/admin/orders" routerLinkActive="active">Orders</a>
        <a routerLink="/admin/analytics" routerLinkActive="active">Analytics</a>
      </div>
      <button class="logout" (click)="logout()">Log out</button>
    </nav>
  `,
  styles: [`
    .admin-nav{
      display:flex; align-items:center; justify-content:space-between;
      max-width:1180px; margin:0 auto; padding:16px 20px;
      border-bottom:1px solid var(--line);
    }
    .tabs{display:flex; align-items:center; gap:6px;}
    .tabs a{
      color:var(--bone-dim); text-decoration:none; font-size:0.9rem; font-weight:700;
      padding:8px 16px; border-radius:20px; transition:all .15s ease;
    }
    .tabs a.active{color:var(--on-accent); background:var(--ember);}
    .tabs a:hover:not(.active){color:var(--bone); background:rgba(122,31,43,0.07);}
    .logout{
      background:none; border:1px solid var(--line); color:var(--bone-dim);
      padding:8px 16px; border-radius:20px; cursor:pointer; font-size:0.9rem; font-weight:700;
      transition:all .15s ease;
    }
    .logout:hover{color:var(--ember); border-color:var(--ember);}
  `]
})
export class AdminNavComponent {
  constructor(private auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/admin/login']); }
}