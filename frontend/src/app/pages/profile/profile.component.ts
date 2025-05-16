import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class ProfileComponent implements OnInit {
  user: any;
  orders: any[] = [];

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.http.get('/api/orders').subscribe((res: any) => this.orders = res);
  }
}
