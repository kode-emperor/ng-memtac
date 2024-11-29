import { Component, input} from '@angular/core';

@Component({
  selector: 'square-icon',
  imports: [],
  template: `
  <svg
  class="fill-current {{iconSize()}}"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M17 7H7V17H17V7ZM4 4V20H20V4H4Z"
  />
</svg>`,
})
export class SquareComponent {
  iconSize = input('w-24')
}
