import {
  CharacterChoosingStateType as CCST,
  ClientGameState,
  GameProgress,
  StatusBarData,
  GamePhase,
  ClientTurnState,
  Action,
  MoveType,
  CharacterType,
} from '../types/gameTypes';

const INVALID_STATE: StatusBarData = {
  type: 'ERROR',
  message: 'ui.game.messages.errors.invalid_state',
};

const MESSAGES_CHOOSE_CHARACTERS = {
  [CCST.INITIAL]: 'initial',
  [CCST.PUT_ASIDE_FACE_UP]: 'put_aside_face_up',
  [CCST.PUT_ASIDE_FACE_DOWN]: 'put_aside_face_down',
  [CCST.CHOOSE_CHARACTER]: 'choose_character',
  [CCST.DONE]: 'done',
};

const MESSAGES_DO_ACTIONS = {
  [ClientTurnState.INITIAL]: 'initial',
  [ClientTurnState.TAKE_RESOURCES]: 'take_resources',
  [ClientTurnState.CHOOSE_CARD]: 'choose_card',
  [ClientTurnState.CHOOSE_ACTION]: 'choose_action',
  [ClientTurnState.ASSASSIN_KILL]: 'assassin_kill',
  [ClientTurnState.THIEF_ROB]: 'thief_rob',
  [ClientTurnState.MAGICIAN_EXCHANGE_HAND]: 'magician_exchange_hand',
  [ClientTurnState.MAGICIAN_DISCARD_CARDS]: 'magician_discard_cards',
  [ClientTurnState.MERCHANT_TAKE_1_GOLD]: 'merchant_take_1_gold',
  [ClientTurnState.ARCHITECT_DRAW_2_CARDS]: 'architect_draw_2_cards',
  [ClientTurnState.WARLORD_DESTROY_DISTRICT]: 'warlord_destroy_district',
  [ClientTurnState.BUILD_DISTRICT]: 'build_district',
  [ClientTurnState.DONE]: 'done',
};

function getActions(
  turnState: ClientTurnState,
  character: CharacterType,
  districtsToBuild: number,
  canTakeEarnings: boolean,
  canDoSpecialAction: boolean,
) {
  const actions: Action[] = [];
  switch (turnState) {
    case ClientTurnState.TAKE_RESOURCES:
      actions.push({ title: 'take_gold', move: { type: MoveType.TAKE_GOLD } });
      actions.push({ title: 'draw_cards', move: { type: MoveType.DRAW_CARDS } });
      break;
    case ClientTurnState.CHOOSE_ACTION:
      if (canTakeEarnings) {
        actions.push({ title: 'take_gold_earnings', move: { type: MoveType.TAKE_GOLD_EARNINGS } });
      }
      if (canDoSpecialAction) {
        switch (character) {
          case CharacterType.ASSASSIN:
            actions.push({
              title: 'assassin_kill',
              move: { type: MoveType.ASSASSIN_KILL },
            });
            break;
          case CharacterType.THIEF:
            actions.push({
              title: 'thief_rob',
              move: { type: MoveType.THIEF_ROB },
            });
            break;
          case CharacterType.MAGICIAN:
            actions.push({
              title: 'magician_exchange_hand',
              move: { type: MoveType.MAGICIAN_EXCHANGE_HAND },
            });
            actions.push({
              title: 'magician_discard_cards',
              move: { type: MoveType.MAGICIAN_DISCARD_CARDS },
            });
            break;
          case CharacterType.WARLORD:
            actions.push({
              title: 'warlord_destroy_district',
              move: { type: MoveType.WARLORD_DESTROY_DISTRICT },
            });
            break;
          default:
            break;
        }
      }
      if (districtsToBuild > 0) {
        actions.push({ title: 'build_district', move: { type: MoveType.BUILD_DISTRICT } });
      }
      actions.push({ title: 'finish_turn', move: { type: MoveType.FINISH_TURN } });
      break;
    case ClientTurnState.ASSASSIN_KILL:
    case ClientTurnState.THIEF_ROB:
    case ClientTurnState.MAGICIAN_EXCHANGE_HAND:
    case ClientTurnState.MAGICIAN_DISCARD_CARDS:
    case ClientTurnState.WARLORD_DESTROY_DISTRICT:
    case ClientTurnState.BUILD_DISTRICT:
      actions.push({ title: 'cancel', move: { type: MoveType.DECLINE } });
      break;
    case ClientTurnState.MERCHANT_TAKE_1_GOLD:
      actions.push({ title: 'accept', move: { type: MoveType.MERCHANT_TAKE_1_GOLD } });
      actions.push({ title: 'decline', move: { type: MoveType.DECLINE } });
      break;
    case ClientTurnState.ARCHITECT_DRAW_2_CARDS:
      actions.push({ title: 'accept', move: { type: MoveType.ARCHITECT_DRAW_2_CARDS } });
      actions.push({ title: 'decline', move: { type: MoveType.DECLINE } });
      break;
    default:
  }
  return actions;
}

export function getStatusBarData(state: ClientGameState): StatusBarData {
  if (state.progress !== GameProgress.IN_GAME) {
    return INVALID_STATE;
  }

  const currentPlayer = state.board.playerOrder[state.board.currentPlayer];
  const isCurrentPlayerSelf = currentPlayer === state.self;
  const currentPlayerName = state.players.get(currentPlayer)?.username ?? '';

  switch (state.board.gamePhase) {
    case GamePhase.INITIAL:
      return {
        type: 'NORMAL',
        message: 'ui.game.messages.welcome',
      };

    case GamePhase.CHOOSE_CHARACTERS:
    {
      const message = MESSAGES_CHOOSE_CHARACTERS[
      state.board.characters.state.type as keyof typeof MESSAGES_CHOOSE_CHARACTERS
      ];
      if (message !== undefined) {
        return {
          type: isCurrentPlayerSelf ? 'HIGHLIGHTED' : 'NORMAL',
          message: `ui.game.messages.choose_characters.${message}`,
          args: [currentPlayerName],
        };
      }
      break;
    }

    case GamePhase.DO_ACTIONS:
    {
      const currentCharacter = state.board.characters.current;
      if (!isCurrentPlayerSelf && currentCharacter !== CharacterType.NONE) {
        return {
          type: 'NORMAL',
          message: `characters.${currentCharacter}.turn`,
        };
      }
      const message = MESSAGES_DO_ACTIONS[
        state.board.turnState as keyof typeof MESSAGES_DO_ACTIONS
      ];
      if (message !== undefined) {
        return {
          type: isCurrentPlayerSelf ? 'HIGHLIGHTED' : 'NORMAL',
          message: `ui.game.messages.actions.${message}`,
          actions: getActions(
            state.board.turnState,
            state.board.characters.current,
            state.board.currentPlayerExtraData.districtsToBuild,
            state.board.currentPlayerExtraData.canTakeEarnings,
            state.board.currentPlayerExtraData.canDoSpecialAction,
          ),
        };
      }
      break;
    }

    default:
  }

  return INVALID_STATE;
}

export default getStatusBarData;
