import initSlimsSroll from '/imports/scripts/modules/slimscroll.js';
import initSparkLine from '/imports/scripts/modules/sparkline.js';

Template.bugTracker.onRendered(function() {

    // Sparkline
    initSparkLine()

    // Datatable (zero config)
    $('#datatable1').dataTable({
        responsive: true
    });

    // Slimscroll
    initSlimsSroll();

})
