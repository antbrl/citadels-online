import DistrictsDeck from './DistrictsDeck';
import Player, { PlayerRole } from './Player';
import PlayerBoardState from './PlayerBoardState';

export enum CharacterType {
  NONE = 0,
  ASSASSIN,
  THIEF,
  MAGICIAN,
  KING,
  BISHOP,
  MERCHANT,
  ARCHITECT,
  WARLORD,
}

export default class BoardState {
  // player city, hand and stash
  players: Map<string, PlayerBoardState>;

  // player id of the crown owner
  crown: string;

  // turn progress state
  currentCharacter: CharacterType;

  // district cards deck
  districtsDeck: DistrictsDeck;

  constructor(players: string[]) {
    this.players = new Map();
    [this.crown] = players; // first player gets the crown
    this.currentCharacter = CharacterType.NONE;
    this.districtsDeck = new DistrictsDeck();

    // initialize each player hand with 2 gold and 4 district cards
    console.log('create board state for', players);
    players.forEach((playerId) => {
      this.players.set(playerId, new PlayerBoardState(2, this.districtsDeck.drawCards(4)));
    });
  }

  exportForPlayer(player: Player | undefined) {
    if (player === undefined) { return undefined; }

    // whether the player can see all hands
    const seesAll = player.role === PlayerRole.SPECTATOR;

    return {
      players: Array.from(this.players).map((elem) => {
        const playerId = elem[0];
        const board = elem[1];
        const canSeeHand = seesAll || playerId === player.id;
        return [playerId, board.exportForPlayer(canSeeHand)];
      }),
      crown: this.crown,
      currentCharacter: this.currentCharacter,
    };
  }
}
