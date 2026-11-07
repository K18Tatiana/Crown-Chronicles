import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookSummary } from '../../interfaces/book.interfaces';
import { Character } from '../../interfaces/character.interfaces';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-card.html'
})
export class BookCardComponent {
  // Inputs
  readonly book = input.required<BookSummary>();
  readonly characters = input<Character[]>([]);

  getDetailRoute(): string[] {
    return ['/books', this.book().id];
  }

  getCharactersInBook(): Character[] {
    if (!this.book().characterUrls || this.book().characterUrls.length === 0) {
      return [];
    }

    return this.characters().filter(character =>
      this.book().characterUrls?.includes(character.url)
    ).slice(0, 5); // Mostrar solo los primeros 5 personajes
  }

  getCharacterCount(): number {
    return this.book().characterCount;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPages(pages: number): string {
    return `${pages.toLocaleString()} páginas`;
  }
}
