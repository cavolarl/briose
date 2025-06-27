import { Scene } from 'phaser';
import { GameManager } from './GameManager';
import { Player } from './Player';
import { renderHand } from './renderHand';
import { handleAITurn } from './AiManager';
import { currentTheme } from '../EventBus';

let askButtons: Phaser.GameObjects.Text[] = [];
let selectedOptionIndex = 0;
let askBoxGraphics: Phaser.GameObjects.Graphics | null = null;

export function Asker(scene: Scene, player: Player, manager: GameManager) {
    // Input is always enabled when rendering Asker
    scene.input.enabled = true;
    const screenWidth = scene.scale.width;
    const screenHeight = scene.scale.height;

    const ranksInHand = Array.from(new Set(
        player.hand.map(card => card.split('-')[1])
    ));

    const menuOptions = ranksInHand.map(rank => ({ text: rank, value: rank }));

    const boxWidth = 250;
    const boxHeight = (menuOptions.length * 40) + 80;
    const boxX = screenWidth - boxWidth - 20;
    const boxY = (screenHeight - boxHeight) / 2;

    const graphics = scene.add.graphics();
    graphics.fillStyle(0x000000, 0.7);
    graphics.fillRect(boxX, boxY, boxWidth, boxHeight);
    graphics.lineStyle(2, currentTheme.buttonColor, 1);
    graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);
    askBoxGraphics = graphics;

    scene.add.text(boxX + boxWidth / 2, boxY + 30, 'Ask for card:', {
        fontSize: '24px',
        color: currentTheme.textColor,
        fontFamily: 'Arial',
    }).setOrigin(0.5);

    askButtons = [];
    menuOptions.forEach((option, index) => {
        const optionText = scene.add.text(boxX + boxWidth / 2, boxY + 80 + index * 40, option.text, {
            fontSize: '28px',
            color: currentTheme.textColor,
            fontFamily: 'Arial',
        }).setOrigin(0.5);
        askButtons.push(optionText);
    });

    const updateSelection = () => {
        askButtons.forEach((text, index) => {
            text.setColor(index === selectedOptionIndex ? '#FFD700' : currentTheme.textColor);
        });
    };

    if (scene.input.keyboard) {
        scene.input.keyboard.off('keydown-DOWN');
        scene.input.keyboard.off('keydown-UP');
        scene.input.keyboard.off('keydown-ENTER');

        scene.input.keyboard.on('keydown-DOWN', () => {
            selectedOptionIndex = (selectedOptionIndex + 1) % menuOptions.length;
            updateSelection();
        });

        scene.input.keyboard.on('keydown-UP', () => {
            selectedOptionIndex = (selectedOptionIndex - 1 + menuOptions.length) % menuOptions.length;
            updateSelection();
        });

        scene.input.keyboard.on('keydown-ENTER', () => {
            if (scene.input.keyboard) {
                scene.input.keyboard.off('keydown-DOWN');
                scene.input.keyboard.off('keydown-UP');
                scene.input.keyboard.off('keydown-ENTER');
            }

            const selectedRank = menuOptions[selectedOptionIndex].value;
            scene.input.enabled = false;

            const success = manager.askPlayerForCard(
                manager.players[0], // you
                manager.players[1], // opponent
                selectedRank
            );

            if (!success) {
                console.log(`You asked for ${selectedRank}, but the opponent has no cards of that value.`);
                manager.nextTurn();
            } else {
                console.log(`You successfully asked for ${selectedRank}.`);
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

                    // After AI turn, check for game over again
                    scene.time.delayedCall(1100, () => {
                        if (manager.isGameOver()) {
                            const playerBooks = manager.players[0].books.length;
                            const opponentBooks = manager.players[1].books.length;
                            const winner = playerBooks > opponentBooks ? 'You' : 'Computer';
                            scene.scene.start('GameOver', { winner });
                        }
                    });
                });
            }
        });
    }

    updateSelection();
}
