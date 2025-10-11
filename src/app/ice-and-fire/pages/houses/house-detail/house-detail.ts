import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HouseService } from '../../../services/house.service';
import { CharacterService } from '../../../services/character.service';
import { House } from '../../../interfaces/house.interfaces';
import { Character } from '../../../interfaces/character.interfaces';
import { HouseMapper } from '../../../services/mapper/house.mapper';
import { CharacterMapper } from '../../../services/mapper/character.mapper';
import { FavoriteButtonComponent } from '../../../components/favorite-button/favorite-button';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-house-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FavoriteButtonComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './house-detail.html'
})
export class HouseDetailPageComponent implements OnInit {
  private readonly houseService = inject(HouseService);
  private readonly characterService = inject(CharacterService);
  readonly route = inject(ActivatedRoute);

  readonly house = signal<House | null>(null);
  readonly houseMembers = signal<Character[]>([]);
  readonly founder = signal<Character | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const houseId = params['id'];
      if (houseId) {
        this.loadHouse(houseId);
      }
    });
  }

  loadHouse(houseId: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.houseService.getHouseById(houseId).subscribe({
      next: (house) => {
        if (house) {
          this.house.set(house);
          this.loadHouseMembers(house);
          this.loadFounder(house);
        } else {
          this.error.set('Casa no encontrada');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.error.set('Error al cargar los detalles de la casa');
        this.isLoading.set(false);
      }
    });
  }

  loadHouseMembers(house: House) {
    if (!house.swornMembers || house.swornMembers.length === 0) {
      this.isLoading.set(false);
      return;
    }

    this.characterService.getCharactersByUrls(house.swornMembers).subscribe({
      next: (characters) => {
        this.houseMembers.set(characters);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
      }
    });
  }

  loadFounder(house: House) {
    if (house.founder) {
      this.characterService.getCharacterByUrl(house.founder).subscribe({
        next: (founder) => {
          this.founder.set(founder);
        },
        error: (err) => {
        }
      });
    }
  }

  toggleFavorite() {
    const house = this.house();
    if (house) {
      this.houseService.toggleFavorite(house.url);
      this.house.set({ ...house });
    }
  }

  isFavorite(): boolean {
    const house = this.house();
    if (!house) return false;

    return this.houseService.isFavorite(house.url);
  }

  // Mapper methods
  formatFounded(founded: string): string {
    return HouseMapper.formatFounded(founded);
  }

  formatCoatOfArms(coatOfArms: string): string {
    return HouseMapper.formatCoatOfArms(coatOfArms);
  }

  formatWords(words: string): string {
    return HouseMapper.formatWords(words);
  }

  getHouseStatus(house: House): string {
    return HouseMapper.getHouseStatus(house);
  }

  formatCharacterName(name: string): string {
    return CharacterMapper.formatName(name);
  }
}
