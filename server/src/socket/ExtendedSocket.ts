import { Socket } from 'socket.io';
import { PlayerId, RoomId } from 'citadels-common';

export default interface ExtendedSocket extends Socket {
  roomId?: RoomId;
  playerId?: PlayerId;
}
