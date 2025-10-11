import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CharacterService } from '../../services/character.service';
import { BookMapper } from '../../services/mapper/book.mapper';
import { Book, BookSummary } from '../../interfaces/book.interfaces';
import { Character } from '../../interfaces/character.interfaces';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner';
import { SearchBarComponent } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, SearchBarComponent],
  templateUrl: './books.html'
})
export class BooksPageComponent implements OnInit {
  private readonly bookService = inject(BookService);
  private readonly characterService = inject(CharacterService);

  readonly books = signal<Book[]>([]);
  readonly filteredBooks = signal<Book[]>([]);
  readonly characters = signal<Character[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal<string>('');

  readonly bookSummaries = computed(() => {
    return BookMapper.toBookSummaries(this.filteredBooks());
  });

  ngOnInit() {
    this.loadBooks();
    this.loadCharacters();
  }

  loadBooks() {
    this.isLoading.set(true);
    this.error.set(null);

    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books.set(books);
        this.filteredBooks.set(books);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los libros');
        this.isLoading.set(false);
      }
    });
  }

  loadCharacters() {
    this.characterService.getAllCharacters().subscribe({
      next: (characters) => {
        this.characters.set(characters);
      },
      error: (err) => {
      }
    });
  }

  onSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm);

    if (!searchTerm.trim()) {
      this.filteredBooks.set(this.books());
      return;
    }

    const filtered = this.books().filter(book =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.some(author =>
        author.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.filteredBooks.set(filtered);
  }

  getCharactersInBook(book: Book): Character[] {
    if (!book.characters || book.characters.length === 0) {
      return [];
    }

    return this.characters().filter(character =>
      book.characters?.includes(character.url)
    ).slice(0, 5); // Mostrar solo los primeros 5 personajes
  }

  getCharacterCount(book: Book): number {
    return book.characters?.length || 0;
  }

  formatDate(dateString: string): string {
    return BookMapper.formatReleased(dateString);
  }

  formatPages(pages: number): string {
    return BookMapper.formatNumberOfPages(pages);
  }
}
