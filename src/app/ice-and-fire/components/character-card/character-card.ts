import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CharacterSummary } from '../../interfaces/character.interfaces';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-card.html'
})
export class CharacterCardComponent {
  // Inputs
  readonly character = input.required<CharacterSummary>();

  getDetailRoute(): string[] {
    return ['/characters', this.character().id];
  }
}
