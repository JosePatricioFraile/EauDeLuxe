import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

declare var Stripe: any;

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
  ],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  name: string = '';
  email: string = '';
  address: string = '';
  addressId: number | null = null;
  paymentMethod: string = 'card';

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();

    this.http.get<any>('http://localhost:3000/api/users/me').subscribe({
      next: (data) => {
        this.name = data.user?.name || '';
        this.email = data.user?.email || '';
        this.address = data.address?.address || '';
        this.addressId = data.address?.id || null;
      },
      error: (err) => {
        console.error('Error al cargar datos del usuario:', err);
      }
    });
  }

  confirmOrder() {
  if (!this.addressId) {
    alert('No se encontró una dirección válida.');
    return;
  }

  const stripe = Stripe('pk_test_51RTilSQSHtJgkCApBtBVrOM666bFpYbXjRD33lq7gPFUV6CV4IuL9tNlTOOFFDzEla2kIwB37Zpm8rCpeslxmcRW00FW0RuNj1');

  const items = this.cartService.getCart();
  const total_price = this.cartService.getTotal();

  this.http.post<any>('http://localhost:3000/api/orders', {
    address_id: this.addressId,
    items,
    total_price
  }).subscribe({
    next: () => {
      this.http.post<any>('http://localhost:3000/api/checkout/create-session', {
        items,
        address_id: this.addressId
      }).subscribe({
        next: (res) => {
          // ✅ Vaciar carrito antes de redirigir
          this.cartService.clearCart();

          // 🔁 Redirigir a Stripe
          stripe.redirectToCheckout({ sessionId: res.id });
        },
        error: (err) => {
          console.error('Error creando sesión de Stripe:', err);
          alert('Error al iniciar el proceso de pago.');
        }
      });
    },
    error: (err) => {
      console.error('Error al guardar el pedido:', err);
      alert('No se pudo guardar el pedido.');
    }
  });
}
}
