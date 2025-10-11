import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Character, CharacterSummary, FamilyMember } from '../interfaces/character.interfaces';
import { LoadingState } from '../interfaces/api-response.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly cacheTimeout = environment.cacheTimeout;

  private cache = new Map<string, { data: any; timestamp: number }>();

  readonly characters = signal<Character[]>([]);
  readonly loading = signal<LoadingState>({ isLoading: false, error: null });

  getAllCharacters(page = 1, pageSize = environment.defaultPageSize): Observable<Character[]> {
    const cacheKey = `characters-${page}-${pageSize}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return of(cached);
    }

    this.loading.set({ isLoading: true, error: null });

    return this.http.get<Character[]>(`${this.baseUrl}/api/characters`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }).pipe(
      map(characters => {
        this.setCachedData(cacheKey, characters);
        this.characters.set(characters);
        this.loading.set({ isLoading: false, error: null });
        return characters;
      }),
      catchError(error => {
        const errorMessage = 'Failed to fetch characters';
        this.loading.set({ isLoading: false, error: errorMessage });
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getCharacterById(id: string): Observable<Character | null> {
    const cacheKey = `character-${id}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return of(cached);
    }

    this.loading.set({ isLoading: true, error: null });

    return this.http.get<Character>(`${this.baseUrl}/api/characters/${id}`).pipe(
      map(character => {
        this.setCachedData(cacheKey, character);
        this.loading.set({ isLoading: false, error: null });
        return character;
      }),
      catchError(error => {
        const errorMessage = 'Failed to fetch character details';
        this.loading.set({ isLoading: false, error: errorMessage });
        return of(null);
      }),
      shareReplay(1)
    );
  }

  getCharacterByUrl(url: string): Observable<Character | null> {
    const id = this.extractIdFromUrl(url);
    return this.getCharacterById(id);
  }

  searchCharacters(query: string): Observable<Character[]> {
    if (!query.trim()) {
      return of([]);
    }

    const cacheKey = `search-characters-${query}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this.http.get<Character[]>(`${this.baseUrl}/api/characters`, {
      params: { name: query }
    }).pipe(
      map(characters => {
        this.setCachedData(cacheKey, characters);
        return characters;
      }),
      catchError(error => of([])),
      shareReplay(1)
    );
  }

  getCharacterSummaries(characters: Character[]): CharacterSummary[] {
    return characters.map(character => ({
      id: this.extractIdFromUrl(character.url),
      name: character.name || 'Personaje Desconocido',
      gender: character.gender || 'Desconocido',
      culture: character.culture || 'Desconocido',
      titles: character.titles || [],
      houseId: character.allegiances?.[0] ? this.extractIdFromUrl(character.allegiances[0]) : undefined
    }));
  }

  getFamilyMembers(character: Character): FamilyMember[] {
    const family: FamilyMember[] = [];

    if (character.father) {
      family.push({
        id: this.extractIdFromUrl(character.father),
        name: 'Father',
        relationship: 'father',
        url: character.father
      });
    }

    if (character.mother) {
      family.push({
        id: this.extractIdFromUrl(character.mother),
        name: 'Mother',
        relationship: 'mother',
        url: character.mother
      });
    }

    if (character.spouse) {
      family.push({
        id: this.extractIdFromUrl(character.spouse),
        name: 'Spouse',
        relationship: 'spouse',
        url: character.spouse
      });
    }

    return family;
  }

  getCharactersByUrls(urls: string[]): Observable<Character[]> {
    if (urls.length === 0) {
      return of([]);
    }

    const requests = urls.map(url => this.getCharacterByUrl(url));

    return new Observable(observer => {
      const characters: Character[] = [];
      let completed = 0;

      requests.forEach(request => {
        request.subscribe({
          next: character => {
            if (character) {
              characters.push(character);
            }
            completed++;

            if (completed === requests.length) {
              observer.next(characters);
              observer.complete();
            }
          },
          error: error => {
            completed++;
            if (completed === requests.length) {
              observer.next(characters);
              observer.complete();
            }
          }
        });
      });
    });
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

  /**
   * Carga todos los personajes disponibles haciendo múltiples peticiones
   */
  loadAllCharacters(): Observable<Character[]> {
    return new Observable(observer => {
      const allCharacters: Character[] = [];
      let currentPage = 1;
      const pageSize = environment.defaultPageSize;

      const loadPage = () => {
        this.getAllCharacters(currentPage, pageSize).subscribe({
          next: (characters) => {
            allCharacters.push(...characters);
            
            // Si recibimos menos de pageSize, hemos llegado al final
            if (characters.length < pageSize) {
              observer.next(allCharacters);
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
}
