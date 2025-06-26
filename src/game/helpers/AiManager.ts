import { GameManager } from './GameManager';
import { renderHand } from './renderHand';
import { Scene } from 'phaser';
import { Asker } from './Asker';

export function handleAITurn(manager: GameManager, scene: Scene) {
    const ai = manager.players[1];
    const player = manager.players[0];

    const values = Array.from(new Set(ai.hand.map(c => c.split('-')[1])));
    const chosenValue = Phaser.Utils.Array.GetRandom(values);

    console.log(`AI asks for ${chosenValue}`);

    const success = manager.askPlayerForCard(ai, player, chosenValue);

    if (!success) {
        console.log(`AI asked for ${chosenValue}, but you have no cards of that value.`);
        const drawn = manager.deck.draw(1);
        ai.addCards(drawn);
        ai.checkForBooks();
        console.log(`AI drew a card from the deck.`);

        renderHand(scene, player, manager);

        // End AI turn after delay
        scene.time.delayedCall(1000, () => {
            manager.nextTurn();
            renderHand(scene, player, manager);
            if (manager.turnIndex === 0) {
                Asker(scene, player, manager);
            }
        });

    } else {
        console.log(`AI successfully asked for ${chosenValue}.`);
        ai.checkForBooks();
        renderHand(scene, player, manager);

        // Continue AI turn after delay
        scene.time.delayedCall(1000, () => {
            handleAITurn(manager, scene);
        });
    }
}
