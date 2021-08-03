import { PlayerId, PlayerRole } from 'citadels-common';

export default class Player {
  id: PlayerId;
  username: string;
  manager: boolean;
  online: boolean;
  role: PlayerRole;

  constructor(
    id: PlayerId,
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
