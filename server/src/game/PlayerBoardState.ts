export default class PlayerBoardState {
  // amount of gold coins
  stash: number;
  // district card ids
  hand: string[];
  city: string[];

  constructor(initialStash: number, initialHand: string[], initialCity: string[] = []) {
    this.stash = initialStash;
    this.hand = initialHand;
    this.city = initialCity;
  }

  addCardsToHand(cards: string[]) {
    this.hand.push(...cards);
  }

  takeCardFromHand(card: string) {
    const index = this.hand.indexOf(card);
    if (index > -1) {
      return this.hand.splice(index, 1)[0];
    }
    return null;
  }

  exportForPlayer(canSeeHand: boolean) {
    return {
      stash: this.stash,
      hand: canSeeHand ? this.hand : Array(this.hand.length).fill(null),
      city: this.city,
    };
  }
}
