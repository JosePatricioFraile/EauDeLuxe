import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerfumeService } from '../../services/perfume.service';
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
    NavbarComponent,
    FooterComponent,
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
    private perfumeService: PerfumeService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.perfumeService.getPerfumeById(id).subscribe((data) => {
        this.perfume = data;

        // Forzamos que notes y reviews sean arrays para evitar errores en hijos
        this.perfume.notes = this.perfume.notes ?? [];
        this.perfume.reviews = this.perfume.reviews ?? [];

        this.calculateTotalPrice();
      });
    }
  }

  calculateTotalPrice() {
    if (this.perfume) {
      let price = this.selectedSize === '50' ? this.perfume.price50 : this.perfume.price100;
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


  onQuantityChange() {
    this.calculateTotalPrice();
  }

  addToCart() {
    alert(`Añadido ${this.quantity} unidades de ${this.selectedSize}ml, total: ${this.totalPrice} €`);
  }
}
