import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ]
})
export class ShopComponent implements OnInit {
  perfumes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/perfumes').subscribe((data) => {
      this.perfumes = data;
    });
  }
}
