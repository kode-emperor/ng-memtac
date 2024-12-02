import { Injectable, signal, computed, WritableSignal } from '@angular/core';

enum PlayerTypes {
  PLAYER1 = 'X',
  PLAYER2 = 'O',
  UNKNOWN = '?'
};
    
@Injectable({
  providedIn: 'root'
})
export class MemtacService {

    pieces = signal(this.makePieces());

    //update to Object.defineProperty syntax
    pieces = {
	set(newPieces: WritableSignal<Map<number, { occupied: boolean, player: PlayerTypes.UNKNOWN}) {
	    this.value = newPieces;
	},
	value: signal(this.makePieces)
    };
    
    constructor() { }

    private makePieces(): Map<number, {occupied: boolean, player: PlayerTypes}> {
	const arr = [...Array(9).keys()];		
	let map = new Map([...Array(9)].map((_, index: number) => [index, { occupied: false, player: PlayerTypes.UNKNOWN }]));
	return map;			  	    
    }
        
}
