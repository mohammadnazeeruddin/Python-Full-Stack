import { MouseEvent } from '@agm/core';
import { Component } from '../../node_modules/@angular/core';
interface marker {
	lat: number;
	lng: number;
	label?: string;
  draggable: boolean;
  toggleButtonName: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})

export class AppComponent  {
  // google maps zoom level
  zoom: number = 8;
  newMarker: string;
  
  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  addMarker() {
    this.markers.push({
		  lat: 51.673858,
		  lng: 7.815982,
		  label: this.newMarker,
      draggable: false,
      toggleButtonName: 'Edit'
	  })
  }

  editMarker(i: number,m: marker) {
    if(m.toggleButtonName === 'Edit'){ 
      this.markers[i].draggable = true;
      this.markers[i].toggleButtonName = 'Update';
      this.newMarker = m.label;
      return;
    }
    this.updateMarkerName(i,m)
  }

  updateMarkerName(i: number,m: marker) {
    this.markers[i].label = this.newMarker
    this.markers[i].toggleButtonName = 'Edit';
    this.markers[i].draggable = false;
  }

  deleteMarker(i: number){
    this.newMarker = '';
    this.markers.splice(i,1);
  }

markerDragEnd(m: marker, $event: MouseEvent) {
   this.markers.map((data) => {
        if(data.label === m.label){
           data.lat = $event.coords.lat;
           data.lng = $event.coords.lng;
        }
   })

}
  
  markers: marker[] = [
	  {
		  lat: 51.673858,
		  lng: 7.815982,
		  label: 'A',
      draggable: false,
      toggleButtonName: 'Edit'
	  },
	  {
		  lat: 51.373858,
		  lng: 7.215982,
		  label: 'B',
      draggable: false,
      toggleButtonName: 'Edit'
	  },
	  {
		  lat: 51.723858,
		  lng: 7.895982,
		  label: 'C',
      draggable: false,
      toggleButtonName: 'Edit'
	  }
  ]

}



