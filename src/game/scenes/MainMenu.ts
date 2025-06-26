import Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Add assets to load here later
    }

    create() {
        const { width, height } = this.scale;

        // Add a background color
        this.cameras.main.setBackgroundColor('#24252A');

        // Add a title text
        this.add.text(width / 2, height / 2 - 100, 'My Game', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        // Add a play button
        const playButton = this.add.rectangle(width / 2, height / 2, 200, 60, 0x4ecca3)
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, height / 2, 'Play', {
            fontSize: '32px',
            color: '#232931',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
