const nanoid = require('nanoid');
const nolookalikesSafe = require('nanoid-dictionary/nolookalikes-safe');

const roomIdGenerator = nanoid.customAlphabet(nolookalikesSafe, 6);
const userIdGenerator = nanoid.nanoid;

function genRoomId() {
    return roomIdGenerator();
}
function genUserId() {
    return userIdGenerator();
}

module.exports = { genRoomId, genUserId };