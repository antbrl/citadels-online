import { ALL_DISTRICTS } from './DistrictCard';

export default class DistrictsDeck {
  cards: string[];

  constructor() {
    // create an array with all district card ids
    // each card is added its count number of times
    this.cards = Array.from(ALL_DISTRICTS.keys()).reduce(
      (res, districtId) => res.concat(
        ...Array(ALL_DISTRICTS.get(districtId)?.count || 0).fill(districtId),
      ), [],
    );

    this.shuffleCards();
  }

  shuffleCards() {
    let i: number;
    let j: number;
    let tmp: string;

    for (i = this.cards.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      tmp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = tmp;
    }
  }

  drawCards(n: number) {
    return this.cards.splice(-n, n);
  }

  discardCards(cards: string[]) {
    this.cards.unshift(...cards);
  }
}
