import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-notes.component.html',
  styleUrls: ['./product-notes.component.scss']
})
export class ProductNotesComponent {
@Input() notes: { id?: number; name: string }[] | undefined = [];

  get safeNotes() {
    return this.notes ?? [];
  }
}
