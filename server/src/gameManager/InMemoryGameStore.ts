import { RoomId } from 'citadels-common';
import GameStore from './GameStore';
import Room from './Room';

export default class InMemoryGameStore extends GameStore {
  rooms: Map<RoomId, Room>;

  constructor() {
    super();
    this.rooms = new Map();
  }

  findRoom(roomId: RoomId | undefined) {
    if (roomId === undefined) { return undefined; }
    return this.rooms.get(roomId);
  }

  saveRoom(roomId: RoomId, room: Room) {
    this.rooms.set(roomId, room);
  }

  hasRoom(roomId: RoomId) {
    return this.rooms.has(roomId);
  }

  findAllRooms() {
    return [...this.rooms.values()];
  }
}
