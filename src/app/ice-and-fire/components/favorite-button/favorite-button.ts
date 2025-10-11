import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-button.html'
})
export class FavoriteButtonComponent {
  // Inputs
  readonly isFavorite = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  // Outputs
  readonly toggle = output<void>();

  onToggle(): void {
    if (!this.disabled()) {
      this.toggle.emit();
    }
  }

  get sizeClass(): string {
    const sizes = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl'
    };
    return sizes[this.size()];
  }

  get buttonClass(): string {
    const baseClass = 'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200';
    const disabledClass = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';
    return `${baseClass} ${disabledClass}`;
  }
}
