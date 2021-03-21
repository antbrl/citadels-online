const nanoid = require('nanoid');
const nolookalikesSafe = require('nanoid-dictionary/nolookalikes-safe');

const roomIdGenerator = nanoid.customAlphabet(nolookalikesSafe, 6);
const playerIdGenerator = nanoid.nanoid;

function genRoomId() {
    return roomIdGenerator();
}
function genPlayerId() {
    return playerIdGenerator();
}

module.exports = { genRoomId, genPlayerId };
