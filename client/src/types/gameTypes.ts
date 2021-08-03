import { Move } from 'citadels-common';

export interface Action {
  title: string
  args?: string[]
  move: Move
}

export type StatusBarMessageType = 'NORMAL' | 'HIGHLIGHTED' | 'ERROR'

export interface StatusBarData {
  type: StatusBarMessageType
  message: string
  args?: string[]
  actions?: Action[]
}
