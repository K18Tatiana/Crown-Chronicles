export interface Book {
  url: string;
  name: string;
  isbn: string;
  authors: string[];
  numberOfPages: number;
  publisher: string;
  country: string;
  mediaType: string;
  released: string;
  characters: string[];
  povCharacters: string[];
}

export interface BookSummary {
  id: string;
  name: string;
  authors: string[];
  released: string;
  characterCount: number;
}
