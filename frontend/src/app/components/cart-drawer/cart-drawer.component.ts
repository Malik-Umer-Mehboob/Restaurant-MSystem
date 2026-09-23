import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css'
})
export class CartDrawerComponent {
  customerName = '';
  customerPhone = '';
  saving = signal(false);
  error = signal<string | null>(null);

  constructor(public cart: CartService, private orderService: OrderService) {}

  checkout() {
    if (!this.customerPhone.trim()) {
      this.error.set('Please enter your phone number so you can track your order.');
      return;
    }
    this.error.set(null);
    this.saving.set(true);

    const items = this.cart.items().map(l => ({ name: l.item.name, price: l.item.price, qty: l.qty }));
    const link = this.cart.whatsappLink();

    this.orderService.create({
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      items
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.cart.clear();
        window.open(link, '_blank', 'noopener');
      },
      error: () => {
        // Even if saving the order record fails, don't block the customer from
        // ordering — still send them to WhatsApp so the restaurant gets the order.
        this.saving.set(false);
        window.open(link, '_blank', 'noopener');
      }
    });
  }
}
