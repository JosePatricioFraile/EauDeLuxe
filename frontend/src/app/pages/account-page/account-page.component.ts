import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  name: string = '';
  email: string = '';
  address = {
    address: '',
    city: '',
    postal_code: '',
    country: ''
  };

  isLoading = true;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any>('http://localhost:3000/api/users/me').subscribe({
      next: (data) => {
        this.name = data.user?.name || '';
        this.email = data.user?.email || '';
        this.address = {
          address: data.address?.address || '',
          city: data.address?.city || '',
          postal_code: data.address?.postal_code || '',
          country: data.address?.country || ''
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.isLoading = false;
      }
    });
  }

  guardar() {
    const body = {
      name: this.name,
      email: this.email,
      addressData: this.address
    };

    this.http.put('http://localhost:3000/api/users/me', body).subscribe({
      next: () => alert('Datos actualizados correctamente'),
      error: () => alert('Error al actualizar datos')
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
