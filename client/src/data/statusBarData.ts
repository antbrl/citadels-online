import {
  CharacterChoosingStateType as CCST,
  ClientGameState,
  GameProgress,
  StatusBarData,
  TurnPhase,
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

export function getStatusBarData(state: ClientGameState): StatusBarData {
  if (state.progress !== GameProgress.IN_GAME) {
    return INVALID_STATE;
  }

  const currentPlayer = state.board.playerOrder[state.board.currentPlayer];
  const isCurrentPlayerSelf = currentPlayer === state.self;
  const currentPlayerName = state.players.get(currentPlayer)?.username ?? '';

  if (state.board.turnPhase === TurnPhase.CHOOSE_CHARACTERS) {
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
  }

  return INVALID_STATE;
}

export default getStatusBarData;
