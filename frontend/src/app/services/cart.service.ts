import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'eau_cart';

  getCart(): any[] {
    const data = localStorage.getItem(this.cartKey);
    return data ? JSON.parse(data) : [];
  }

  saveCart(cart: any[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  // ✅ Ahora solo se pasa un objeto con toda la info
  addToCart(item: {
    id: number;
    name: string;
    brand: string;
    image_url: string;
    size: string;
    price: number;
    quantity: number;
  }): void {
    const cart = this.getCart();
    const existing = cart.find(
      (p: any) => p.id === item.id && p.size === item.size
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }

    this.saveCart(cart);
  }

  updateQuantity(index: number, quantity: number): void {
    const cart = this.getCart();
    if (cart[index]) {
      cart[index].quantity = quantity;
      this.saveCart(cart);
    }
  }

  removeItem(index: number): void {
    const cart = this.getCart();
    cart.splice(index, 1);
    this.saveCart(cart);
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }

  getTotal(): number {
    return this.getCart().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
