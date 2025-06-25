// Deck class for keeping track of a standard deck of cards
export class Deck {
    cards: string[] = [];

    constructor() {
        this.reset();
    }

    reset() {
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['1','2','3','4','5','6','7','8','9','10','11','12','13'];
        this.cards = [];

        for (const suit of suits) {
            for (const value of values) {
                this.cards.push(`${suit}-${value}`);
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(count: number): string[] {
        return this.cards.splice(0, count);
    }

    isEmpty(): boolean {
        return this.cards.length === 0;
    }
}
