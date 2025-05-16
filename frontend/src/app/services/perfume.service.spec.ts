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
  price50?: number;
  price100?: number;
  image_url: string;
  notes?: Note[];
  reviews?: Review[];
}

@Injectable({
  providedIn: 'root'
})
export class PerfumeService {
  private apiUrl = 'http://localhost:3000/api/perfumes';

  constructor(private http: HttpClient) {}

  getPerfumeById(id: number): Observable<Perfume> {
    return this.http.get<Perfume>(`${this.apiUrl}/${id}`);
  }

  getPerfumes(): Observable<Perfume[]> {
    return this.http.get<Perfume[]>(this.apiUrl);
  }
}
