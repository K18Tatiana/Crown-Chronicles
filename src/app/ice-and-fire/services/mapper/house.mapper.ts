import { House, HouseSummary } from '../../interfaces/house.interfaces';

export class HouseMapper {
  static toHouseSummary(house: House): HouseSummary {
    return {
      id: this.extractIdFromUrl(house.url),
      name: house.name || 'Casa Desconocida',
      region: house.region || 'Región Desconocida',
      coatOfArms: house.coatOfArms || 'Sin escudo de armas',
      words: house.words || 'Sin lema',
      memberCount: house.swornMembers?.length || 0,
      isFavorite: this.isFavorite(house.url)
    };
  }

  static toHouseSummaries(houses: House[]): HouseSummary[] {
    return houses.map(house => this.toHouseSummary(house));
  }

  static formatCoatOfArms(coatOfArms: string): string {
    if (!coatOfArms || coatOfArms === '') {
      return 'Sin escudo de armas';
    }
    return coatOfArms;
  }

  static formatWords(words: string): string {
    if (!words || words === '') {
      return 'Sin lema';
    }
    return words;
  }

  static formatRegion(region: string): string {
    if (!region || region === '') {
      return 'Región Desconocida';
    }
    return region;
  }

  static formatFounded(founded: string): string {
    if (!founded || founded === '') {
      return 'Fecha de fundación Desconocida';
    }
    return founded;
  }

  static getHouseStatus(house: House): string {
    if (house.diedOut && house.diedOut !== '') {
      return `Extinta (${house.diedOut})`;
    }
    return 'Activa';
  }

  private static extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  private static isFavorite(url: string): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(url);
  }

  private static getFavorites(): string[] {
    const stored = localStorage.getItem('house-favorites');
    return stored ? JSON.parse(stored) : [];
  }
}
