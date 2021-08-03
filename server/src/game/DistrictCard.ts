import { districts } from 'citadels-common';
import { CharacterType } from './CharacterManager';

export enum DistrictType {
  NOBLE = 1,
  RELIGIOUS,
  TRADE,
  MILITARY,
  UNIQUE,
}

export default class DistrictCard {
  id: string;
  type: DistrictType;
  cost: number;
  extraPoints: number;

  constructor(id: string, type: DistrictType, cost: number, extraPoints: number) {
    this.id = id;
    this.type = type;
    this.cost = cost;
    this.extraPoints = extraPoints;
  }

  static getDistrictTypeFromCharacter(character: CharacterType) {
    switch (character) {
      case CharacterType.KING:
        return DistrictType.NOBLE;
      case CharacterType.BISHOP:
        return DistrictType.RELIGIOUS;
      case CharacterType.MERCHANT:
        return DistrictType.TRADE;
      case CharacterType.WARLORD:
        return DistrictType.MILITARY;
      default:
        return undefined;
    }
  }
}

type DistrictsMap = Map<string, { card: DistrictCard, count: number }>;

// create districts Map from JSON
export const ALL_DISTRICTS = Object.keys(districts).reduce(
  (res: DistrictsMap, districtId) => {
    const data = {
      // default values
      count: 1,
      extraPoints: 0,
      // actual values
      ...districts[districtId as keyof typeof districts],
    };
    return res.set(districtId, {
      card: new DistrictCard(districtId, data.type, data.cost, data.extraPoints),
      count: data.count,
    });
  }, new Map(),
);
