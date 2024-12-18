import { Component, computed, signal,Signal,
         WritableSignal,  AfterViewChecked, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CircleIconComponent } from './shared/icons/circle-icon.component';
import { CloseIconComponent } from './shared/icons/close-icon.component';
import { GamePieceComponent } from "./components/game-piece/game-piece.component";
import { AsteriskComponent } from './shared/icons/asterisk.component';
import {MapObjectify } from './map-objectify.pipe';
import { JsonPipe } from '@angular/common';
import { PlayerTypes, PieceStatus, MemtacService, helpers, gameStateEqual } from './services/memtac.service';

const imports = [
    CircleIconComponent,
    CloseIconComponent,
    AsteriskComponent,
    GamePieceComponent,
    MapObjectify,
    JsonPipe
]

@Component({
  selector: 'app-game',
  imports: [imports],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
    title = 'game';

    memtacService = inject(MemtacService);
    PLAYER_TYPES = PlayerTypes;
    clickedIndex = signal<number>(-1);
    isValidMove = signal(true);
    player:Signal<PlayerTypes>;
    prevMove = signal({player: PlayerTypes.UNKNOWN, index: -1});
    stateEq = gameStateEqual;
    
    status = () => {
        const stat = this.memtacService.getStatus();
        return stat();
    }

    helpers_ = helpers();
    comp_pieces = computed(() => {
        let conv_map = new Map();
        this.memtacService.getPieces().forEach((value: PieceStatus, index: number) => {
            conv_map.set(index, value.player)
        })
        return conv_map;
    })
    constructor() {
        this.player = this.memtacService.getPlayer();
        //sssthis.memtacService.start();
    }

    ngAfterViewChecked() {
        
    }
    
    makeMove(pieceIndex: number) {
        this.memtacService.makeMove(pieceIndex);
        this.prevMove.update(() => ({player: this.player(), index: pieceIndex}));
    }

    handleClick(event: Event, index: number) {
        if(gameStateEqual(this.status(), 
        this.helpers_.GAMESTATE.INPROGRESS)) {
            this.clickedIndex.update(() => index);
            this.makeMove(this.clickedIndex())
        }
        if(gameStateEqual(this.status(), this.helpers_.GAMESTATE.OVER)) {
            alert(`Game over player ${this.player()} won`);

        }
        
    }   
}
