
import { StateToggler } from '/imports/scripts/modules/toggle-state.js';
import initTranslation from '/imports/scripts/modules/localize.js';

Template.layout.onRendered(initLayout);
Template.layouth.onRendered(initLayout);

function initLayout() {

    // Restore body classes
    // -----------------------------------
    var $body = $('body');
    new StateToggler().restoreState( $body );

    // enable settings toggle after restore
    $('#chk-fixed').prop('checked', $body.hasClass('layout-fixed') );
    $('#chk-collapsed').prop('checked', $body.hasClass('aside-collapsed') );
	$('#chk-collapsed-text').prop('checked', $body.hasClass('aside-collapsed-text') );
    $('#chk-boxed').prop('checked', $body.hasClass('layout-boxed') );
    $('#chk-float').prop('checked', $body.hasClass('aside-float') );
    $('#chk-hover').prop('checked', $body.hasClass('aside-hover') );

    // When ready display the offsidebar
    $('.offsidebar.d-none').removeClass('d-none');

    // DROPDOWN INPUTS
    $('.dropdown input').on('click focus', function(event){
      event.stopPropagation();
    });

    // Init translation system
    initTranslation();

}
