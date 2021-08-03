import { PlayerRole } from 'citadels-common';

export enum PlayerPosition {
  SPECTATOR = -1,
  PLAYER_1,
  PLAYER_2,
  PLAYER_3,
  PLAYER_4,
  PLAYER_5,
  PLAYER_6,
  PLAYER_7,
}

export default class Player {
  id: string;
  username: string;
  manager: boolean;
  online: boolean;
  role: PlayerRole;

  constructor(
    id: string,
    username: string,
    manager: boolean,
    online: boolean,
    role: PlayerRole,
  ) {
    this.id = id;
    this.username = username;
    this.manager = manager;
    this.online = online;
    this.role = role;
  }

  toString() {
    return `Player ${this.username}[${this.id}]`;
  }
}
