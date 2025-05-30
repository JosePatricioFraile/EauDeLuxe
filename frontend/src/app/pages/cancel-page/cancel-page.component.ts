import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-cancel-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
  ],
  templateUrl: './cancel-page.component.html',
  styleUrls: ['./cancel-page.component.scss']
})
export class CancelPageComponent {}
