import { Component, computed, signal,Signal,
         WritableSignal,  AfterViewChecked, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CircleIconComponent } from './shared/icons/circle-icon.component';
import { CloseIconComponent } from './shared/icons/close-icon.component';
import { GamePieceComponent } from "./components/game-piece/game-piece.component";
import { AsteriskComponent } from './shared/icons/asterisk.component';
import { PlayerTypes, PieceStatus, MemtacService, helpers, gameStateEqual } from './services/memtac.service';
import {MapObjectify } from './map-objectify.pipe';
import { JsonPipe } from '@angular/common';

const imports = [
    RouterOutlet,
    CircleIconComponent,
    CloseIconComponent,
    AsteriskComponent,
    GamePieceComponent,
    MapObjectify,
    JsonPipe
]
@Component({
    selector: 'app-root',
    imports: [imports],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewChecked{
    title = 'ng-memtac';
    memtacService = inject(MemtacService);
    PLAYER_TYPES = PlayerTypes;
    clickedIndex = signal<number>(-1);
    isValidMove = signal(true);
    player:Signal<PlayerTypes>;
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
    }

    handleClick(event: Event, index: number) {
        if(gameStateEqual(this.memtacService.gameStatus(), 
        this.helpers_.GAMESTATE.INPROGRESS)) {
            console.log(`click index is: ${index}`);
            this.clickedIndex.update(() => index);
            console.log('Player before move is: ' + this.player())
            this.makeMove(this.clickedIndex())
        }
        if(gameStateEqual(this.memtacService.gameStatus(), this.helpers_.GAMESTATE.OVER)) {
            alert(`Game over player ${this.player()} won`);

        }

        console.log(`game status: ${this.memtacService.gameStatus()}`)
        //console.log(this.memtacService.gameStatus());
        let stats = this.memtacService.gameStatus();
        Object.defineProperty(globalThis, 'gamestat', {
            value: stats
        })
    }   
}
