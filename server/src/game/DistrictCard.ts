import districtsJson from '../data/districts.json';

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
}

type DistrictsMap = Map<string, { card: DistrictCard, count: number }>;

// create districts Map from JSON
export const ALL_DISTRICTS = Object.keys(districtsJson).reduce(
  (res: DistrictsMap, districtId) => {
    const data = {
      // default values
      count: 1,
      extraPoints: 0,
      // actual values
      ...districtsJson[districtId as keyof typeof districtsJson],
    };
    return res.set(districtId, {
      card: new DistrictCard(districtId, data.type, data.cost, data.extraPoints),
      count: data.count,
    });
  }, new Map(),
);