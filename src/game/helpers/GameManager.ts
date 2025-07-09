import { Deck } from './Deck';
import { Player } from './Player';


export class GameManager {
    deck: Deck;
    players: Player[];
    turnIndex: number = 0;
    messages: string[] = [];

    constructor(playerNames: string[]) {
        this.deck = new Deck();
        this.deck.shuffle();

        this.players = playerNames.map(name => new Player(name));
        this.players.forEach(player => {
            player.addCards(this.deck.draw(7));
        });
    }

    nextTurn() {
        this.turnIndex = (this.turnIndex + 1) % this.players.length;
    }


    askPlayerForCard(asker: Player, responder: Player, value: string): boolean {
        if (responder.hasValue(value)) {
            const taken = responder.removeCards(value);
            asker.addCards(taken);
            this.checkForBooks(asker);
            return true;
        } else {
            let drawn: ReturnType<Deck['draw']>;
            if (this.deck.isEmpty()) {
                drawn = [];
                this.saveMessage("Deck is empty, no cards to draw.");
            } else {
                drawn = this.deck.draw(1);
            }
            asker.addCards(drawn);
            this.checkForBooks(asker);
            return false;
        }
    }

    drawCard(player: Player): string[] {
        if (this.deck.isEmpty()) {
            this.saveMessage("Deck is empty, no cards to draw.");
            return [];
        }

        const drawn = this.deck.draw(1);
        player.addCards(drawn);
        return drawn;
    }

    saveMessage(message: string) {
        this.messages.push(message);
        console.log(message);
    }
    
    getLastFiveMessages(messages: string[]): string[] {
        return messages.slice(-5);
    }


    isGameOver(): boolean {
        return this.deck.isEmpty() && this.players.every(p => p.hand.length === 0);
    }


    checkForBooks(player: Player): string[] {
        const counts: { [value: string]: number } = {};

        // Count occurrences of each rank
        player.hand.forEach(card => {
            const value = card.split('-')[1];
            counts[value] = (counts[value] || 0) + 1;
        });

        const completedBooks: string[] = [];

        for (const value in counts) {
            // If a player has 4 cards of the same rank, they complete a book
            if (counts[value] === 4) {
                player.removeCards(value);
                player.books.push(value);
                completedBooks.push(value);
            }
        }

        if (completedBooks.length > 0) {
            this.saveMessage(`Player ${player.name} has book(s): ${completedBooks.join(', ')}`);
        }

        return completedBooks;
    }
}
