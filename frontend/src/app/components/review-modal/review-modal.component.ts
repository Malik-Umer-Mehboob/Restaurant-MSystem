import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from '../../services/menu.service';
import { Review, ReviewService } from '../../services/review.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.css'
})
export class ReviewModalComponent implements OnInit {
  @Input({ required: true }) item!: MenuItem;
  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  reviews = signal<Review[]>([]);
  loading = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);

  name = '';
  rating = 0;
  comment = '';

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    if (!this.item._id) return;
    this.loading.set(true);
    this.reviewService.getReviews(this.item._id).subscribe({
      next: (r) => { this.reviews.set(r); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  submit() {
    if (!this.item._id || this.rating < 1) {
      this.error.set('Please select a star rating.');
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.reviewService.submitReview(this.item._id, {
      name: this.name.trim() || 'Anonymous',
      rating: this.rating,
      comment: this.comment.trim()
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.name = ''; this.rating = 0; this.comment = '';
        this.load();
        this.submitted.emit();
      },
      error: () => { this.submitting.set(false); this.error.set('Could not submit — please try again.'); }
    });
  }
}
