import { Routes } from '@angular/router';
import {GameMainMenuComponent} from './game-main-menu/game-main-menu.component';
import {GameComponent} from './game/game.component';


export const routes: Routes = [
    {path: "main", component: GameMainMenuComponent},
    {path: "game", component: GameComponent}
];
