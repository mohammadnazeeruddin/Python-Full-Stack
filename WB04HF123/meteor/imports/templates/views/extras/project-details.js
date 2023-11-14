import initSlimsSroll from '/imports/scripts/modules/slimscroll.js';
import initSparkLine from '/imports/scripts/modules/sparkline.js';

Template.projectDetails.onRendered(function() {

    // Sparkline
    initSparkLine()

    // Slimscroll
    initSlimsSroll();

})
