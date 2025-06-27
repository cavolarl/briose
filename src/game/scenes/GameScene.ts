import { EventBus, currentTheme } from '../EventBus';
import { Scene } from 'phaser';
import { Deck } from '../helpers/Deck';
import { Player } from '../helpers/Player';
import { GameManager } from '../helpers/GameManager';
import { renderHand } from '../helpers/renderHand';
import { handleAITurn } from '../helpers/AiManager';
import { Asker } from '../helpers/Asker';
import { Theme } from '../themes';

export class GameScene extends Scene{
    deck: Deck;
    manager: GameManager;
    player: Player;
    playerScoreText: Phaser.GameObjects.Text;
    computerScoreText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameScene');
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
        // Load all card back images
        this.load.image('card-back1', 'card-back1.png');
        this.load.image('card-back2', 'card-back2.png');
        this.load.image('card-back3', 'card-back3.png');
        this.load.image('card-back4', 'card-back4.png');
    }

    create() {
        this.cameras.main.setBackgroundColor(currentTheme.backgroundColor);

        this.manager = new GameManager(['1', '2']);
        this.player = this.manager.players[0];

        // Score display
        this.playerScoreText = this.add.text(10, 10, 'Your Score: 0', { fontSize: '24px', color: currentTheme.textColor });
        this.computerScoreText = this.add.text(this.scale.width - 10, 10, 'Computer Score: 0', { fontSize: '24px', color: currentTheme.textColor }).setOrigin(1, 0);

        EventBus.emit('current-scene-ready', this);
        this.updateHand();
        this.updateScores();

        EventBus.on('theme-selected', (theme: Theme) => {
            this.cameras.main.setBackgroundColor(theme.backgroundColor);
            this.playerScoreText.setColor(theme.textColor);
            this.computerScoreText.setColor(theme.textColor);
            this.updateHand();
        });

    }

    updateHand() {
        console.log('Before renderHand:', this.children.list);
        renderHand(this, this.player, this.manager);
        console.log('After renderHand:', this.children.list);
        this.updateScores();
    }

    updateScores() {
        this.playerScoreText.setText(`Your Score: ${this.player.books.length}`);
        this.computerScoreText.setText(`Computer Score: ${this.manager.players[1].books.length}`);
    }

}
