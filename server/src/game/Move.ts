export enum MoveType {
  AUTO = 0,
}

export default interface Move {
  type: MoveType
  data?: any
}
