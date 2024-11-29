import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CircleIconComponent } from './shared/icons/circle-icon.component';
import { CloseIconComponent } from './shared/icons/close-icon.component';
import { GamePieceComponent } from "./components/game-piece/game-piece.component";



enum PlayerTypes { 
  PLAYER1 = 'X',
  PLAYER2 = 'O',
  UNKNOWN = '?'
};

const imports = [
  RouterOutlet,
  CircleIconComponent,
  CloseIconComponent,
  GamePieceComponent
]
@Component({
  selector: 'app-root',
  imports: [imports],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'srv';
  PLAYER_TYPES = PlayerTypes;
  clickedIndex = signal<number>(-1);
  player = signal<PlayerTypes>(PlayerTypes.UNKNOWN)
  nextPlayer = computed( () => (this.player() === PlayerTypes.PLAYER1) ? PlayerTypes.PLAYER2 : PlayerTypes.PLAYER1);

  handleClick(event: Event, index: number) {
    console.log(`click index is: ${index}`);
    this.clickedIndex.update( () => index)
  }

  handleSelectedPlayer(player: PlayerTypes){
    this.player.update( () => player);
  }
}
