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
  AsteriskComponent,
  GamePieceComponent,
  SquareComponent
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

  pieces = signal(
    new Map([...Array(9)].map((_, index: number) => [index, { occupied: false, player: PlayerTypes.UNKNOWN }]))
  );
  comp_pieces = computed( () => {
    let conv_map = new Map();
    this.pieces().forEach( (value, index) => {
      conv_map.set(index, value.player)
    })
    return conv_map;
  })

  updateMap(
    map: Map<number, { occupied: boolean, player: PlayerTypes }>,
    index: number, occupied: boolean, player: PlayerTypes) {
    let newValues = { occupied: occupied, player: player };
    let newMap = new Map(map);
    newMap.set(index, newValues);
    return newMap;
  }
  makeMove(player: PlayerTypes, pieceIndex: number) {
    //an invalid move is one that moves to an occupied square
    let valid = false;
    console.log(`map before : ${this.pieces()}`)
    if (!this.pieces().has(pieceIndex)) {
      this.isValidMove.update(() => valid);
      return;
    }
    const occupied = (this.pieces().get(pieceIndex)?.player !== PlayerTypes.UNKNOWN) || false;
    if (!occupied) {

      this.pieces.update(pieces => this.updateMap(pieces, pieceIndex, true, player));
      valid = true;
    }
    if (!valid) {
      console.log(`Invalid move to piece at ${pieceIndex}`);
    }
    this.isValidMove.update(() => valid);
    console.log('map after :')
    console.log(this.pieces())
    
  }

  handleClick(event: Event, index: number) {
    console.log(`click index is: ${index}`);
    this.clickedIndex.update( () => index)
  }

  handleSelectedPlayer(player: PlayerTypes){
    this.player.update( () => player);
  }
}
