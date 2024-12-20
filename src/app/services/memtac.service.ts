import { Injectable, signal, computed } from '@angular/core';

export enum PlayerTypes {
    PLAYER1 = 'x',
    PLAYER2 = 'o',
    UNKNOWN = '?'
}

export interface PieceStatus {
    occupied: boolean;
    player: PlayerTypes;
}

export interface GameState {
    started: boolean;
    ended: boolean;
}

export function helpers() {
    return {
        GAMESTATE: {
            OVER: { started: true, ended: true },
            INPROGRESS: { started: true, ended: false }
        }
    }
}

export function gameStateEqual(s1: GameState, s2: GameState) {
    return (s1.started === s2.started) && (s1.ended === s2.ended);
}

function consoleCss() {
    const defaultStyle = "font-size: 18px; font-family: sans-serif;";
    return {
        info: `${defaultStyle}; color: #212529`,
        error: `${defaultStyle}; color: #BC4749; background-color: #F2E8CF;`
    }
}
@Injectable({
    providedIn: 'root'
})
export class MemtacService {
    private INDICES = [...Array(9).keys()];
    private helpers_ = helpers();
    private player = signal(PlayerTypes.UNKNOWN);
    private pieces = signal(this.makePieces());
    
    private gameStatus = signal<GameState>({started: false, ended: false})

    row0 = () => {
        const indices =  this.INDICES.slice(0, 3)
        console.log(`row0 indices`, indices);
        return indices;
    };
    
    row1 = () => this.INDICES.slice(3, 6);
    row2 = () => this.INDICES.slice(6, 9);

    col0 = () => this.INDICES.filter(index => index % 3 == 0 && index <= 6)
    col1 = () => this.INDICES.filter(index => [1, 4, 7].includes(index));
    col2 = () => this.INDICES.filter(index => [2, 5, 8].includes(index));

    diag0 = () => this.INDICES.filter(index => index % 4 === 0)
    diag1 = () => this.INDICES.filter(index => index > 0 && index % 2 === 0 && index <= 6)

    constructor() {
        this.player.update(() => PlayerTypes.PLAYER1);
        this.gameStatus.update(() => this.helpers_.GAMESTATE.INPROGRESS);
    }
    
    public getPlayer() {
        return computed(() => this.player());
    }

    public getPieces() { return  this.pieces();} // readonly pieces

    public getStatus() {
        return computed( () => this.gameStatus());
    }

    public playerHasWon = signal({ status: false, player: PlayerTypes.UNKNOWN });

    public restart() {
        this.player.update(() => PlayerTypes.PLAYER1);
        this.gameStatus.update(() => this.helpers_.GAMESTATE.INPROGRESS);
    }
    
    public nextTurn() {
        if (this.player() === PlayerTypes.PLAYER1) {
             this.player.update(() => PlayerTypes.PLAYER2);
             return;
        }
        if (this.player() === PlayerTypes.PLAYER2) {
            this.player.update(() => PlayerTypes.PLAYER1);
            return;
        }
        this.player.update(() =>PlayerTypes.UNKNOWN);
    }

    public async makeMove(index: number) {
        const callbacks = [
            this.row0,
            this.row1,
            this.row2,

            this.col0,
            this.col1,
            this.col2,

            this.diag0,
            this.diag1
        ];
        //TODO
        //ensure we mark dead
        // winnings so we dont include them
        //in the search algorithm
        const success = this.updatePieces(index, this.player());
        if (!success) {
            return;
        }
        let win = false;
        for (const callback of callbacks) {
            win = this.isWinningMoveFor(
                index, this.player(), callback);
            if (win) {
                this.playerHasWon.update(() => ({ status: true, player: this.player() }));
                this.gameStatus.update(() => this.helpers_.GAMESTATE.OVER);
                return;
            }
        }
        this.nextTurn();
    }

    private isWinningMoveFor(index: number, player: PlayerTypes, callback: () => number[]) {
        let self = this;
        const winningIndices = callback();
        const inWinningIndices = winningIndices.includes(index)
        if (!inWinningIndices) {
            return false;
        }
        const hasWon = winningIndices.map(winIndex => self.pieces().get(winIndex)?.player === player)
            .reduce((pieceA, pieceB) => pieceA && pieceB)
        return hasWon;
    }

    private updatePieces(index: number, player: PlayerTypes) {
        let value: PieceStatus = {occupied: true, player: player}
        //index out of valid range [0 - 8]
        if(!this.pieces().get(index)) {
            return false;
        }
        //piece is occupied
        if(this.pieces().get(index)?.occupied) {
            return false;
        }
        let map = new Map(this.pieces());
        map.set(index, value);
        this.pieces.update(pieces => map);
        return true;
    }
    
    private makePieces(): Map<number, PieceStatus> {
        let initialPieceData = {
            occupied: false,
            player: PlayerTypes.UNKNOWN
        };

        let newMap = new Map(
            this.INDICES.map(index => [index, initialPieceData]));
        return newMap;
    }

}
