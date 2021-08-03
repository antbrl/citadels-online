import { DistrictId, PlayerBoard, PlayerScore } from 'citadels-common';
import { CharacterType } from './CharacterManager';
import DistrictCard, { ALL_DISTRICTS } from './DistrictCard';

export default class PlayerBoardState {
  // amount of gold coins
  stash: number;
  // district card ids
  hand: DistrictId[];
  city: DistrictId[];
  tmpHand: DistrictId[];
  score: PlayerScore;
  firstToCompleteCity: boolean;

  constructor(initialStash: number, initialHand: DistrictId[], initialCity: DistrictId[] = []) {
    this.stash = initialStash;
    this.hand = initialHand;
    this.city = initialCity;
    this.tmpHand = [];
    this.score = {};
    this.firstToCompleteCity = false;
  }

  hasCardInCity(card: DistrictId): boolean {
    return this.city.includes(card);
  }

  addCardsToHand(cards: DistrictId[]) {
    this.hand.push(...cards);
  }

  takeCardFromHand(card: DistrictId) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      return this.hand.splice(index, 1)[0];
    }
    return null;
  }

  buildDistrict(card: DistrictId): boolean {
    if (!this.hand.includes(card)) {
      return false;
    }

    // check price
    const price = ALL_DISTRICTS.get(card)?.card.cost;
    if (price === undefined || price > this.stash) {
      return false;
    }

    // take coins from stash
    this.stash -= price;

    // move card
    this.takeCardFromHand(card);
    this.city.push(card);

    return true;
  }

  computeEarningsForCharacter(character: CharacterType): number {
    const districtType = DistrictCard.getDistrictTypeFromCharacter(character);

    const earnings = districtType === undefined ? 0 : this.city.filter((card) => (
      ALL_DISTRICTS.get(card)?.card.type === districtType
    )).length;
    const extraEarnings = this.city.includes('school_of_magic') ? 1 : 0;

    return earnings + extraEarnings;
  }

  computeDestroyCost(card: DistrictId): number {
    const discount = (this.hasCardInCity('great_wall') && card !== 'great_wall') ? 0 : 1;
    return (ALL_DISTRICTS.get(card)?.card.cost ?? discount) - discount;
  }

  destroyDistrict(card: DistrictId) {
    const index = this.city.indexOf(card);
    if (index > -1) {
      this.city.splice(index, 1);
    }
  }

  exportForPlayer(canSeeHand: boolean): PlayerBoard {
    return {
      stash: this.stash,
      hand: canSeeHand ? this.hand : Array(this.hand.length).fill(null),
      tmpHand: canSeeHand ? this.tmpHand : Array(this.tmpHand.length).fill(null),
      city: this.city,
      score: this.score,

      // characters are not known from this scope
      characters: [],
    };
  }

  computeScore(completeCitySize: number) {
    this.score.base = this.city.reduce((previousValue, currentValue) => {
      const card = ALL_DISTRICTS.get(currentValue)?.card;
      return previousValue + (card?.cost ?? 0) + (card?.extraPoints ?? 0);
    }, 0);
    if (this.city.length >= completeCitySize) {
      this.score.extraPointsCompleteCity = this.firstToCompleteCity ? 4 : 2;
    }
    if (this.city.includes('imperial_treasury')) {
      this.score.extraPointsStash = this.stash;
    }
    if (this.city.includes('map_room')) {
      this.score.extraPointsHand = this.hand.length;
    }

    const districtTypes = new Set(this.city.filter((card) => card !== 'haunted_quarter').map((card) => ALL_DISTRICTS.get(card)?.card.type).filter((type) => type !== undefined)).size;
    const hasHauntedQuarter = this.city.includes('haunted_quarter');

    if (districtTypes + (hasHauntedQuarter ? 1 : 0) >= 5) {
      this.score.extraPointsDistrictTypes = 3;
    }

    this.score.total = this.score.base
      + (this.score.extraPointsCompleteCity ?? 0)
      + (this.score.extraPointsStash ?? 0)
      + (this.score.extraPointsHand ?? 0)
      + (this.score.extraPointsDistrictTypes ?? 0);
  }
}
