import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService, MenuItem } from '../../services/menu.service';
import { CartService } from '../../services/cart.service';
import { ReviewService, RatingSummary } from '../../services/review.service';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { ReviewModalComponent } from '../../components/review-modal/review-modal.component';
import { resolveImageUrl } from '../../config';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent, ReviewModalComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  allItems = signal<MenuItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<string>('all');
  searchTerm = signal<string>('');
  ratings = signal<Record<string, RatingSummary>>({});
  reviewItem = signal<MenuItem | null>(null);

  categories = computed(() => {
    const set = new Set(this.allItems().map(i => i.category));
    return Array.from(set);
  });

  // Search overrides the category tab so people can find a dish from anywhere in the menu.
  visibleItems = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const all = this.allItems();

    if (term) {
      return all.filter(i =>
        i.name.toLowerCase().includes(term) ||
        i.category.toLowerCase().includes(term) ||
        i.urdu.includes(term)
      );
    }

    const tab = this.activeTab();
    if (tab === 'all') return all;
    if (tab === 'hot') return all.filter(i => i.tags?.includes('hot'));
    return all.filter(i => i.category === tab);
  });

  groupedVisible = computed(() => {
    const term = this.searchTerm().trim();
    const tab = this.activeTab();
    const items = this.visibleItems();

    if (term || tab === 'all') {
      const map = new Map<string, MenuItem[]>();
      for (const it of items) {
        if (!map.has(it.category)) map.set(it.category, []);
        map.get(it.category)!.push(it);
      }
      return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
    }
    const label = tab === 'hot' ? 'Hot Selling' : tab;
    return [{ category: label, items }];
  });

  constructor(
    private menuService: MenuService,
    private reviewService: ReviewService,
    public cart: CartService
  ) {}

  ngOnInit() {
    this.menuService.getMenu().subscribe({
      next: (items) => { this.allItems.set(items); this.loading.set(false); },
      error: () => {
        this.error.set('Could not load the menu. Please make sure the backend API is running.');
        this.loading.set(false);
      }
    });
    this.loadRatings();
  }

  loadRatings() {
    this.reviewService.getSummary().subscribe({
      next: (summary) => this.ratings.set(summary),
      error: () => { /* ratings are a nice-to-have; fail silently */ }
    });
  }

  setTab(tab: string) {
    this.searchTerm.set('');
    this.activeTab.set(tab);
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

  qty(item: MenuItem): number {
    return item._id ? this.cart.qtyOf(item._id) : 0;
  }
  imageUrl(item: MenuItem): string {
  return resolveImageUrl(item.image);
}

  ratingFor(item: MenuItem): RatingSummary {
    return (item._id && this.ratings()[item._id]) || { avg: 0, count: 0 };
  }

  openReviews(item: MenuItem) {
    this.reviewItem.set(item);
  }

  closeReviews() {
    this.reviewItem.set(null);
  }

  private static ICONS: Record<string, string> = {
    'Rice & Biryani': '🍚', 'Salan': '🍛', 'BBQ': '🍢', 'Fast Food': '🍔',
    'Chef Special': '👨‍🍳', 'Platters': '🍽️', 'Karahi': '🥘', 'Handi': '🍲',
    'Chinese': '🥡', 'Pasta': '🍝', 'Beverages': '🥤', 'Tea & Coffee': '☕',
    'Desserts': '🍨', 'Extras': '🫓', 'Hot Selling': '🔥'
  };
  categoryIcon(category: string): string {
    return MenuComponent.ICONS[category] || '🍽️';
  }
}
