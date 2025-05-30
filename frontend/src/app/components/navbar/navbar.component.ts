import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  searchText: string = '';

  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  search() {
    const query = this.searchText.trim();
    if (query.length > 0) {
      this.router.navigate(['/filtros'], { queryParams: { q: query } });
    }
  }

  filterByGender(gender: string) {
    // Mapea el género visible a lo que espera la página filtros
    const genderMap: Record<string, string> = {
      hombre: 'H',
      mujer: 'M',
      unisex: 'U',
    };

    const param = genderMap[gender.toLowerCase()] || 'U';
    this.router.navigate(['/filtros'], { queryParams: { gender: param } });
  }

  get isAdmin(): boolean {
    const user = this.auth.getUser();
    return user?.role === 'admin';
  }
}
