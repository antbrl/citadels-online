import { GameObjects, Scene } from 'phaser';
import store from '../../store';

export default class PlayScene extends Scene {
  playersText!: GameObjects.Text;

  constructor() {
    super({ key: 'PlayScene' });
  }

  create() {
    this.playersText = this.add.text(10, 10, '');
  }

  update() {
    if (store.getters.isConnected) {
      this.playersText.text = `PLAYERS:\n${store.state.self.name}(self) \n${Array.from(store.state.players.values()).map((p) => p.name).join('\n')}`;
    }
  }
}
