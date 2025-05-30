import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service'; // Ajusta la ruta si es necesario

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

  constructor(private cdr: ChangeDetectorRef, private cartService: CartService) {}

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

  addToCart(p: any): void {
    // Construimos el item básico para añadir al carrito
    const item = {
      id: p.id,
      name: p.name,
      brand: p.brand,
      image_url: p.image_url,
      size: '100',  // Si quieres, haz dinámico o predeterminado
      quantity: 1,
      price: p.price100
    };

    this.cartService.addToCart(item);
    alert(`"${p.name}" añadido al carrito`);
  }
}
