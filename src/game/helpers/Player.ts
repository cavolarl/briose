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
        const matches = this.hand.filter(card => card.includes(`-${value}`));
        this.hand = this.hand.filter(card => !card.includes(`-${value}`));
        return matches;
    }

    hasValue(value: string): boolean {
        return this.hand.some(card => card.includes(`-${value}`));
    }

    // Logic to check for books (four of a kind)
    checkForBooks(): string[] {
        const counts: { [value: string]: number } = {};

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

        return completedBooks;
    }
}
