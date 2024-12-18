import { Component, computed, signal,Signal,
         WritableSignal,  AfterViewChecked, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MapObjectify } from './map-objectify.pipe';
import { JsonPipe } from '@angular/common';

const imports = [
    RouterOutlet,    
]
@Component({
    selector: 'app-root',
    imports: [imports],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewChecked{
    title = 'ng-memtac';

    ngAfterViewChecked() {
        
    }  
}

