import { Injectable, computed, signal } from '@angular/core';
import { MenuItem } from './menu.service';
import { WHATSAPP_NUMBER, RESTAURANT_NAME } from '../config';

export interface CartLine {
  item: MenuItem;
  qty: number;
}

const STORAGE_KEY = 'shahi_angaar_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private lines = signal<Record<string, CartLine>>(this.readFromStorage());
  isOpen = signal(false);

  readonly items = computed(() => Object.values(this.lines()));
  readonly count = computed(() =>
    this.items().reduce((sum, l) => sum + l.qty, 0)
  );
  readonly total = computed(() =>
    this.items().reduce((sum, l) => sum + l.qty * l.item.price, 0)
  );

  private readFromStorage(): Record<string, CartLine> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines()));
    } catch {
      /* storage unavailable — cart just won't survive a refresh */
    }
  }

  qtyOf(itemId: string): number {
    return this.lines()[itemId]?.qty ?? 0;
  }

  add(item: MenuItem) {
    const id = item._id!;
    const current = this.lines();
    const existing = current[id];
    const next = { ...current, [id]: { item, qty: (existing?.qty ?? 0) + 1 } };
    this.lines.set(next);
    this.persist();
  }

  decrease(itemId: string) {
    const current = { ...this.lines() };
    const existing = current[itemId];
    if (!existing) return;
    if (existing.qty <= 1) {
      delete current[itemId];
    } else {
      current[itemId] = { ...existing, qty: existing.qty - 1 };
    }
    this.lines.set(current);
    this.persist();
  }

  remove(itemId: string) {
    const current = { ...this.lines() };
    delete current[itemId];
    this.lines.set(current);
    this.persist();
  }

  clear() {
    this.lines.set({});
    this.persist();
  }

  open() { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }

  whatsappLink(): string {
    const lines = this.items();
    const header = `Assalam o Alaikum! I would like to order the following from ${RESTAURANT_NAME}:`;
    const body = lines.length
      ? lines.map(l => `- ${l.item.name} x${l.qty} = Rs. ${(l.item.price * l.qty).toLocaleString()}`).join('\n')
      : '';
    const footer = lines.length ? `\nTotal: Rs. ${this.total().toLocaleString()}` : '';
    const text = lines.length ? `${header}\n${body}${footer}` : `Assalam o Alaikum! I would like to place an order from ${RESTAURANT_NAME}.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }
}
