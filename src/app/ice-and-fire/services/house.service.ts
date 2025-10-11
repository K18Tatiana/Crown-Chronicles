import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { House, HouseSummary } from '../interfaces/house.interfaces';
import { LoadingState } from '../interfaces/api-response.interfaces';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly cacheTimeout = environment.cacheTimeout;

  private cache = new Map<string, { data: any; timestamp: number }>();

  readonly houses = signal<House[]>([]);
  readonly loading = signal<LoadingState>({ isLoading: false, error: null });

  getAllHouses(page = 1, pageSize = environment.defaultPageSize): Observable<House[]> {
    const cacheKey = `houses-${page}-${pageSize}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return of(cached);
    }

    this.loading.set({ isLoading: true, error: null });

    return this.http.get<House[]>(`${this.baseUrl}/api/houses`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }).pipe(
      map(houses => {
        this.setCachedData(cacheKey, houses);
        this.houses.set(houses);
        this.loading.set({ isLoading: false, error: null });
        return houses;
      }),
      catchError(error => {
        const errorMessage = 'Failed to fetch houses';
        this.loading.set({ isLoading: false, error: errorMessage });
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getHouseById(id: string): Observable<House | null> {
    const cacheKey = `house-${id}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return of(cached);
    }

    this.loading.set({ isLoading: true, error: null });

    return this.http.get<House>(`${this.baseUrl}/api/houses/${id}`).pipe(
      map(house => {
        this.setCachedData(cacheKey, house);
        this.loading.set({ isLoading: false, error: null });
        return house;
      }),
      catchError(error => {
        const errorMessage = 'Failed to fetch house details';
        this.loading.set({ isLoading: false, error: errorMessage });
        return of(null);
      }),
      shareReplay(1)
    );
  }

  getHouseByUrl(url: string): Observable<House | null> {
    const id = this.extractIdFromUrl(url);
    return this.getHouseById(id);
  }

  searchHouses(query: string): Observable<House[]> {
    if (!query.trim()) {
      return of([]);
    }

    const cacheKey = `search-houses-${query}`;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return of(cached);
    }

    return this.http.get<House[]>(`${this.baseUrl}/api/houses`, {
      params: { name: query }
    }).pipe(
      map(houses => {
        this.setCachedData(cacheKey, houses);
        return houses;
      }),
      catchError(error => of([])),
      shareReplay(1)
    );
  }

  getHouseSummaries(houses: House[]): HouseSummary[] {
    return houses.map(house => ({
      id: this.extractIdFromUrl(house.url),
      name: house.name || 'Casa Desconocida',
      region: house.region || 'Región Desconocida',
      coatOfArms: house.coatOfArms || 'Sin escudo de armas',
      words: house.words || 'Sin lema',
      memberCount: house.swornMembers?.length || 0,
      isFavorite: this.isFavorite(house.url)
    }));
  }

  extractIdFromUrl(url: string): string {
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

  isFavorite(url: string): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(url);
  }

  private getFavorites(): string[] {
    const stored = localStorage.getItem('house-favorites');
    return stored ? JSON.parse(stored) : [];
  }

  toggleFavorite(url: string): void {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(url);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(url);
    }

    localStorage.setItem('house-favorites', JSON.stringify(favorites));
  }

  /**
   * Carga todas las casas disponibles haciendo múltiples peticiones
   */
  loadAllHouses(): Observable<House[]> {
    return new Observable(observer => {
      const allHouses: House[] = [];
      let currentPage = 1;
      const pageSize = environment.defaultPageSize;

      const loadPage = () => {
        this.getAllHouses(currentPage, pageSize).subscribe({
          next: (houses) => {
            allHouses.push(...houses);
            
            // Si recibimos menos de pageSize, hemos llegado al final
            if (houses.length < pageSize) {
              observer.next(allHouses);
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
