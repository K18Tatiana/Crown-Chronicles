import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book, BookSummary } from '../interfaces/book.interfaces';
import { LoadingState } from '../interfaces/api-response.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly cacheTimeout = environment.cacheTimeout;

  private cache = new Map<string, { data: any; timestamp: number }>();

  readonly books = signal<Book[]>([]);
  readonly loading = signal<LoadingState>({ isLoading: false, error: null });

  getAllBooks(page = 1, pageSize = environment.defaultPageSize): Observable<Book[]> {
    const cacheKey = `books-${page}-${pageSize}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return of(cached);
    }

    this.loading.set({ isLoading: true, error: null });

    return this.http.get<Book[]>(`${this.baseUrl}/api/books`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }).pipe(
      map(books => {
        this.setCachedData(cacheKey, books);
        this.books.set(books);
        this.loading.set({ isLoading: false, error: null });
        return books;
      }),
      catchError(error => {
        const errorMessage = 'Failed to fetch books';
        this.loading.set({ isLoading: false, error: errorMessage });
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getBookById(id: string): Observable<Book | null> {
    const cacheKey = `book-${id}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return of(cached);
    }

    this.loading.set({ isLoading: true, error: null });

    return this.http.get<Book>(`${this.baseUrl}/api/books/${id}`).pipe(
      map(book => {
        this.setCachedData(cacheKey, book);
        this.loading.set({ isLoading: false, error: null });
        return book;
      }),
      catchError(error => {
        const errorMessage = 'Failed to fetch book details';
        this.loading.set({ isLoading: false, error: errorMessage });
        return of(null);
      }),
      shareReplay(1)
    );
  }

  getBookByUrl(url: string): Observable<Book | null> {
    const id = this.extractIdFromUrl(url);
    return this.getBookById(id);
  }

  searchBooks(query: string): Observable<Book[]> {
    if (!query.trim()) {
      return of([]);
    }

    const cacheKey = `search-books-${query}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this.http.get<Book[]>(`${this.baseUrl}/api/books`, {
      params: { name: query }
    }).pipe(
      map(books => {
        this.setCachedData(cacheKey, books);
        return books;
      }),
      catchError(error => of([])),
      shareReplay(1)
    );
  }

  loadAllBooks(): Observable<Book[]> {
    return new Observable(observer => {
      const allBooks: Book[] = [];
      let currentPage = 1;
      const pageSize = environment.defaultPageSize;

      const loadPage = () => {
        this.getAllBooks(currentPage, pageSize).subscribe({
          next: (books) => {
            allBooks.push(...books);
            
            // Si recibimos menos de pageSize, hemos llegado al final
            if (books.length < pageSize) {
              observer.next(allBooks);
              observer.complete();
            } else {
              currentPage++;
              loadPage();
            }
          },
          error: (err) => {
            observer.error(err);
          }
        });
      };

      loadPage();
    });
  }

  getBooksByCharacterUrls(characterUrls: string[]): Observable<Book[]> {
    if (characterUrls.length === 0) {
      return of([]);
    }

    return this.loadAllBooks().pipe(
      map(books => {
        return books.filter(book =>
          characterUrls.some(characterUrl =>
            book.characters?.includes(characterUrl) ||
            book.povCharacters?.includes(characterUrl)
          )
        );
      })
    );
  }

  getBookSummaries(books: Book[]): BookSummary[] {
    return books.map(book => ({
      id: this.extractIdFromUrl(book.url),
      name: book.name || 'Libro Desconocido',
      isbn: book.isbn || 'ISBN Desconocido',
      authors: book.authors || ['Autor Desconocido'],
      numberOfPages: book.numberOfPages || 0,
      released: book.released || 'Fecha Desconocida',
      characterCount: (book.characters?.length || 0) + (book.povCharacters?.length || 0),
      characterUrls: [...(book.characters || []), ...(book.povCharacters || [])]
    }));
  }

  private extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}
