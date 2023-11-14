import { renderLayout, renderLayoutH, renderPage } from './routes.helper';

// Use body as root so layout is not
// affected by extra elements
BlazeLayout.setRoot('body');

// Default route
FlowRouter.route('/', {
    name: '/',
    action: () => FlowRouter.go('/dashboardv1')
});

// Dashboard
FlowRouter.route('/dashboardv1', {
    name: 'dashboardv1',
    action: renderLayout('dashboardv1')
});
FlowRouter.route('/dashboardv2', {
    name: 'dashboardv2',
    action: renderLayout('dashboardv2')
});
FlowRouter.route('/dashboardv3', {
    name: 'dashboardv3',
    action: renderLayout('dashboardv3')
});

// Widgets
FlowRouter.route('/widgets', {
    name: 'widgets',
    action: renderLayout('widgets')
});

// Layouts
FlowRouter.route('/dashboardh', {
    name: 'dashboardh',
    action: renderLayoutH('dashboardh')
});

// Elements

FlowRouter.route('/buttons', {
    name: 'buttons',
    action: renderLayout('buttons')
});
FlowRouter.route('/notifications', {
    name: 'notifications',
    action: renderLayout('notifications', 'notificationsModal')
});
FlowRouter.route('/sweetalert', {
    name: 'sweetalert',
    action: renderLayout('sweetalert')
});
FlowRouter.route('/carousel', {
    name: 'carousel',
    action: renderLayout('carousel')
});
FlowRouter.route('/spinners', {
    name: 'spinners',
    action: renderLayout('spinners')
});
FlowRouter.route('/dropdown-animations', {
    name: 'dropdown-animations',
    action: renderLayout('dropdownAnimations')
});
FlowRouter.route('/nestable', {
    name: 'nestable',
    action: renderLayout('nestable')
});
FlowRouter.route('/sortable', {
    name: 'sortable',
    action: renderLayout('sortable')
});
FlowRouter.route('/cards', {
    name: 'cards',
    action: renderLayout('cards')
});
FlowRouter.route('/portlets', {
    name: 'portlets',
    action: renderLayout('portlets')
});
FlowRouter.route('/grid', {
    name: 'grid',
    action: renderLayout('grid')
});
FlowRouter.route('/grid-masonry', {
    name: 'grid-masonry',
    action: renderLayout('gridMasonry')
});
FlowRouter.route('/typo', {
    name: 'typo',
    action: renderLayout('typo')
});
FlowRouter.route('/icons-font', {
    name: 'icons-font',
    action: renderLayout('iconsFont')
});
FlowRouter.route('/icons-weather', {
    name: 'icons-weather',
    action: renderLayout('iconsWeather')
});
FlowRouter.route('/colors', {
    name: 'colors',
    action: renderLayout('colors')
});


// Forms

FlowRouter.route('/form-standard', {
    name: 'form-standard',
    action: renderLayout('formStandard')
});
FlowRouter.route('/form-extended', {
    name: 'form-extended',
    action: renderLayout('formExtended')
});
FlowRouter.route('/form-validation', {
    name: 'form-validation',
    action: renderLayout('formValidation')
});
FlowRouter.route('/form-wizard', {
    name: 'form-wizard',
    action: renderLayout('formWizard')
});
FlowRouter.route('/form-upload', {
    name: 'form-upload',
    action: renderLayout('formUpload')
});
FlowRouter.route('/form-xeditable', {
    name: 'form-xeditable',
    action: renderLayout('formXeditable')
});
FlowRouter.route('/form-imagecrop', {
    name: 'form-imagecrop',
    action: renderLayout('formImagecrop')
});


// Charts

FlowRouter.route('/chart-flot', {
    name: 'chart-flot',
    action: renderLayout('chartFlot')
});
FlowRouter.route('/chart-radial', {
    name: 'chart-radial',
    action: renderLayout('chartRadial')
});
FlowRouter.route('/chart-chartjs', {
    name: 'chart-chartjs',
    action: renderLayout('chartChartJs')
});
FlowRouter.route('/chart-rickshaw', {
    name: 'chart-rickshaw',
    action: renderLayout('chartRickshaw')
});
FlowRouter.route('/chart-morris', {
    name: 'chart-morris',
    action: renderLayout('chartMorris')
});
FlowRouter.route('/chart-chartist', {
    name: 'chart-chartist',
    action: renderLayout('chartChartist')
});


// Tables

FlowRouter.route('/table-standard', {
    name: 'table-standard',
    action: renderLayout('tableStandard')
});
FlowRouter.route('/table-extended', {
    name: 'table-extended',
    action: renderLayout('tableExtended')
});
FlowRouter.route('/table-datatable', {
    name: 'table-datatable',
    action: renderLayout('tableDatatable')
});
FlowRouter.route('/table-bootgrid', {
    name: 'table-bootgrid',
    action: renderLayout('tableBootgrid')
});


// Maps

FlowRouter.route('/maps-google', {
    name: 'maps-google',
    action: renderLayout('mapsGoogle')
});
FlowRouter.route('/maps-vector', {
    name: 'maps-vector',
    action: renderLayout('mapsVector')
});


// Pages

FlowRouter.route('/login', {
    name: 'login',
    action: renderPage('login')
});
FlowRouter.route('/register', {
    name: 'register',
    action: renderPage('register')
});
FlowRouter.route('/recover', {
    name: 'recover',
    action: renderPage('recover')
});
FlowRouter.route('/lock', {
    name: 'lock',
    action: renderPage('lock')
});
FlowRouter.route('/blank', {
    name: 'blank',
    action: renderLayout('blank')
});
FlowRouter.route('/notfound', {
    name: 'notfound',
    action: renderPage('notfound')
});
FlowRouter.route('/maintenance', {
    name: 'maintenance',
    action: renderPage('maintenance')
});
FlowRouter.route('/internalerror', {
    name: 'internalerror',
    action: renderPage('error500')
});


// Extras


FlowRouter.route('/contacts', {
    name: 'contacts',
    action: renderLayout('contacts')
});
FlowRouter.route('/contact-details', {
    name: 'contact-details',
    action: renderLayout('contactDetails')
});
FlowRouter.route('/projects', {
    name: 'projects',
    action: renderLayout('projects')
});
FlowRouter.route('/project-details', {
    name: 'project-details',
    action: renderLayout('projectDetails')
});
FlowRouter.route('/team-viewer', {
    name: 'team-viewer',
    action: renderLayout('teamViewer')
});
FlowRouter.route('/social-board', {
    name: 'social-board',
    action: renderLayout('socialBoard')
});
FlowRouter.route('/vote-links', {
    name: 'vote-links',
    action: renderLayout('voteLinks')
});
FlowRouter.route('/bug-tracker', {
    name: 'bug-tracker',
    action: renderLayout('bugTracker')
});
FlowRouter.route('/faq', {
    name: 'faq',
    action: renderLayout('faq')
});
FlowRouter.route('/help-center', {
    name: 'help-center',
    action: renderLayout('helpCenter')
});
FlowRouter.route('/followers', {
    name: 'followers',
    action: renderLayout('followers')
});
FlowRouter.route('/settings', {
    name: 'settings',
    action: renderLayout('settings')
});
FlowRouter.route('/plans', {
    name: 'plans',
    action: renderLayout('plans')
});
FlowRouter.route('/file-manager', {
    name: 'file-manager',
    action: renderLayout('fileManager')
});
FlowRouter.route('/mailbox', {
    name: 'mailbox',
    action: renderLayout('mailbox')
});
FlowRouter.route('/timeline', {
    name: 'timeline',
    action: renderLayout('timeline')
});
FlowRouter.route('/calendar', {
    name: 'calendar',
    action: renderLayout('calendar')
});
FlowRouter.route('/invoice', {
    name: 'invoice',
    action: renderLayout('invoice')
});
FlowRouter.route('/search', {
    name: 'search',
    action: renderLayout('search')
});
FlowRouter.route('/todo', {
    name: 'todo',
    action: renderLayout('todo')
});
FlowRouter.route('/profile', {
    name: 'profile',
    action: renderLayout('profile')
});


// Blog

FlowRouter.route('/blog-list', {
    name: 'blog-list',
    action: renderLayout('blogList')
});
FlowRouter.route('/blog-post', {
    name: 'blog-post',
    action: renderLayout('blogPost')
});
FlowRouter.route('/blog-articles', {
    name: 'blog-articles',
    action: renderLayout('blogArticles')
});
FlowRouter.route('/blog-article-view', {
    name: 'blog-article-view',
    action: renderLayout('blogArticleView')
});


// eCommerce

FlowRouter.route('/ecommerce-orders', {
    name: 'ecommerce-orders',
    action: renderLayout('ecommerceOrders')
});
FlowRouter.route('/ecommerce-order-view', {
    name: 'ecommerce-order-view',
    action: renderLayout('ecommerceOrderView')
});
FlowRouter.route('/ecommerce-products', {
    name: 'ecommerce-products',
    action: renderLayout('ecommerceProducts')
});
FlowRouter.route('/ecommerce-product-view', {
    name: 'ecommerce-product-view',
    action: renderLayout('ecommerceProductView')
});
FlowRouter.route('/ecommerce-checkout', {
    name: 'ecommerce-checkout',
    action: renderLayout('ecommerceCheckout')
});


// Forum

FlowRouter.route('/forum-categories', {
    name: 'forum-categories',
    action: renderLayout('forumCategories')
});
FlowRouter.route('/forum-topics', {
    name: 'forum-topics',
    action: renderLayout('forumTopics')
});
FlowRouter.route('/forum-discussion', {
    name: 'forum-discussion',
    action: renderLayout('forumDiscussion')
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