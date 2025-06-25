import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Deck } from '../helpers/Deck';
import { Player } from '../helpers/Player';
import { GameManager } from '../helpers/GameManager';
import { renderHand } from '../helpers/renderHand';

export class Game extends Scene{
    deck: Deck;
    manager: GameManager;
    player: Player;

    constructor ()
    {
        super('Game');
    }

    preload() {
    // Load all card images from the assets folder
        this.load.setBaseURL('assets');
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['1','2','3','4','5','6','7','8','9','10','11','12','13'];
        suits.forEach(suit => {
            values.forEach(value => {
                this.load.image(`${suit}-${value}`, `card-${suit}-${value}.png`);
            });
        });
        // Load the back of the card
        this.load.image('back', 'card-back1.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#6aa84f');

        this.manager = new GameManager(['You', 'Computer']);
        this.player = this.manager.players[0];

        EventBus.emit('current-scene-ready', this);

        renderHand(this, this.player, this.manager);
    }


}
