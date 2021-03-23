export enum PlayerRole {
  SPECTATOR = 1,
  PLAYER,
}

export default class Player {
  id: string;
  username: string;
  manager: boolean;
  online: boolean;
  role: PlayerRole;

  constructor(id: string, username: string, manager: boolean, online: boolean) {
    this.id = id;
    this.username = username;
    this.manager = manager;
    this.online = online;
    this.role = PlayerRole.PLAYER;
  }

  toString() {
    return `Player ${this.username}[${this.id}]`;
  }
}
