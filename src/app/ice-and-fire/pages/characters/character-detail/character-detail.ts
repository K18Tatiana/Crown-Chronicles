import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CharacterService } from '../../../services/character.service';
import { BookService } from '../../../services/book.service';
import { Character } from '../../../interfaces/character.interfaces';
import { Book } from '../../../interfaces/book.interfaces';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-character-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './character-detail.html'
})
export class CharacterDetailPageComponent implements OnInit {
  private readonly characterService = inject(CharacterService);
  private readonly bookService = inject(BookService);
  readonly route = inject(ActivatedRoute);

  readonly character = signal<Character | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  
  // Family members data
  readonly father = signal<Character | null>(null);
  readonly mother = signal<Character | null>(null);
  readonly spouse = signal<Character | null>(null);
  
  // Character books data
  readonly characterBooks = signal<Book[]>([]);
  readonly isLoadingBooks = signal<boolean>(false);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const characterId = params['id'];
      if (characterId) {
        this.loadCharacter(characterId);
      }
    });
  }

  loadCharacter(characterId: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.characterService.getCharacterById(characterId).subscribe({
      next: (character) => {
        if (character) {
          this.character.set(character);
          this.loadRelatedCharacters(character);
          this.loadBooksForCharacter(character.url);
        } else {
          this.error.set('Personaje no encontrado');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los detalles del personaje');
        this.isLoading.set(false);
      }
    });
  }

  loadRelatedCharacters(character: Character) {
    // Cargar datos específicos de familiares
    const familyUrls: string[] = [];
    
    if (character.father) familyUrls.push(character.father);
    if (character.mother) familyUrls.push(character.mother);
    if (character.spouse) familyUrls.push(character.spouse);

    if (familyUrls.length > 0) {
      this.characterService.getCharactersByUrls(familyUrls).subscribe({
        next: (familyMembers) => {
          familyMembers.forEach(member => {
            if (character.father && member.url === character.father) {
              this.father.set(member);
            }
            if (character.mother && member.url === character.mother) {
              this.mother.set(member);
            }
            if (character.spouse && member.url === character.spouse) {
              this.spouse.set(member);
            }
          });
        },
        error: (err) => {
        }
      });
    }
  }

  loadBooksForCharacter(characterUrl: string) {
    this.isLoadingBooks.set(true);
    
    this.bookService.getBooksByCharacterUrls([characterUrl]).subscribe({
      next: (books) => {
        this.characterBooks.set(books);
        this.isLoadingBooks.set(false);
      },
      error: (err) => {
        this.characterBooks.set([]);
        this.isLoadingBooks.set(false);
      }
    });
  }

  extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
