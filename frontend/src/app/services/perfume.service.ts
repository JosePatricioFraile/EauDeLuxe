import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  user_id: number;
  comment: string;
  rating: number;
  created_at: string;
  user_name: string;
}

export interface Perfume {
  id: number;
  name: string;
  brand: string;
  description: string;
  price50: number;
  price100: number;
  image_url: string;
  stock: number;
  notes: Note[];
  reviews: Review[];
}

@Injectable({
  providedIn: 'root'
})
export class PerfumeService {
  private baseUrl = 'http://localhost:3000/api/perfumes';

  constructor(private http: HttpClient) {}

  getPerfumeById(id: number): Observable<Perfume> {
    return this.http.get<Perfume>(`${this.baseUrl}/${id}`);
  }

  getPerfumes(): Observable<Perfume[]> {
    return this.http.get<Perfume[]>(this.baseUrl);
  }

  searchPerfumes(query: string): Observable<Perfume[]> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(query)}`;
    return this.http.get<Perfume[]>(url);
  }

  searchPerfumesWithFilters(params: any): Observable<Perfume[]> {
    const query = new URLSearchParams(params).toString();
    return this.http.get<Perfume[]>(`${this.baseUrl}?${query}`);
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>('http://localhost:3000/api/notes');
  }
}
