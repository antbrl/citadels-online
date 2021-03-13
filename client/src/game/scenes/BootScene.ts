import { Scene } from 'phaser';

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.scene.start('PlayScene');
  }
}
