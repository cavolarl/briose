import Phaser from 'phaser';
import { setTheme, themes, currentTheme } from '../EventBus';

export class ThemeSelection extends Phaser.Scene {
    constructor() {
        super({ key: 'ThemeSelection' });
    }

    preload() {
    }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor(currentTheme.backgroundColor);

        this.add.text(width / 2, height / 2 - 200, 'Select Theme', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        const menuOptions = themes.map(theme => ({ text: theme.name, action: () => setTheme(theme) }));
        menuOptions.push({ text: 'Back', action: () => this.scene.start('MainMenu') });

        let selectedOptionIndex = 0;
        const optionTexts: Phaser.GameObjects.Text[] = [];

        let yOffset = -50;
        menuOptions.forEach((option, index) => {
            const optionText = this.add.text(width / 2, height / 2 + yOffset, option.text, {
                fontSize: '32px',
                color: currentTheme.textColor,
                fontFamily: 'Arial',
            }).setOrigin(0.5);
            optionTexts.push(optionText);
            yOffset += 80;
        });

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
                menuOptions[selectedOptionIndex].action();
                this.scene.start('MainMenu');
            });
        }

        updateSelection();
    }
}
