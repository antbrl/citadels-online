import { Socket } from 'socket.io';

export default interface ExtendedSocket extends Socket {
  roomId?: string;
  playerId?: string;
}
