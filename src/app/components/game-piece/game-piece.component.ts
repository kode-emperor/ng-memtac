import { Component, input } from '@angular/core';

@Component({
  selector: 'game-piece',
  imports: [],
  templateUrl: './game-piece.component.html',
  styleUrl: './game-piece.component.css'
})
export class GamePieceComponent {
  invalid = input(true)
  errorClass = input('')
}
