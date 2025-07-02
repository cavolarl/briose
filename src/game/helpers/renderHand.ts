import { Scene } from 'phaser';
import { Player } from './Player';
import { GameManager } from './GameManager';
import { Asker } from './Asker';
import { currentTheme } from '../EventBus';

let playerCardImages: Phaser.GameObjects.Image[] = [];
let opponentCardImages: Phaser.GameObjects.Image[] = [];
let deckCountText: Phaser.GameObjects.Text | null = null;
let playerBookImages: Phaser.GameObjects.Image[] = [];
let opponentBookImages: Phaser.GameObjects.Image[] = [];

export function renderHand(
    scene: Scene,
    player: Player,
    manager: GameManager
): void {
    // Destroy previous objects created by renderHand
    playerCardImages.forEach(img => img.destroy());
    opponentCardImages.forEach(img => img.destroy());
    playerBookImages.forEach(img => img.destroy());
    opponentBookImages.forEach(img => img.destroy());
    if (deckCountText) {
        deckCountText.destroy();
    }

    playerCardImages = [];
    opponentCardImages = [];
    playerBookImages = [];
    opponentBookImages = [];
    deckCountText = null;

    const cardWidth = 100;
    const cardHeight = 140;
    const npcardWidth = 50;
    const npcardHeight = 70;
    const cardSpacing = 20;
    const stackOffsetY = 10;

    const screenWidth = scene.scale.width;
    const screenHeight = scene.scale.height;

    const npLabelX = screenWidth * 0.1;
    const npLabelY = screenHeight * 0.05;
    const pLabelX = screenWidth * 0.1;
    const pLabelY = screenHeight * 0.7;

    const bookSize = 30;
    const bookSpacing = bookSize + 6;

    // Render computer's cards as card backs
    manager.players[1].hand.forEach((_, index) => {
        const cardImage = scene.add.image(
            npLabelX + index * cardSpacing,
            npLabelY + 50,
            currentTheme.cardBack
        )
        .setDisplaySize(npcardWidth, npcardHeight)
        .setOrigin(0.5);
        opponentCardImages.push(cardImage);
    });

    // Group player cards by value
    const grouped: { [value: string]: string[] } = {};
    for (const card of player.hand) {
        const [, value] = card.split('-');
        if (!grouped[value]) grouped[value] = [];
        grouped[value].push(card);
    }

    const values = Object.keys(grouped).sort();

    // Render player hand
    const totalWidth = values.length * (cardWidth + cardSpacing) - cardSpacing;
    const startX = (screenWidth - totalWidth) / 2;

    values.forEach((value, groupIndex) => {
        const group = grouped[value];
        group.forEach((card, stackIndex) => {
            const [suit] = card.split('-');
            const cardImage = scene.add.image(
                startX + groupIndex * (cardWidth + cardSpacing),
                pLabelY + 60 + stackIndex * stackOffsetY,
                `${suit}-${value}`
            )
            .setOrigin(0.5)
            .setDisplaySize(cardWidth, cardHeight);
            playerCardImages.push(cardImage);
        });
    });

    // Deck count display
    deckCountText = scene.add.text(screenWidth * 0.85, screenHeight * 0.9, `${manager.deck.cards.length} cards left`, {
        fontSize: '18px'
    });

    manager.players[1].books.forEach((_, index) => {
        const bookImage = scene.add.image(
            npLabelX + index * bookSpacing,
            npLabelY + 20,
            currentTheme.cardBack
        )
        .setDisplaySize(bookSize, bookSize)
        .setOrigin(0.5);
        opponentBookImages.push(bookImage);
    });

    player.books.forEach((_, index) => {
        const bookImage = scene.add.image(
            pLabelX + index * bookSpacing,
            pLabelY + 20,
            currentTheme.cardBack
        )
        .setDisplaySize(bookSize, bookSize)
        .setOrigin(0.5);
        playerBookImages.push(bookImage);
    });

    // Render Asker if it's the player's turn
    if (manager.turnIndex === 0) {
    Asker(scene, player, manager);
    }
}
