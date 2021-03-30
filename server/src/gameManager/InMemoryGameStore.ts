import GameStore from './GameStore';
import Room from './Room';

export default class InMemoryGameStore extends GameStore {
  rooms: Map<string, Room>;

  constructor() {
    super();
    this.rooms = new Map();
  }

  findRoom(roomId: string | undefined) {
    if (roomId === undefined) { return undefined; }
    return this.rooms.get(roomId);
  }

  saveRoom(roomId: string, room: Room) {
    this.rooms.set(roomId, room);
  }

  hasRoom(roomId: string) {
    return this.rooms.has(roomId);
  }

  findAllRooms() {
    return [...this.rooms.values()];
  }
}
