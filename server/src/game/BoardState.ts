import CharacterManager from './CharacterManager';
import DistrictsDeck from './DistrictsDeck';
import { PlayerPosition } from './Player';
import PlayerBoardState from './PlayerBoardState';

export enum GamePhase {
  INITIAL = 0,
  CHOOSE_CHARACTERS,
  DO_ACTIONS,
}

export default class BoardState {
  // player city, hand and stash
  players: Map<string, PlayerBoardState>;

  // player order, first player has the crown
  playerOrder: Array<string>;

  // character manager
  characterManager: CharacterManager;

  // current turn phase
  turnPhase: GamePhase;

  // district cards deck
  districtsDeck: DistrictsDeck;

  constructor(players: string[]) {
    this.players = new Map();
    this.playerOrder = [...players];
    this.characterManager = new CharacterManager(players.length);
    this.turnPhase = GamePhase.INITIAL;
    this.districtsDeck = new DistrictsDeck();

    // initialize each player hand with 2 gold and 4 district cards
    console.log('create board state for', players);
    players.forEach((playerId) => {
      this.players.set(playerId, new PlayerBoardState(2, this.districtsDeck.drawCards(4)));
    });
  }

  exportForPlayer(destPlayerId: string) {
    // whether the player can see all hands
    const destPlayerPos = Array.from(this.players.keys()).indexOf(destPlayerId) as PlayerPosition;
    const seesAll = destPlayerPos === PlayerPosition.SPECTATOR;

    return {
      players: Array.from(this.players).map((elem) => {
        const playerId = elem[0];
        const board = elem[1];
        const canSeeHand = seesAll || playerId === destPlayerId;
        const otherPlayerPos = this.playerOrder.indexOf(playerId) as PlayerPosition;
        return [playerId, {
          ...board.exportForPlayer(canSeeHand),
          characters: this.characterManager.exportPlayerCharacters(otherPlayerPos, destPlayerPos),
        }];
      }),
      turnPhase: this.turnPhase,
      playerOrder: this.playerOrder,
      currentPlayer: this.getCurrentPlayerPosition(),
      crown: this.playerOrder[0],
      characters: this.characterManager.exportCharactersList(destPlayerPos),
    };
  }

  // current player (index of playerOrder)
  getCurrentPlayerPosition(): PlayerPosition {
    switch (this.turnPhase) {
      case GamePhase.CHOOSE_CHARACTERS:
        return this.characterManager.choosingState.getState().player;

      default:
    }
    return PlayerPosition.SPECTATOR;
  }

  getCurrentPlayerId() {
    return this.playerOrder[this.getCurrentPlayerPosition()];
  }
}
