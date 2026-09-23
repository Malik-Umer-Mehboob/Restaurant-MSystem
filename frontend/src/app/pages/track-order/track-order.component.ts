import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, OrderService } from '../../services/order.service';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.css'
})
export class TrackOrderComponent {
  phone = '';
  orders = signal<Order[] | null>(null);
  loading = signal(false);
  searched = signal(false);

  statusLabels: Record<string, string> = {
    pending: 'Order received',
    preparing: 'Being prepared',
    ready: 'Ready for pickup/delivery',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  statusOrder = ['pending', 'preparing', 'ready', 'completed'];

  constructor(private orderService: OrderService) {}

  search() {
    if (!this.phone.trim()) return;
    this.loading.set(true);
    this.searched.set(true);
    this.orderService.track(this.phone.trim()).subscribe({
      next: (orders) => { this.orders.set(orders); this.loading.set(false); },
      error: () => { this.orders.set([]); this.loading.set(false); }
    });
  }

  progressPercent(status: string): number {
    if (status === 'cancelled') return 100;
    const idx = this.statusOrder.indexOf(status);
    if (idx === -1) return 0;
    return ((idx + 1) / this.statusOrder.length) * 100;
  }
}
