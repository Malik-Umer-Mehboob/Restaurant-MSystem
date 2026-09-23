import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, AnalyticsSummary } from '../../services/analytics.service';
import { AdminNavComponent } from '../../components/admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, AdminNavComponent],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.css'
})
export class AdminAnalyticsComponent implements OnInit {
  data = signal<AnalyticsSummary | null>(null);
  loading = signal(true);

  maxTopQty = computed(() => {
    const items = this.data()?.topItems ?? [];
    return items.reduce((m, i) => Math.max(m, i.qty), 1);
  });

  statusEntries = computed(() => {
    const byStatus = this.data()?.byStatus ?? {};
    return Object.entries(byStatus);
  });
  maxStatusCount = computed(() => {
    const entries = this.statusEntries();
    return entries.reduce((m, [, c]) => Math.max(m, c), 1);
  });

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.analyticsService.getSummary().subscribe({
      next: (d) => { this.data.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
