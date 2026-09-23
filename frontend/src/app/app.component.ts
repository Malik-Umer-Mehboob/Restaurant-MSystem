import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { RESTAURANT_NAME, WHATSAPP_NUMBER } from './config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, CartDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  restaurantName = RESTAURANT_NAME;
  whatsappNumber = WHATSAPP_NUMBER;
  year = new Date().getFullYear();

  hideSiteChrome = signal(false);

  constructor(public cart: CartService, public auth: AuthService, private router: Router) {
    this.hideSiteChrome.set(this.router.url.startsWith('/admin'));
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.hideSiteChrome.set(e.urlAfterRedirects.startsWith('/admin')));
  }

  onAuthClick() {
    if (this.auth.isLoggedIn()) {
      this.auth.logout();
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/admin/login']);
    }
  }
}