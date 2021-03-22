export default class Player {
  id: string;

  username: string;

  online: boolean;

  constructor(id: string, username: string, online: boolean) {
    this.id = id;
    this.username = username;
    this.online = online;
  }

  toString() {
    return `Player ${this.username}[${this.id}]`;
  }
}
