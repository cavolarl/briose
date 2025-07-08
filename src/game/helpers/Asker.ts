import { Scene } from 'phaser';
import { GameManager } from './GameManager';
import { Player } from './Player';
import { renderHand } from './renderHand';
import { handleAITurn } from './AiManager';
import { currentTheme } from '../EventBus';
import { MessageBox } from './MessageHandler';

let askContainer: Phaser.GameObjects.Container | null = null;
let selectedOptionIndex = 0;

export function Asker(scene: Scene, player: Player, manager: GameManager, messageBox: MessageBox) {
    if (askContainer) {
        askContainer.destroy(true);
        askContainer = null;
    }

    selectedOptionIndex = 0;
    scene.input.enabled = true;

    const screenWidth = scene.scale.width;
    const screenHeight = scene.scale.height;

    
    // Logic to handle the case where the player has no cards left, uncertain if this works as intended due to difficulty debugging
    if (player.hand.length === 0 && !manager.deck.isEmpty()) {
        manager.drawCard(player);
        player.checkForBooks();
        renderHand(scene, player, manager, messageBox);
        manager.nextTurn();

        scene.time.delayedCall(500, () => {
            handleAITurn(manager, scene, messageBox);
            scene.time.delayedCall(600, () => {
                if (manager.isGameOver()) {
                    const winner = manager.players[0].books.length > manager.players[1].books.length ? 'You' : 'Computer';
                    scene.scene.start('GameOver', { winner });
                } else {
                    Asker(scene, player, manager, messageBox);
                }
            });
        });
        return;
    }
    const ranks = Array.from(new Set(player.hand.map(c => c.split('-')[1])));
    const menu = ranks.map(r => ({ text: r, value: r }));

    const boxW = 250;
    const boxH = menu.length * 40 + 80;
    const boxX = screenWidth - boxW - 20;
    const boxY = (screenHeight - boxH) / 2;

    askContainer = scene.add.container(0, 0);

    const graphics = scene.add.graphics();
    graphics.fillStyle(0x000000, 0.7);
    graphics.fillRect(boxX, boxY, boxW, boxH);
    graphics.lineStyle(2, currentTheme.buttonColor, 1);
    graphics.strokeRect(boxX, boxY, boxW, boxH);
    askContainer.add(graphics);

    const title = scene.add.text(boxX + boxW / 2, boxY + 30, 'Ask for card:', {
        fontSize: '24px',
        color: currentTheme.textColor,
        fontFamily: 'Arial',
    }).setOrigin(0.5);
    askContainer.add(title);

    const buttons: Phaser.GameObjects.Text[] = menu.map((opt, i) => {
        const txt = scene.add.text(boxX + boxW / 2, boxY + 80 + i * 40, opt.text, {
            fontSize: '28px',
            color: currentTheme.textColor,
            fontFamily: 'Arial',
        }).setOrigin(0.5);
        // ! to bypass the null check, should always be defined
        askContainer!.add(txt);
        return txt;
    });

    const update = () => {
        buttons.forEach((b, i) => b.setColor(i === selectedOptionIndex ? '#FFD700' : currentTheme.textColor));
    };

    // Keyboard input handling
    const kb = scene.input.keyboard;
    if (!kb) {
        console.error('Keyboard input not available');
        return;
    }
    kb.off('keydown-DOWN').off('keydown-UP').off('keydown-ENTER');

    kb.on('keydown-DOWN', () => {
        selectedOptionIndex = (selectedOptionIndex + 1) % menu.length;
        update();
    });

    kb.on('keydown-UP', () => {
        selectedOptionIndex = (selectedOptionIndex - 1 + menu.length) % menu.length;
        update();
    });

    kb.on('keydown-ENTER', () => {
        kb.off('keydown-DOWN').off('keydown-UP').off('keydown-ENTER');
        const rank = menu[selectedOptionIndex].value;
        scene.input.enabled = false;
        const ok = manager.askPlayerForCard(manager.players[0], manager.players[1], rank);

        // Save message for asking
        manager.saveMessage(`You asked for ${rank}.`);
        messageBox.updateMessages();


        if (ok) {
            manager.saveMessage(`You got one or more ${rank}s!`);
            messageBox.updateMessages();
        } else {
            manager.saveMessage(`No ${rank}s. Go fish!`);
            messageBox.updateMessages();
            manager.nextTurn();
        }

        renderHand(scene, player, manager, messageBox);

        if (manager.isGameOver()) {
            const winner = manager.players[0].books.length > manager.players[1].books.length ? 'You' : 'Computer';
            manager.saveMessage(`Game over! Winner: ${winner}`);
            scene.scene.start('GameOver', { winner });
            return;
        }

        if (manager.turnIndex === 0) {
            scene.time.delayedCall(500, () => Asker(scene, player, manager, messageBox));
        } else {
            scene.time.delayedCall(1000, () => {
                handleAITurn(manager, scene, messageBox);
                scene.time.delayedCall(1100, () => {
                    if (manager.isGameOver()) {
                        const winner = manager.players[0].books.length > manager.players[1].books.length ? 'You' : 'Computer';
                        manager.saveMessage(`Game over! Winner: ${winner}`);
                        scene.scene.start('GameOver', { winner });
                    } else {
                        Asker(scene, player, manager, messageBox);
                    }
                });
            });
        }
    });

    update();
}
