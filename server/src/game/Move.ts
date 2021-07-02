export enum MoveType {
  AUTO = 0,
  CHOOSE_CHARACTER,
}

export default interface Move {
  type: MoveType
  data?: any
}
