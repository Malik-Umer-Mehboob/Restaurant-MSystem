import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { AdminNavComponent } from '../../components/admin-nav/admin-nav.component';

const EMPTY_FORM: MenuItem = {
  name: '', urdu: '', category: '', description: '', price: 0, tags: [], image: ''
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  items = signal<MenuItem[]>([]);
  loading = signal(true);
  formOpen = signal(false);
  editingId = signal<string | null>(null);
  saving = signal(false);
  message = signal<string | null>(null);

  form: MenuItem = { ...EMPTY_FORM };
  selectedFile: File | null = null;
  hotChecked = false;
  spicyChecked = false;

  constructor(private menuService: MenuService, public auth: AuthService, private router: Router) {}

  ngOnInit() { this.refresh(); }

  refresh() {
    this.loading.set(true);
    this.menuService.getMenu().subscribe({
      next: (items) => { this.items.set(items); this.loading.set(false); },
      error: () => { this.loading.set(false); this.message.set('Could not load items — check the backend API.'); }
    });
  }

  openAddForm() {
    this.form = { ...EMPTY_FORM };
    this.hotChecked = false;
    this.spicyChecked = false;
    this.selectedFile = null;
    this.editingId.set(null);
    this.formOpen.set(true);
  }

  openEditForm(item: MenuItem) {
    this.form = { ...item };
    this.hotChecked = item.tags?.includes('hot') ?? false;
    this.spicyChecked = item.tags?.includes('spicy') ?? false;
    this.selectedFile = null;
    this.editingId.set(item._id ?? null);
    this.formOpen.set(true);
  }

  closeForm() { this.formOpen.set(false); }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  save() {
    this.saving.set(true);
    this.message.set(null);
    this.form.tags = [
      ...(this.hotChecked ? ['hot'] : []),
      ...(this.spicyChecked ? ['spicy'] : [])
    ];

    const proceed = (imagePath?: string) => {
      if (imagePath) this.form.image = imagePath;
      const id = this.editingId();
      const request = id
        ? this.menuService.updateItem(id, this.form)
        : this.menuService.createItem(this.form);

      request.subscribe({
        next: () => {
          this.saving.set(false);
          this.formOpen.set(false);
          this.message.set(id ? 'Item updated.' : 'Item added.');
          this.refresh();
        },
        error: () => { this.saving.set(false); this.message.set('Save failed — check the backend API.'); }
      });
    };

    if (this.selectedFile) {
      this.menuService.uploadImage(this.selectedFile).subscribe({
        next: (res) => proceed(res.path),
        error: () => { this.saving.set(false); this.message.set('Image upload failed.'); }
      });
    } else {
      proceed();
    }
  }

  remove(item: MenuItem) {
    if (!item._id) return;
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    this.menuService.deleteItem(item._id).subscribe({
      next: () => { this.message.set('Item deleted.'); this.refresh(); },
      error: () => this.message.set('Delete failed — check the backend API.')
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
