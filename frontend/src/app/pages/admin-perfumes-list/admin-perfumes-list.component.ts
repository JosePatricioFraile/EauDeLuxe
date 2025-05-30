import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-admin-perfumes-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
  ],
  templateUrl: './admin-perfumes-list.component.html',
  styleUrls: ['./admin-perfumes-list.component.scss']
})
export class AdminPerfumesListComponent implements OnInit {
  perfumes: any[] = [];
  // Base URL backend:
  private backendUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPerfumes();
  }

  loadPerfumes() {
    this.http.get<any[]>(`${this.backendUrl}/perfumes`).subscribe({
      next: (data) => {
        this.perfumes = data;
      },
      error: (err) => {
        console.error('Error cargando perfumes:', err);
      }
    });
  }

  deletePerfume(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este perfume?')) {
      this.http.delete(`${this.backendUrl}/admin/perfumes/${id}`).subscribe({
        next: () => this.loadPerfumes(),
        error: (err) => console.error('Error eliminando perfume:', err)
      });
    }
  }
}
