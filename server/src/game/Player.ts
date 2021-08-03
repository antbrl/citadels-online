import { PlayerRole } from 'citadels-common';

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
