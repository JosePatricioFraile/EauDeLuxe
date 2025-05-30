import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductGridComponent } from '../../components/product-grid/product-grid.component';
import { PerfumeService, Perfume } from '../../services/perfume.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-filters-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ProductGridComponent,
  ],
  templateUrl: './filters-page.component.html',
  styleUrls: ['./filters-page.component.scss']
})
export class FiltersPageComponent implements OnInit {
  filteredProducts: Perfume[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  notes: { id: number; name: string }[] = [];

  // Filtros seleccionados
  selectedGender = '';
  selectedMinPrice = '';
  selectedMaxPrice = '';
  selectedNote = '';
  selectedOrder = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private perfumeService: PerfumeService
  ) {}

  ngOnInit(): void {
    // Cargar notas dinámicas
    this.perfumeService.getNotes().subscribe({
      next: (data) => this.notes = data,
      error: (err) => console.error('Error al cargar notas:', err)
    });

    // Cargar perfumes y sincronizar filtros desde URL
    this.route.queryParams.subscribe(params => {
      this.selectedGender = params['gender'] || '';
      this.selectedMinPrice = params['minPrice'] || '';
      this.selectedMaxPrice = params['maxPrice'] || '';
      this.selectedNote = params['note'] || '';
      this.selectedOrder = params['orderBy'] || '';

      this.isLoading = true;
      this.errorMessage = '';

      this.perfumeService.searchPerfumesWithFilters(params).subscribe({
        next: (data) => {
          this.filteredProducts = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al buscar perfumes:', err);
          this.errorMessage = 'Error al cargar los perfumes.';
          this.isLoading = false;
        }
      });
    });
  }

  updateFilter(param: string, value: string | number): void {
    const queryParams = { ...this.route.snapshot.queryParams };

    if (value === '' || value === null) {
      delete queryParams[param];
    } else {
      queryParams[param] = value;
    }

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  clearFilters(): void {
    // Reiniciar valores visuales
    this.selectedGender = '';
    this.selectedMinPrice = '';
    this.selectedMaxPrice = '';
    this.selectedNote = '';
    this.selectedOrder = '';

    // Borrar queryParams
    this.router.navigate([], {
      queryParams: {}
    });
  }
}
