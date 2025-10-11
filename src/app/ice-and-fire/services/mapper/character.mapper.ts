import { Character, CharacterSummary, FamilyMember } from '../../interfaces/character.interfaces';

export class CharacterMapper {
  static toCharacterSummary(character: Character): CharacterSummary {
    return {
      id: this.extractIdFromUrl(character.url),
      name: character.name || 'Personaje Desconocido',
      gender: character.gender || 'Desconocido',
      culture: character.culture || 'Desconocido',
      titles: character.titles || [],
      houseId: character.allegiances?.[0] ? this.extractIdFromUrl(character.allegiances[0]) : undefined
    };
  }

  static toCharacterSummaries(characters: Character[]): CharacterSummary[] {
    return characters.map(character => this.toCharacterSummary(character));
  }

  static toFamilyMembers(character: Character): FamilyMember[] {
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

  static formatName(name: string): string {
    if (!name || name === '') {
      return 'Personaje Desconocido';
    }
    return name;
  }

  static formatGender(gender: string): string {
    if (!gender || gender === '') {
      return 'Desconocido';
    }
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  }

  static formatCulture(culture: string): string {
    if (!culture || culture === '') {
      return 'Cultura Desconocida';
    }
    return culture;
  }

  static formatBorn(born: string): string {
    if (!born || born === '') {
      return 'Fecha de nacimiento Desconocida';
    }
    return born;
  }

  static formatDied(died: string): string {
    if (!died || died === '') {
      return 'Alive';
    }
    return died;
  }

  static getCharacterStatus(character: Character): string {
    if (character.died && character.died !== '') {
      return `Deceased (${character.died})`;
    }
    return 'Alive';
  }

  static formatTitles(titles: string[]): string[] {
    if (!titles || titles.length === 0) {
      return ['Sin títulos'];
    }
    return titles.filter(title => title && title !== '');
  }

  static formatAliases(aliases: string[]): string[] {
    if (!aliases || aliases.length === 0) {
      return [];
    }
    return aliases.filter(alias => alias && alias !== '');
  }

  private static extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
