export class Player {
    name: string;
    hand: string[] = [];
    books: string[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addCards(cards: string[]) {
        this.hand.push(...cards);
    }

    removeCards(value: string): string[] {
        // Remove only cards with exact rank match
        const matches = this.hand.filter(card => card.split('-')[1] === value);
        this.hand = this.hand.filter(card => card.split('-')[1] !== value);
        return matches;
    }

    hasValue(value: string): boolean {
        // Check for exact rank match
        return this.hand.some(card => card.split('-')[1] === value);
    }
}
