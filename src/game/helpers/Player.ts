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

    // Logic to check for books (four of a kind)
    checkForBooks(): string[] {
        const counts: { [value: string]: number } = {};

        // Count occurrences of each rank
        this.hand.forEach(card => {
            const value = card.split('-')[1];
            counts[value] = (counts[value] || 0) + 1;
        });

        const completedBooks: string[] = [];

        for (const value in counts) {
            if (counts[value] === 4) {
                this.removeCards(value);
                this.books.push(value);
                completedBooks.push(value);
            }
        }

        console.log(`${this.name} completed books: ${completedBooks.join(', ')}`);

        return completedBooks;
    }
}
