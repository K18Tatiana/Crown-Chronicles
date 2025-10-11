export interface House {
  url: string;
  name: string;
  region: string;
  coatOfArms: string;
  words: string;
  titles: string[];
  seats: string[];
  currentLord: string;
  heir: string;
  overlord: string;
  founded: string;
  founder: string;
  diedOut: string;
  ancestralWeapons: string[];
  cadetBranches: string[];
  swornMembers: string[];
}

export interface HouseSummary {
  id: string;
  name: string;
  region: string;
  coatOfArms: string;
  words: string;
  memberCount: number;
  isFavorite: boolean;
}
