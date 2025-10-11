import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HouseSummary } from '../../interfaces/house.interfaces';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-house-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FavoriteButtonComponent],
  templateUrl: './house-card.html'
})
export class HouseCardComponent {
  // Inputs
  readonly house = input.required<HouseSummary>();
  readonly showFavoriteButton = input<boolean>(true);

  // Outputs
  readonly favoriteToggle = output<string>();

  onFavoriteToggle(): void {
    const houseUrl = `${environment.apiBaseUrl}/api/houses/${this.house().id}`;
    this.favoriteToggle.emit(houseUrl);
  }

  getDetailRoute(): string[] {
    return ['/houses', this.house().id];
  }
}
