import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload() {
    this.load.image('clubs', 'assets/card-clubs-1.png');
    this.load.image('diamonds', 'assets/card-diamonds-1.png');
    this.load.image('hearts', 'assets/card-hearts-1.png');
    this.load.image('spades', 'assets/card-spades-1.png');
    this.load.image('back', 'assets/card-back1.png');
    }


    create ()
{
    this.cameras.main.setBackgroundColor('#6aa84f');

    const cardWidth = 100;
    const cardHeight = 140;
    const cardSpacing = 20;

    const cardPositions = [
        { x: 100, y: 100, key: 'clubs' },
        { x: 100 + cardWidth + cardSpacing, y: 100, key: 'diamonds' },
        { x: 100 + 2 * (cardWidth + cardSpacing), y: 100, key: 'hearts' },
        { x: 100 + 3 * (cardWidth + cardSpacing), y: 100, key: 'spades' }
    ];

    cardPositions.forEach(pos => {
        // Start with the card back
        const cardBack = this.add.image(pos.x, pos.y, 'back')
            .setOrigin(0.5)
            .setDisplaySize(cardWidth, cardHeight)
            .setInteractive();

        // Create the face but make it invisible initially
        const cardFace = this.add.image(pos.x, pos.y, pos.key)
            .setOrigin(0.5)
            .setDisplaySize(cardWidth, cardHeight)
            .setVisible(false);

        // On click, hide the back and show the face
        cardBack.on('pointerdown', () => {
            cardBack.setVisible(false);
            cardFace.setVisible(true);
        });
    });

    EventBus.emit('current-scene-ready', this);
}

}
