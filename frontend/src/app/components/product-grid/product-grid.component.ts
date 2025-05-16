import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnChanges {
  @Input() products: any[] = [];
  visiblePerfumes: any[] = [];
  step = 6;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && this.products?.length > 0) {
      this.visiblePerfumes = this.products.slice(0, this.step);
      this.cdr.detectChanges();
    }
  }

  loadMore(): void {
    const current = this.visiblePerfumes.length;
    const next = this.products.slice(current, current + this.step);
    this.visiblePerfumes = [...this.visiblePerfumes, ...next];
  }
}
