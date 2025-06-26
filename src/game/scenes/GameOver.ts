import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create(data: { winner: string }) {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000');

        this.add.text(width / 2, height / 2 - 50, 'Game Over', {
            fontSize: '48px',
            color: '#fff',
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, `Winner: ${data.winner}`, {
            fontSize: '32px',
            color: '#fff',
        }).setOrigin(0.5);

        const restartText = this.add.text(width / 2, height / 2 + 80, 'Click to Restart', {
            fontSize: '24px',
            color: '#aaa',
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.scene.start('GameScene');
          });
    }
}
