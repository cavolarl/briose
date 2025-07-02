import { Events } from 'phaser';
import { Theme } from './themes';

// Used to emit events between components, HTML and Phaser scenes
export const EventBus = new Events.EventEmitter();

export const themes: Theme[] = [
    { name: 'Default', backgroundColor: '#24252A', cardBack: 'card-back1', buttonColor: 0x4ecca3, textColor: '#232931' },
    { name: 'Forest', backgroundColor: '#34495e', cardBack: 'card-back2', buttonColor: 0x2e8b57, textColor: '#ecf0f1' },
    { name: 'Ocean', backgroundColor: '#3498db', cardBack: 'card-back3', buttonColor: 0x4682b4, textColor: '#ecf0f1' },
];

export let currentTheme: Theme = themes[0];

export function setTheme(theme: Theme) {
    currentTheme = theme;
    EventBus.emit('theme-selected', theme);
}
