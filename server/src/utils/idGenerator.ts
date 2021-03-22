import nanoid from 'nanoid';

const roomIdGenerator = nanoid.customAlphabet('6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz', 6);
const playerIdGenerator = nanoid.nanoid;

export function genRoomId() {
  return roomIdGenerator();
}
export function genPlayerId() {
  return playerIdGenerator();
}
