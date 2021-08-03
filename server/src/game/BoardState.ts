import { GamePhase } from 'citadels-common';
import CharacterManager, { TurnState } from './CharacterManager';
import DistrictsDeck from './DistrictsDeck';
import { PlayerPosition } from './Player';
import PlayerBoardState from './PlayerBoardState';

export default class BoardState {
  // player city, hand and stash
  players: Map<string, PlayerBoardState>;

  // player order, first player has the crown
  playerOrder: Array<string>;

  // character manager
  characterManager: CharacterManager;

  // current game phase
  gamePhase: GamePhase;

  // district cards deck
  districtsDeck: DistrictsDeck;

  // graveyard (1 card)
  graveyard: string | undefined;

  constructor(players: string[]) {
    this.players = new Map();
    this.playerOrder = [...players];
    this.characterManager = new CharacterManager(players.length);
    this.gamePhase = GamePhase.INITIAL;
    this.districtsDeck = new DistrictsDeck();

    // initialize each player hand with 2 gold and 4 district cards
    players.forEach((playerId) => {
      this.players.set(playerId, new PlayerBoardState(2, this.districtsDeck.drawCards(4)));
    });
  }

  exportForPlayer(destPlayerId: string) {
    // whether the player can see all hands
    const destPlayerPos = this.playerOrder.indexOf(destPlayerId) as PlayerPosition;
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
      gamePhase: this.gamePhase,
      turnState: this.characterManager.getClientTurnState(),
      playerOrder: this.playerOrder,
      currentPlayer: this.getCurrentPlayerPosition(),
      currentPlayerExtraData: {
        ...this.characterManager.exportCurrentPlayerExtraData(),
        earningsValue: this.players
          .get(this.getCurrentPlayerId())
          ?.computeEarningsForCharacter(this.characterManager.getCurrentCharacter()) ?? 0,
      },
      characters: this.characterManager.exportCharactersList(destPlayerPos),
      graveyard: this.graveyard,
    };
  }

  // current player (index of playerOrder)
  getCurrentPlayerPosition(): PlayerPosition {
    switch (this.gamePhase) {
      case GamePhase.CHOOSE_CHARACTERS:
        return this.characterManager.choosingState.getState().player;
      case GamePhase.DO_ACTIONS:
        if (this.characterManager.turnState === TurnState.GRAVEYARD_RECOVER_DISTRICT) {
          // get player with graveyard
          const playerBoardEntry = [...this.players].find((p) => p[1].city.includes('graveyard'));
          if (playerBoardEntry !== undefined) {
            return this.playerOrder.indexOf(playerBoardEntry[0]);
          }
        }
        return this.characterManager.getCurrentPlayerPosition();

      default:
    }
    return PlayerPosition.SPECTATOR;
  }

  getCurrentPlayerId() {
    return this.playerOrder[this.getCurrentPlayerPosition()];
  }
}
