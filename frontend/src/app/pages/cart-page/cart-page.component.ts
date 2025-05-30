import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  updateQuantity(index: number, delta: number) {
    const newQty = this.cartItems[index].quantity + delta;
    if (newQty > 0) {
      this.cartService.updateQuantity(index, newQty);
      this.loadCart();
    }
  }

  removeItem(index: number) {
    this.cartService.removeItem(index);
    this.loadCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCart();
  }
}
