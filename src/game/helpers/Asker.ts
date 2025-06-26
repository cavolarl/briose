import { Scene } from 'phaser';
import { GameManager } from './GameManager';
import { Player } from './Player';
import { renderHand } from './renderHand';
import { handleAITurn } from './AiManager';

let askButtons: Phaser.GameObjects.Text[] = [];

export function Asker(scene: Scene, player: Player, manager: GameManager) {
    // Input is always enabled when rendering Asker
    scene.input.enabled = true;
    const screenWidth = scene.scale.width;
    const screenHeight = scene.scale.height;

    askButtons.forEach(btn => btn.destroy());
    askButtons = [];


    const askY = screenHeight * 0.9;
    const startX = screenWidth * 0.1;

    // Clear existing ask UI (if any)
    scene.children.getAll().forEach(child => {
        if ((child as Phaser.GameObjects.Text).text &&
            /^[2-9]|1[0-3]$|^1$/.test((child as Phaser.GameObjects.Text).text)) {
            child.destroy();
        }
    });

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
            scene.input.enabled = false;

            const success = manager.askPlayerForCard(
                manager.players[0], // you
                manager.players[1], // opponent
                value
            );

            if (!success) {
                console.log(`You asked for ${value}, but the opponent has no cards of that value.`);
                manager.nextTurn();
            } else {
                console.log(`You successfully asked for ${value}.`);
            }

            renderHand(scene, player, manager);

            if (manager.isGameOver()) {
                const playerBooks = manager.players[0].books.length;
                const opponentBooks = manager.players[1].books.length;
                const winner = playerBooks > opponentBooks ? 'You' : 'Computer';
                scene.scene.start('GameOver', { winner });
                return;
            }

            // If player keeps turn, re-enable input and re-render Asker
            if (manager.turnIndex === 0) {
                scene.time.delayedCall(500, () => {
                    Asker(scene, player, manager);
                });
            } else {
                scene.time.delayedCall(1000, () => {
                    handleAITurn(manager, scene);
                });
            }
        });

        x += buttonSpacing;
    });
}
