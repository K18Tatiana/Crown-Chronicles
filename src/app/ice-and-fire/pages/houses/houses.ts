import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HouseService } from '../../services/house.service';
import { House } from '../../interfaces/house.interfaces';
import { HouseMapper } from '../../services/mapper/house.mapper';
import { environment } from '../../../../environments/environment';
import { SearchBarComponent } from '../../components/search-bar/search-bar';
import { HouseCardComponent } from '../../components/house-card/house-card';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner';
import { PaginationComponent } from '../../components/pagination/pagination';

@Component({
  selector: 'app-houses-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchBarComponent,
    HouseCardComponent,
    LoadingSpinnerComponent,
    PaginationComponent
  ],
  templateUrl: './houses.html'
})
export class HousesPageComponent implements OnInit {
  private readonly houseService = inject(HouseService);

  readonly houses = signal<House[]>([]);
  readonly filteredHouses = signal<House[]>([]);
  readonly searchQuery = signal<string>('');
  readonly showFavoritesOnly = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Paginación
  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = environment.defaultPageSize;

  readonly houseSummaries = computed(() => {
    return HouseMapper.toHouseSummaries(this.filteredHouses());
  });

  ngOnInit() {
    this.loadHouses();
  }

  loadHouses() {
    this.isLoading.set(true);
    this.error.set(null);

    this.houseService.loadAllHouses().subscribe({
      next: (houses) => {
        this.houses.set(houses);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las casas. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.applyFilters();
  }

  onFavoriteToggle(url: string) {
    this.houseService.toggleFavorite(url);
    this.applyFilters();
  }

  toggleFavoritesFilter() {
    this.showFavoritesOnly.set(!this.showFavoritesOnly());
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.houses()];

    // Aplicar filtro de favoritos
    if (this.showFavoritesOnly()) {
      filtered = filtered.filter(house => this.houseService.isFavorite(house.url));
    }

    // Aplicar filtro de búsqueda
    const query = this.searchQuery();
    if (query.trim()) {
      filtered = filtered.filter(house =>
        house.name.toLowerCase().includes(query.toLowerCase()) ||
        house.region.toLowerCase().includes(query.toLowerCase()) ||
        (house.words && house.words.toLowerCase().includes(query.toLowerCase()))
      );
    }

    this.filteredHouses.set(filtered);
    this.currentPage.set(1); // Resetear a la primera página
  }

  // Métodos de paginación
  get totalPages(): number {
    return Math.ceil(this.filteredHouses().length / this.itemsPerPage);
  }

  get paginatedHouses(): any[] {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.houseSummaries().slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
