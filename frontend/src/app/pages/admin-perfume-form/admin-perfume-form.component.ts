import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-perfume-form',
  standalone: true,
  templateUrl: './admin-perfume-form.component.html',
  styleUrls: ['./admin-perfume-form.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AdminPerfumeFormComponent implements OnInit {
  perfumeForm: FormGroup;
  isEdit = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.perfumeForm = this.fb.group({
      name: [''],
      brand: [''],
      description: [''],
      price: [0],
      stock: [0]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.http.get(`http://localhost:3000/api/perfumes/${id}`).subscribe((data: any) => {
        this.perfumeForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    const body = this.perfumeForm.value;
    const id = this.route.snapshot.paramMap.get('id');
    const url = id
      ? `http://localhost:3000/api/admin/perfumes/${id}`
      : `http://localhost:3000/api/admin/perfumes`;
    const request = id
      ? this.http.put(url, body)
      : this.http.post(url, body);

    request.subscribe(() => this.router.navigate(['/admin']));
  }
}
