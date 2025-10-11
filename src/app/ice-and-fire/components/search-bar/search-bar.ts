import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.html'
})
export class SearchBarComponent {
  // Inputs
  readonly placeholder = input<string>('Search...');
  readonly value = input<string>('');
  readonly disabled = input<boolean>(false);
  // Outputs
  readonly searchChange = output<string>();

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

}
