import { Component, ViewChild } from '@angular/core';
import { PhaserGame } from './phaser-game.component';
import { CommonModule } from '@angular/common';
import { EventBus } from '../game/EventBus';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PhaserGame],
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild(PhaserGame, { static: true }) phaserRef!: PhaserGame;

  constructor() {}
}
