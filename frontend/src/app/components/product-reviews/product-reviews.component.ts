import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsComponent {
  @Input() reviews?: any[];
  @Input() perfumeId!: number;

  newComment: string = '';
  newRating: number = 5;
  isSubmitting: boolean = false;
  hoveredRating: number = 0;


  constructor(private auth: AuthService, private http: HttpClient) {}

  get safeReviews() {
    return this.reviews ?? [];
  }

  get isLoggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  submitReview() {
    if (!this.newComment.trim()) return;

    this.isSubmitting = true;

    const body = {
      comment: this.newComment,
      rating: this.newRating,
      perfume_id: this.perfumeId
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`
    });

    this.http.post('http://localhost:3000/api/reviews', body, { headers }).subscribe({
      next: (res: any) => {
        // Agrega la nueva reseña visualmente
        this.safeReviews.unshift({
          user_name: this.auth.getUser()?.name,
          comment: this.newComment,
          rating: this.newRating,
          created_at: new Date().toISOString()
        });
        this.newComment = '';
        this.newRating = 5;
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error al enviar reseña', err);
        this.isSubmitting = false;
      }
    });
  }
}
