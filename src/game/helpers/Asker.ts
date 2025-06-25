import { Scene } from 'phaser';
import { GameManager } from './GameManager';
import { Player } from './Player';
import { renderHand } from './renderHand';

export function Asker(scene: Scene, player: Player, manager: GameManager) {
    const screenWidth = scene.scale.width;
    const screenHeight = scene.scale.height;

    const askY = screenHeight * 0.9;
    const startX = screenWidth * 0.1;

    scene.add.text(startX, askY, 'What card will you ask for?', { fontSize: '18px' });

    const ranksInHand = Array.from(new Set(
        player.hand.map(card => card.split('-')[1])
    ));

    let x = startX;
    const buttonSpacing = 40;

    ranksInHand.forEach(value => {
        const button = scene.add.text(x, askY + 30, value, {
            fontSize: '18px',
            backgroundColor: '#ffffff',
            color: '#000',
            padding: { x: 6, y: 2 },
            align: 'center'
        })
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            const success = manager.askPlayerForCard(
                manager.players[0], // you
                manager.players[1], // opponent
                value
            );
            console.log(`Asked for ${value}. Success: ${success}`)
            renderHand(scene, player, manager);
        });

        x += buttonSpacing;
    });
}
