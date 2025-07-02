import { GameScene } from './scenes/GameScene';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { ThemeSelection } from './scenes/ThemeSelection';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [MainMenu, GameScene, GameOver, ThemeSelection],
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    input: {
        keyboard: true
    }
};




const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
