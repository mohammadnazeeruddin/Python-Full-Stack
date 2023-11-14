import { renderLayout, renderLayoutH, renderPage } from './routes.helper';

// Use body as root so layout is not
// affected by extra elements
BlazeLayout.setRoot('body');

// Default route
FlowRouter.route('/', {
    name: '/',
    action: () => FlowRouter.go('/singleview')
});


FlowRouter.route('/singleview', {
    name: 'singleview',
    action: renderLayout('singleview')
});

FlowRouter.route('/submenu', {
    name: 'submenu',
    action: renderLayout('submenu')
});

// Router transitions

Tracker.autorun(function() {
    FlowRouter.watchPathChange();
    // Hide sidebar
    $('body').removeClass('aside-toggled')

    // Animate page transitions
    var ANIMATION_CLASS = 'fadeIn'; // see animate.css
    var ANIMATION_EVENTS = 'animationend webkitAnimationEnd oanimationend MSAnimationEnd';
    var wrapper = $('.content-wrapper').addClass('animated')

    wrapper
        // detach previous events
        .off(ANIMATION_EVENTS)
        // attach new event
        .on(ANIMATION_EVENTS, function() {
            // remove animation and prepare for next transition
            wrapper.removeClass(ANIMATION_CLASS)
        })
        // start animation
        .addClass(ANIMATION_CLASS);

});