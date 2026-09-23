import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="admin-nav">
      <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Menu</a>
      <a routerLink="/admin/orders" routerLinkActive="active">Orders</a>
      <a routerLink="/admin/analytics" routerLinkActive="active">Analytics</a>
      <button class="logout" (click)="logout()">Log out</button>
    </nav>
  `,
  styles: [`
    .admin-nav{
      display:flex; align-items:center; gap:22px; max-width:1180px; margin:0 auto;
      padding:16px 20px; border-bottom:1px solid var(--line);
    }
    .admin-nav a{color:var(--bone-dim); text-decoration:none; font-size:0.9rem; font-weight:500; padding-bottom:4px; border-bottom:2px solid transparent;}
    .admin-nav a.active{color:var(--bone); border-bottom-color:var(--ember);}
    .admin-nav a:hover{color:var(--bone);}
    .logout{margin-left:auto; background:none; border:1px solid var(--line); color:var(--bone-dim); padding:7px 14px; border-radius:4px; cursor:pointer; font-size:0.82rem;}
    .logout:hover{color:var(--bone); border-color:var(--bone-dim);}
  `]
})
export class AdminNavComponent {
  constructor(private auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/admin/login']); }
}
