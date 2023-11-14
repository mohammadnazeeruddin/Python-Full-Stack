import { initNotify } from './notify.js';

Template.notifications.onRendered(function() {

    // Notifiy
    initNotify();

    // POPOVER
    $('[data-toggle="popover"]').popover({
        trigger: "focus"
    });

    // TOOLTIP
    $('[data-toggle="tooltip"]').tooltip({
      container: 'body'
    });

})
