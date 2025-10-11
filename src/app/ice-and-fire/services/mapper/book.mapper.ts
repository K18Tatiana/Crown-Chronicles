import { Book, BookSummary } from '../../interfaces/book.interfaces';

export class BookMapper {
  static toBookSummary(book: Book): BookSummary {
    return {
      id: this.extractIdFromUrl(book.url),
      name: book.name || 'Libro Desconocido',
      authors: book.authors || ['Autor Desconocido'],
      released: book.released || 'Fecha Desconocida',
      characterCount: (book.characters?.length || 0) + (book.povCharacters?.length || 0)
    };
  }

  static toBookSummaries(books: Book[]): BookSummary[] {
    return books.map(book => this.toBookSummary(book));
  }

  static formatName(name: string): string {
    if (!name || name === '') {
      return 'Libro Desconocido';
    }
    return name;
  }

  static formatAuthors(authors: string[]): string {
    if (!authors || authors.length === 0) {
      return 'Autor Desconocido';
    }
    return authors.join(', ');
  }

  static formatReleased(released: string): string {
    if (!released || released === '') {
      return 'Fecha de publicación desconocida';
    }

    try {
      const date = new Date(released);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return released;
    }
  }

  static formatNumberOfPages(numberOfPages: number): string {
    if (!numberOfPages || numberOfPages === 0) {
      return 'Número de páginas desconocido';
    }
    return `${numberOfPages.toLocaleString('es-ES')} páginas`;
  }

  static formatPublisher(publisher: string): string {
    if (!publisher || publisher === '') {
      return 'Unknown Publisher';
    }
    return publisher;
  }

  static formatCountry(country: string): string {
    if (!country || country === '') {
      return 'Unknown Country';
    }
    return country;
  }

  static formatMediaType(mediaType: string): string {
    if (!mediaType || mediaType === '') {
      return 'Unknown Media Type';
    }
    return mediaType.charAt(0).toUpperCase() + mediaType.slice(1);
  }

  static getCharacterAppearances(book: Book): number {
    const characters = book.characters?.length || 0;
    const povCharacters = book.povCharacters?.length || 0;
    return characters + povCharacters;
  }

  private static extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
