import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfumeService } from '../../services/perfume.service';
import { CartService } from '../../services/cart.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProductNotesComponent } from '../../components/product-notes/product-notes.component';
import { ProductReviewsComponent } from '../../components/product-reviews/product-reviews.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductNotesComponent,
    ProductReviewsComponent
  ]
})
export class ProductDetailComponent implements OnInit {
  perfume: any = null;
  quantity: number = 1;
  selectedSize: string = '50';
  totalPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private perfumeService: PerfumeService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.perfumeService.getPerfumeById(id).subscribe((data) => {
        this.perfume = data;
        this.perfume.notes = this.perfume.notes ?? [];
        this.perfume.reviews = this.perfume.reviews ?? [];
        this.calculateTotalPrice();
      });
    }
  }

  calculateTotalPrice() {
    if (this.perfume) {
      const price = this.selectedSize === '50' ? this.perfume.price50 : this.perfume.price100;
      this.totalPrice = price * this.quantity;
    }
  }

  onSizeChange() {
    this.calculateTotalPrice();
  }

  selectSize(size: string) {
    this.selectedSize = size;
    this.calculateTotalPrice();
  }

  increaseQuantity() {
    this.quantity++;
    this.calculateTotalPrice();
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.calculateTotalPrice();
    }
  }

  onQuantityChange() {
    this.calculateTotalPrice();
  }

  addToCart() {
    const item = {
      id: this.perfume.id,
      name: this.perfume.name,
      brand: this.perfume.brand,
      image_url: this.perfume.image_url,
      size: this.selectedSize,
      quantity: this.quantity,
      price: this.selectedSize === '50' ? this.perfume.price50 : this.perfume.price100
    };

    this.cartService.addToCart(item);
    alert('Producto añadido a la cesta');
  }
}
