import { Scene } from 'phaser';
import { Player } from './Player';
import { GameManager } from './GameManager';
import { Asker } from './Asker';

export function renderHand(
    scene: Scene,
    player: Player,
    manager: GameManager
): void {
    scene.children.removeAll();

    const cardWidth = 100;
    const cardHeight = 140;
    const npcardWidth = 50;
    const npcardHeight = 70;
    const cardSpacing = 30;
    const stackOffsetY = 10;

    const screenWidth = scene.scale.width;
    const screenHeight = scene.scale.height;

    const npLabelX = screenWidth * 0.1;
    const npLabelY = screenHeight * 0.05;
    const pLabelX = screenWidth * 0.1;
    const pLabelY = screenHeight * 0.7;

    manager.players[1].hand.forEach((_, index) => {
        scene.add.image(
            npLabelX + index * cardSpacing,
            npLabelY + 50,
            'back'
        )
        .setDisplaySize(npcardWidth, npcardHeight)
        .setOrigin(0.5);
    });

    // Group cards by value
    const grouped: { [value: string]: string[] } = {};
    for (const card of player.hand) {
        const [, value] = card.split('-');
        if (!grouped[value]) grouped[value] = [];
        grouped[value].push(card);
    }

    const values = Object.keys(grouped).sort();

    // Calculate total width for all groups for horizontal centering
    const totalWidth = values.length * (cardWidth + cardSpacing) - cardSpacing;
    let startX = (screenWidth - totalWidth) / 2;

    values.forEach((value, groupIndex) => {
        const group = grouped[value];
        group.forEach((card, stackIndex) => {
            const [suit] = card.split('-');
            scene.add.image(
                startX + groupIndex * (cardWidth + cardSpacing),
                pLabelY + 60 + stackIndex * stackOffsetY,
                `${suit}-${value}`
            )
            .setOrigin(0.5)
            .setDisplaySize(cardWidth, cardHeight);
        });
    });

    // Deck count display (bottom right)
    scene.add.text(screenWidth * 0.85, screenHeight * 0.9, `${manager.deck.cards.length} cards left`, {
        fontSize: '18px'
    });

    // Render the ask buttons
    Asker(scene, player, manager);
}
