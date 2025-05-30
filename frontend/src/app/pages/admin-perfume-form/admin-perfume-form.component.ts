import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-admin-perfume-form',
  standalone: true,
  templateUrl: './admin-perfume-form.component.html',
  styleUrls: ['./admin-perfume-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class AdminPerfumeFormComponent implements OnInit {
  perfumeForm!: FormGroup;
  selectedFile: File | null = null;
  isEdit = false;
  perfumeId: number | null = null;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.perfumeForm = this.fb.group({
      name: [''],
      brand: [''],
      description: [''],
      gender: [''],
      stock: [''],
      price50: [''],
      price100: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.perfumeId = +id;
      this.http.get<any>(`${this.apiUrl}/perfumes/${id}`).subscribe((data) => {
        this.perfumeForm.patchValue(data);
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    for (const key in this.perfumeForm.value) {
      formData.append(key, this.perfumeForm.value[key]);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const request = this.isEdit
      ? this.http.put(`${this.apiUrl}/admin/perfumes/${this.perfumeId}`, formData)
      : this.http.post(`${this.apiUrl}/admin/perfumes`, formData);

    request.subscribe(() => {
      alert('Perfume guardado correctamente');
      this.router.navigate(['/admin']);
    });
  }
}
