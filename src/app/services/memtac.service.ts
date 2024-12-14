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

@Injectable({
    providedIn: 'root'
})
export class MemtacService {
    private INDICES = [...Array(9).keys()];
    helpers_ = helpers();
    player = signal(PlayerTypes.UNKNOWN);
    pieces = signal(this.makePieces());
    
    gameStatus = signal<GameState>({started: false, ended: false})
    constructor() {
        
    }
    
    public getPieces() { return  computed(() => this.pieces());} // readonly pieces
    public playerHasWon = signal({ status: false, player: PlayerTypes.UNKNOWN });

    start() {
        this.player.update(() => PlayerTypes.PLAYER1);
        this.gameStatus.update(() => this.helpers_.GAMESTATE.INPROGRESS);
    }

    public nextTurn() {
        if (this.player() === PlayerTypes.PLAYER1) {
            return PlayerTypes.PLAYER2;
        }
        if (this.player() === PlayerTypes.PLAYER2) {
            return PlayerTypes.PLAYER1;
        }
        return PlayerTypes.UNKNOWN;
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
        const success = await this.updatePieces(index, this.player());
        if (!success) {
            return;
        }
        for (const callback of callbacks) {
            let win = this.isWinningMoveFor(
                index, this.player(), callback);
            if (win) {
                this.playerHasWon.update(() => ({ status: true, player: this.player() }));
                return;
            }
        }
    }

    public getPlayer() {
        return computed(() => this.player());
    }

    row0 = () => this.INDICES.slice(0, 3);
    row1 = () => this.INDICES.slice(3, 6);
    row2 = () => this.INDICES.slice(6, 9);

    col0 = () => this.INDICES.filter(index => index % 3 == 0 && index)
    col1 = () => this.INDICES.filter(index => [1, 4, 7].includes(index));
    col2 = () => this.INDICES.filter(index => [2, 5, 8].includes(index));

    diag0 = () => this.INDICES.filter(index => index % 4 === 0)
    diag1 = () => this.INDICES.filter(index => index > 0 && index % 2 === 0 && index <= 6)


    isWinningMoveFor(index: number, player: PlayerTypes, callback: () => number[]) {
        let self = this;
        const winningIndices = callback();
        alert("winning indices are" + winningIndices);
        const inWinningIndices = winningIndices[index];
        if (!inWinningIndices) {
            return false;
        }
        const result = winningIndices.map(winIndex => self.pieces().get(winIndex)?.player === player)
            .reduce((pieceA, pieceB) => pieceA === pieceB)

        return result;
    }


    private updatePieces(index: number, player: PlayerTypes) {
        const self = this;
        let newMap = new Map<number, PieceStatus>(this.pieces());

        let piece: PieceStatus | undefined = newMap.get(index);
     
        return new Promise((resolve, reject) => {
            if ( piece && (!piece.occupied)) {
                piece.player = player;
                piece.occupied = true;
                newMap.set(index, piece);
                self.pieces.update(() => newMap);
                resolve(true)
            } else {
                reject(false)
            }
        })

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
