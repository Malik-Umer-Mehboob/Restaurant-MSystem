import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="stars" [class.interactive]="interactive">
      @for (i of [1,2,3,4,5]; track i) {
        <span
          class="star"
          [class.filled]="i <= displayValue"
          (mouseenter)="interactive && (hoverValue = i)"
          (mouseleave)="interactive && (hoverValue = 0)"
          (click)="onClick(i)">★</span>
      }
      @if (showCount && count !== undefined) {
        <span class="count">({{ count }})</span>
      }
    </span>
  `,
  styles: [`
    .stars{display:inline-flex; align-items:center; gap:2px; font-size:0.95rem; color:var(--line);}
    .star{color:var(--line);}
    .star.filled{color:var(--gold);}
    .interactive .star{cursor:pointer;}
    .count{margin-left:6px; font-size:0.78rem; color:var(--bone-dim); font-family:'Inter',sans-serif;}
  `]
})
export class StarRatingComponent {
  @Input() value = 0;
  @Input() count?: number;
  @Input() interactive = false;
  @Input() showCount = true;
  @Output() valueChange = new EventEmitter<number>();

  hoverValue = 0;

  get displayValue(): number {
    return this.interactive && this.hoverValue > 0 ? this.hoverValue : this.value;
  }

  onClick(i: number) {
    if (!this.interactive) return;
    this.value = i;
    this.valueChange.emit(i);
  }
}
