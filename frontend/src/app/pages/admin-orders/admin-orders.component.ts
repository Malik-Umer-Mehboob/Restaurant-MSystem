import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderService } from '../../services/order.service';
import { AdminNavComponent } from '../../components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, AdminNavComponent],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  statuses: Order['status'][] = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

  constructor(private orderService: OrderService) {}

  ngOnInit() { this.refresh(); }

  refresh() {
    this.loading.set(true);
    this.orderService.listAll().subscribe({
      next: (o) => { this.orders.set(o); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  changeStatus(order: Order, status: string) {
    if (!order._id) return;
    this.orderService.updateStatus(order._id, status as Order['status']).subscribe({
      next: () => this.refresh()
    });
  }
}
