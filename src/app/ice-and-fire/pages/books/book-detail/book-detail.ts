import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BookService } from '../../../services/book.service';
import { CharacterService } from '../../../services/character.service';
import { BookMapper } from '../../../services/mapper/book.mapper';
import { Book } from '../../../interfaces/book.interfaces';
import { Character } from '../../../interfaces/character.interfaces';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner';
import { PaginationComponent } from '../../../components/pagination/pagination';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-book-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, PaginationComponent],
  templateUrl: './book-detail.html'
})
export class BookDetailPageComponent implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly characterService = inject(CharacterService);
  readonly route = inject(ActivatedRoute);

  readonly book = signal<Book | null>(null);
  readonly characters = signal<Character[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Paginación
  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = environment.defaultPageSize;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const bookId = params['id'];
      if (bookId) {
        this.loadBook(bookId);
      }
    });
  }

  loadBook(bookId: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.bookService.getBookById(bookId).subscribe({
      next: (book) => {
        if (book) {
          this.book.set(book);
          this.loadCharactersInBook(book);
        } else {
          this.error.set('Libro no encontrado');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los detalles del libro');
        this.isLoading.set(false);
      }
    });
  }

  loadCharactersInBook(book: Book) {
    if (!book.characters || book.characters.length === 0) {
      this.characters.set([]);
      return;
    }

    // Cargar personajes específicos del libro usando sus URLs
    this.characterService.getCharactersByUrls(book.characters).subscribe({
      next: (bookCharacters) => {
        this.characters.set(bookCharacters);
        this.currentPage.set(1); // Resetear a la primera página
      },
      error: (err) => {
      }
    });
  }

  formatDate(dateString: string): string {
    return BookMapper.formatReleased(dateString);
  }

  formatPages(pages: number): string {
    return BookMapper.formatNumberOfPages(pages);
  }

  getCharacterHouse(character: Character): string {
    if (character.allegiances && character.allegiances.length > 0) {
      const houseUrl = character.allegiances[0];
      const houseId = houseUrl.split('/').pop();
      return `Casa ${houseId}`;
    }
    return 'Sin casa conocida';
  }

  // Métodos de paginación
  get totalPages(): number {
    return Math.ceil(this.characters().length / this.itemsPerPage);
  }

  get paginatedCharacters(): Character[] {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.characters().slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
