import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/houses',
    pathMatch: 'full'
  },
  {
    path: 'houses',
    loadComponent: () => import('./ice-and-fire/pages/houses/houses').then(m => m.HousesPageComponent)
  },
  {
    path: 'houses/:id',
    loadComponent: () => import('./ice-and-fire/pages/houses/house-detail/house-detail').then(m => m.HouseDetailPageComponent)
  },
  {
    path: 'characters',
    loadComponent: () => import('./ice-and-fire/pages/characters/characters').then(m => m.CharactersPageComponent)
  },
  {
    path: 'characters/:id',
    loadComponent: () => import('./ice-and-fire/pages/characters/character-detail/character-detail').then(m => m.CharacterDetailPageComponent)
  },
  {
    path: 'books',
    loadComponent: () => import('./ice-and-fire/pages/books/books').then(m => m.BooksPageComponent)
  },
  {
    path: 'books/:id',
    loadComponent: () => import('./ice-and-fire/pages/books/book-detail/book-detail').then(m => m.BookDetailPageComponent)
  },
  {
    path: '**',
    redirectTo: '/houses'
  }
];
