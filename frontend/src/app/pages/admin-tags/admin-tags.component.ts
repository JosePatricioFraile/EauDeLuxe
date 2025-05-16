import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-tags',
  standalone: true,
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AdminTagsComponent implements OnInit {
  categories: any[] = [];
  notes: any[] = [];
  newCategory = '';
  newNote = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.http.get('/api/admin/categories').subscribe((res: any) => this.categories = res);
    this.http.get('/api/admin/notes').subscribe((res: any) => this.notes = res);
  }

  addCategory(): void {
    this.http.post('/api/admin/categories', { name: this.newCategory }).subscribe(() => {
      this.newCategory = '';
      this.loadData();
    });
  }

  deleteCategory(id: number): void {
    this.http.delete(`/api/admin/categories/${id}`).subscribe(() => this.loadData());
  }

  addNote(): void {
    this.http.post('/api/admin/notes', { name: this.newNote }).subscribe(() => {
      this.newNote = '';
      this.loadData();
    });
  }

  deleteNote(id: number): void {
    this.http.delete(`/api/admin/notes/${id}`).subscribe(() => this.loadData());
  }
}
