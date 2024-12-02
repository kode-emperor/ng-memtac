import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CircleIconComponent } from './shared/icons/circle-icon.component';
import { CloseIconComponent } from './shared/icons/close-icon.component';
import { GamePieceComponent } from "./components/game-piece/game-piece.component";
import { AsteriskComponent } from './shared/icons/asterisk.component';

enum PlayerTypes {
  PLAYER1 = 'X',
  PLAYER2 = 'O',
  UNKNOWN = '?'
};

interface Move {
    player: PlayerTypes;
    piece_index: number;
}
function isHorizontalWin(moves: Map<number, PlayerTypes>, move: Move) {
    const left = [];
}


enum TacIterTypes {
    H,
    V,
    D
}

class Memtac  {
    
}

/*
function TacGridIterator(iter_type = H, startIndex: number) {
    const arr = [...Array(9).keys()];
    let left = -1;
    let right = -1;
    const rowSize = 3;
    const tacGridIterator = {
	next() {
	    if(iter_type === TacIterTypes.H) {
		const row0 = arr.slice(rowSize * 0, rowSize + (rowSize*0));
		const row1 = arr.slice(rowSize * 1, rowSize + (rowSize * 1));
		const row2 = arr.slice(rowSize * 2, rowSize + (rowSize * 2));
		
		if(row0.includes(startIndex)) {
		    return {value: row0, done: true}  
		
	    }
	}
    }
    return tacGridIterator;
}*/
/*
  tgi = TGI
  tgi.next()
  for(let i of tgi) {
  
  }

*/
const imports = [
  RouterOutlet,
  CircleIconComponent,
  CloseIconComponent,
  AsteriskComponent,
  GamePieceComponent,
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
  isValidMove = signal(true);
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
    this.clickedIndex.update(() => index);
    console.log('Player before move is: '+ this.player())
    this.makeMove(this.player(), this.clickedIndex())
    this.changePlayer(this.player())
    console.log('Player after move is: '+ this.player())
  }

  changePlayer(player: PlayerTypes) {
    if(player === PlayerTypes.PLAYER1) {
      this.player.update(() => PlayerTypes.PLAYER2);
      return;
    }
    if(player === PlayerTypes.PLAYER2) {
      this.player.update(() => PlayerTypes.PLAYER1);
      return;
    }
    this.player.update(() => PlayerTypes.UNKNOWN);
    return;
  }
  handleSelectedPlayer(player: PlayerTypes) {
    this.player.update(() => player);
  }
}
