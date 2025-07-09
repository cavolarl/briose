import Phaser from 'phaser';
import { GameManager } from './GameManager';

export class MessageBox extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Rectangle;
    private title: Phaser.GameObjects.Text;
    private messageTexts: Phaser.GameObjects.Text[] = [];
    private maxMessages = 5;
    private manager: GameManager;

    constructor(scene: Phaser.Scene, manager: GameManager, x: number, y: number, width = 400, height = 140) {
        super(scene, x, y);
        this.manager = manager;

        // Background
        this.background = scene.add.rectangle(0, 0, width, height, 0x1e1e1e, 0.85)
            .setOrigin(0)
            .setStrokeStyle(2, 0x8ecae6);
        this.add(this.background);

        // Title
        this.title = scene.add.text(16, 8, 'Messages', {
            fontSize: '18px',
            color: '#8ecae6',
            fontFamily: 'sans-serif',
            fontStyle: 'bold'
        });
        this.add(this.title);

        // Initial message slots
        for (let i = 0; i < this.maxMessages; i++) {
            const msgText = scene.add.text(16, 36 + i * 20, '', {
                fontSize: '16px',
                color: '#fff',
                fontFamily: 'sans-serif'
            });
            this.messageTexts.push(msgText);
            this.add(msgText);
        }

        scene.add.existing(this);
        this.setDepth(1000); // Ensure it's on top

        this.updateMessages();
    }

    updateMessages() {
        const lastFive = this.manager.getLastFiveMessages(this.manager.messages);
        for (let i = 0; i < this.maxMessages; i++) {
            this.messageTexts[i].setText(lastFive[i] || '');
        }
    }
}
