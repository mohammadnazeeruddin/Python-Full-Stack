import initGoogleMaps from '/imports/templates/views/maps/gmap.js';
import initSparkLine from '/imports/scripts/modules/sparkline.js';

Template.widgets.onRendered(function(){

    // Google Maps
    initGoogleMaps();

    // Sparkline
    initSparkLine()

})
