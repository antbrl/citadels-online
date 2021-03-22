import Room from './Room';

export default abstract class GameStore {
  abstract findRoom(roomId: string): Room | undefined;

  abstract saveRoom(roomId: string, room: Room): void;

  abstract hasRoom(roomId: string): boolean;

  abstract findAllRooms(): Room[];
}
