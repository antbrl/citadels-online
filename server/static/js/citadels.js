var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
const socket = io('/', {
  path: '/s/',
  autoConnect: false
});
var self;
var otherPlayers;
var usernameAlreadySelected;

function preload() {
}

function create() {
  self = {};
  otherPlayers = {};
  usernameAlreadySelected = false;
  socket.onAny((event, ...args) => {
    console.debug('socket:', event, args);
  });
  socket.on('connect_error', (err) => {
    if (err.message === 'invalid username') {
      usernameAlreadySelected = false;
    }
    alert(err.message);
  });
  socket.on('connect', () => {
    console.log('connected with socket id', socket.id);
    document.getElementById('login-form').style.display = 'none';
  });
  socket.on('disconnect', () => {
    console.log('disconnected');
    document.getElementById('login-form').style.display = 'block';
  });
  socket.on('currentPlayers', (players) => {
    Object.keys(players).forEach((id) => {
      if (players[id].id === socket.id) {
        addPlayer(players[id]);
      } else {
        addOtherPlayer(players[id]);
      }
    });
  });
  socket.on('newPlayer', (player) => {
    console.log(`${player.name} connected`);
    addOtherPlayer(player);
  });
  socket.on('disconnectPlayer', (playerId) => {
    if (playerId in otherPlayers) {
      const player = otherPlayers[playerId];
      console.log(`${player.name} disconnected`);
      delete otherPlayers[playerId];
    }
  });
}

function update() {
}

function onSelectedUsername() {
  if (usernameAlreadySelected)
    return;

  let username = document.getElementById('username').value;

  usernameAlreadySelected = true;
  connect(username);
}

function connect(username) {
  self.username = username;
  socket.auth = { username };
  socket.connect();
}

function addPlayer(player) {
    console.log(`${player.name} connected (self)`);
}

function addOtherPlayer(player) {
  otherPlayers[player.id] = player;
}
