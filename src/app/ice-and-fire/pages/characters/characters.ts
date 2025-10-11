import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../interfaces/character.interfaces';
import { CharacterMapper } from '../../services/mapper/character.mapper';
import { environment } from '../../../../environments/environment';
import { SearchBarComponent } from '../../components/search-bar/search-bar';
import { CharacterCardComponent } from '../../components/character-card/character-card';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner';
import { PaginationComponent } from '../../components/pagination/pagination';

@Component({
  selector: 'app-characters-page',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    CharacterCardComponent,
    LoadingSpinnerComponent,
    PaginationComponent
  ],
  templateUrl: './characters.html'
})
export class CharactersPageComponent implements OnInit {
  private readonly characterService = inject(CharacterService);

  readonly characters = signal<Character[]>([]);
  readonly filteredCharacters = signal<Character[]>([]);
  readonly searchQuery = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Paginación
  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = environment.defaultPageSize;

  readonly characterSummaries = computed(() => {
    return CharacterMapper.toCharacterSummaries(this.filteredCharacters());
  });

  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters() {
    this.isLoading.set(true);
    this.error.set(null);

    this.characterService.loadAllCharacters().subscribe({
      next: (characters) => {
        this.characters.set(characters);
        this.filteredCharacters.set(characters);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los personajes. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);

    if (!query.trim()) {
      this.filteredCharacters.set(this.characters());
    } else {
      const filtered = this.characters().filter(character =>
        character.name.toLowerCase().includes(query.toLowerCase()) ||
        character.culture.toLowerCase().includes(query.toLowerCase()) ||
        (character.titles && character.titles.some(title =>
          title.toLowerCase().includes(query.toLowerCase())
        ))
      );
      this.filteredCharacters.set(filtered);
    }

    this.currentPage.set(1); // Resetear a la primera página
  }

  // Métodos de paginación
  get totalPages(): number {
    return Math.ceil(this.filteredCharacters().length / this.itemsPerPage);
  }

  get paginatedCharacters(): any[] {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.characterSummaries().slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
