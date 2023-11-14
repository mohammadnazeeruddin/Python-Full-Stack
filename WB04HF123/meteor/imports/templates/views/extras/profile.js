import initGoogleMaps from '/imports/templates/views/maps/gmap.js';

Template.profile.onRendered(function() {

    // Google Maps
    initGoogleMaps();

})
