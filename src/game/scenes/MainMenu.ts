import Phaser from 'phaser';
import { currentTheme } from '../EventBus';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Add assets to load here later
    }

    create() {
        const { width, height } = this.scale;

        // Add a background color
        this.cameras.main.setBackgroundColor(currentTheme.backgroundColor);

        // Add a title text
        this.add.text(width / 2, height / 2 - 100, 'briose', {
            fontSize: '48px',
            color: currentTheme.textColor,
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        const menuOptions = [
            { text: 'Play', scene: 'GameScene' },
            { text: 'Themes', scene: 'ThemeSelection' },
        ];

        let selectedOptionIndex = 0;
        const optionTexts: Phaser.GameObjects.Text[] = [];

        menuOptions.forEach((option, index) => {
            const optionText = this.add.text(width / 2, height / 2 + index * 80, option.text, {
                fontSize: '32px',
                color: currentTheme.textColor,
                fontFamily: 'Arial',
            }).setOrigin(0.5);
            optionTexts.push(optionText);
        });

        // Add a text below the menu options
        this.add.text(width / 2, height - 50, 'Use UP/DOWN to navigate, ENTER to select', {
            fontSize: '20px',
            color: currentTheme.textColor,
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        const updateSelection = () => {
            optionTexts.forEach((text, index) => {
                text.setColor(index === selectedOptionIndex ? '#FFD700' : currentTheme.textColor);
            });
        };

        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-DOWN', () => {
                selectedOptionIndex = (selectedOptionIndex + 1) % menuOptions.length;
                updateSelection();
            });

            this.input.keyboard.on('keydown-UP', () => {
                selectedOptionIndex = (selectedOptionIndex - 1 + menuOptions.length) % menuOptions.length;
                updateSelection();
            });

            this.input.keyboard.on('keydown-ENTER', () => {
                this.scene.start(menuOptions[selectedOptionIndex].scene);
            });
        }

        updateSelection();
    }
}
