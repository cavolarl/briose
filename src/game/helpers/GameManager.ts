import { Deck } from './Deck';
import { Player } from './Player';

export class GameManager {
    deck: Deck;
    players: Player[];
    currentPlayerIndex: number = 0;

    constructor(playerNames: string[]) {
        this.deck = new Deck();
        this.deck.shuffle();

        this.players = playerNames.map(name => new Player(name));
        this.players.forEach(player => {
            player.addCards(this.deck.draw(7));
        });
    }

    get currentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    askPlayerForCard(asker: Player, responder: Player, value: string): boolean {
        if (responder.hasValue(value)) {
            const taken = responder.removeCards(value);
            asker.addCards(taken);
            asker.checkForBooks();
            return true; // successful guess
        } else {
            const drawn = this.deck.draw(1);
            asker.addCards(drawn);
            asker.checkForBooks();
            return false; // go fish
        }
    }

    isGameOver(): boolean {
        return this.deck.isEmpty() && this.players.every(p => p.hand.length === 0);
    }
}
