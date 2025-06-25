import { Game as MainGame } from './scenes/Game';
import { AUTO, Game } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [MainGame],
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    }
};




const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
