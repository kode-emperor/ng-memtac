import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapObjectify'
})
export class MapObjectify implements PipeTransform {

    transform<Key,Val>(value: Map<Key,Val>) {
        let obj = {};
        /*value.forEach((v,k) => {
            obj[k] = v;
        });*/
      return obj;
  }

}
