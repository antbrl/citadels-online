import { Socket } from 'socket.io';
import { PlayerId } from 'citadels-common';

export default interface ExtendedSocket extends Socket {
  roomId?: string;
  playerId?: PlayerId;
}
