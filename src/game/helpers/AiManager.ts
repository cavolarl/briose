import { GameManager } from './GameManager';
import { renderHand } from './renderHand';
import { Scene } from 'phaser';
import { MessageBox } from './MessageHandler';

export function handleAITurn(manager: GameManager, scene: Scene, messageBox: MessageBox) {
    const ai = manager.players[1];
    const player = manager.players[0];

    const values = Array.from(new Set(ai.hand.map(c => c.split('-')[1])));
    const chosenValue = Phaser.Utils.Array.GetRandom(values);

    const success = manager.askPlayerForCard(ai, player, chosenValue);

    if (!success) {
        manager.saveMessage(`AI asked for ${chosenValue}, but you have no cards of that value.`);
        if (manager.deck.cards.length > 0) {
            manager.saveMessage(`AI drew a card from the deck.`);
            messageBox.updateMessages();
        } else {
            manager.saveMessage(`No cards left in the deck for AI to draw.`);
            messageBox.updateMessages();
        }

        renderHand(scene, player, manager, messageBox);

        // End AI turn after delay
        scene.time.delayedCall(1000, () => {
            manager.nextTurn();
            renderHand(scene, player, manager, messageBox);
            if (manager.turnIndex === 0) {
                renderHand(scene, player, manager, messageBox);
            }
        });

    } else {
        manager.saveMessage(`AI successfully asked for ${chosenValue}.`);
        messageBox.updateMessages();
        renderHand(scene, player, manager, messageBox);

        // Continue AI turn after delay
        scene.time.delayedCall(1000, () => {
            handleAITurn(manager, scene, messageBox);
        });
    }
}
