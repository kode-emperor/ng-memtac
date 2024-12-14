import { Component, computed, signal,Signal,
         WritableSignal,  AfterViewChecked, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CircleIconComponent } from './shared/icons/circle-icon.component';
import { CloseIconComponent } from './shared/icons/close-icon.component';
import { GamePieceComponent } from "./components/game-piece/game-piece.component";
import { AsteriskComponent } from './shared/icons/asterisk.component';
import { PlayerTypes, PieceStatus, MemtacService } from './services/memtac.service';
import {MapObjectify } from './map-objectify.pipe';

const imports = [
    RouterOutlet,
    CircleIconComponent,
    CloseIconComponent,
    AsteriskComponent,
    GamePieceComponent,
    MapObjectify
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
    
    comp_pieces = computed(() => {
        let conv_map = new Map();
        this.memtacService.getPieces().forEach((value: PieceStatus, index: number) => {
            conv_map.set(index, value.player)
        })
        return conv_map;
    })
    constructor() {
        this.player = this.memtacService.getPlayer();
    }

    ngAfterViewChecked() {
        
    }
    
    async makeMove(pieceIndex: number) {
        await this.memtacService.makeMove(pieceIndex);
    }

    handleClick(event: Event, index: number) {
        
        console.log(`click index is: ${index}`);
        this.clickedIndex.update(() => index);
        console.log('Player before move is: ' + this.player())
        this.makeMove(this.clickedIndex())

    }   
}
