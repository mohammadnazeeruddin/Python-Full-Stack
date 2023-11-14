/**
 * This library was created to emulate some jQuery features
 * used in this template only with Javascript and DOM
 * manipulation functions (IE10+).
 * All methods were designed for an adequate and specific use
 * and don't perform a deep validation on the arguments provided.
 *
 * IMPORTANT:
 * ==========
 * It's suggested NOT to use this library extensively unless you
 * understand what each method does. Instead, use only JS or
 * you might even need jQuery.
 */

(function(global, factory) {
    if (typeof exports === 'object') { // CommonJS-like
        module.exports = factory();
    } else { // Browser
        if (typeof global.jQuery === 'undefined')
            global.$ = factory();
    }
}(this, function() {

    // HELPERS
    function arrayFrom(obj) {
        return ('length' in obj) && (obj !== window) ? [].slice.call(obj) : [obj];
    }

    function filter(ctx, fn) {
        return [].filter.call(ctx, fn);
    }

    function map(ctx, fn) {
        return [].map.call(ctx, fn);
    }

    function matches(item, selector) {
        return (Element.prototype.matches || Element.prototype.msMatchesSelector).call(item, selector)
    }

    // Events handler with simple scoped events support
    var EventHandler = function() {
        this.events = {};
    }
    EventHandler.prototype = {
        // event accepts: 'click' or 'click.scope'
        bind: function(event, listener, target) {
            var type = event.split('.')[0];
            target.addEventListener(type, listener, false);
            this.events[event] = {
                type: type,
                listener: listener
            }
        },
        unbind: function(event, target) {
            if (event in this.events) {
                target.removeEventListener(this.events[event].type, this.events[event].listener, false);
                delete this.events[event];
            }
        }
    }

    // Object Definition
    var Wrap = function(selector) {
        this.selector = selector;
        return this._setup([]);
    }

    // CONSTRUCTOR
    Wrap.Constructor = function(param, attrs) {
        var el = new Wrap(param);
        return el.init(attrs);
    };

    // Core methods
    Wrap.prototype = {
        constructor: Wrap,
        /**
         * Initialize the object depending on param type
         * [attrs] only to handle $(htmlString, {attributes})
         */
        init: function(attrs) {
            // empty object
            if (!this.selector) return this;
            // selector === string
            if (typeof this.selector === 'string') {
                // if looks like markup, try to create an element
                if (this.selector[0] === '<') {
                    var elem = this._setup([this._create(this.selector)])
                    return attrs ? elem.attr(attrs) : elem;
                } else
                    return this._setup(arrayFrom(document.querySelectorAll(this.selector)))
            }
            // selector === DOMElement
            if (this.selector.nodeType)
                return this._setup([this.selector])
            else // shorthand for DOMReady
                if (typeof this.selector === 'function')
                    return this._setup([document]).ready(this.selector)
            // Array like objects (e.g. NodeList/HTMLCollection)
            return this._setup(arrayFrom(this.selector))
        },
        /**
         * Creates a DOM element from a string
         * Strictly supports the form: '<tag>' or '<tag/>'
         */
        _create: function(str) {
            var nodeName = str.substr(str.indexOf('<') + 1, str.indexOf('>') - 1).replace('/', '')
            return document.createElement(nodeName);
        },
        /** setup properties and array to element set */
        _setup: function(elements) {
            var i = 0;
            for (; i < elements.length; i++) delete this[i]; // clean up old set
            this.elements = elements;
            this.length = elements.length;
            for (i = 0; i < elements.length; i++) this[i] = elements[i] // new set
            return this;
        },
        _first: function(cb, ret) {
            var f = this.elements[0];
            return f ? (cb ? cb.call(this, f) : f) : ret;
        },
        /** Common function for class manipulation  */
        _classes: function(method, classname) {
            var cls = classname.split(' ');
            if (cls.length > 1) {
                cls.forEach(this._classes.bind(this, method))
            } else {
                if (method === 'contains') {
                    var elem = this._first();
                    return elem ? elem.classList.contains(classname) : false;
                }
                return (classname === '') ? this : this.each(function(i, item) {
                    item.classList[method](classname);
                })
            }
        },
        /**
         * Multi purpose function to set or get a (key, value)
         * If no value, works as a getter for the given key
         * key can be an object in the form {key: value, ...}
         */
        _access: function(key, value, fn) {
            if (typeof key === 'object') {
                for (var k in key) {
                    this._access(k, key[k], fn);
                }
            } else if (value === undefined) {
                return this._first(function(elem) {
                    return fn(elem, key);
                });
            }
            return this.each(function(i, item) {
                fn(item, key, value);
            });
        },
        each: function(fn, arr) {
            arr = arr ? arr : this.elements;
            for (var i = 0; i < arr.length; i++) {
                if (fn.call(arr[i], i, arr[i]) === false)
                    break;
            }
            return this;
        }
    }

    /** Allows to extend with new methods */
    Wrap.extend = function(methods) {
        Object.keys(methods).forEach(function(m) {
            Wrap.prototype[m] = methods[m]
        })
    }

    // DOM READY
    Wrap.extend({
        ready: function(fn) {
            if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
            return this;
        }
    })
    // ACCESS
    Wrap.extend({
        /** Get or set a css value */
        css: function(key, value) {
            var getStyle = function(e, k) { return e.style[k] || getComputedStyle(e)[k]; };
            return this._access(key, value, function(item, k, val) {
                var unit = (typeof val === 'number') ? 'px' : '';
                return val === undefined ? getStyle(item, k) : (item.style[k] = val + unit);
            })
        },
        /** Get an attribute or set it */
        attr: function(key, value) {
            return this._access(key, value, function(item, k, val) {
                return val === undefined ? item.getAttribute(k) : item.setAttribute(k, val)
            })
        },
        /** Get a property or set it */
        prop: function(key, value) {
            return this._access(key, value, function(item, k, val) {
                return val === undefined ? item[k] : (item[k] = val);
            })
        },
        position: function() {
            return this._first(function(elem) {
                return { left: elem.offsetLeft, top: elem.offsetTop }
            });
        },
        scrollTop: function(value) {
            return this._access('scrollTop', value, function(item, k, val) {
                return val === undefined ? item[k] : (item[k] = val);
            })
        },
        outerHeight: function(includeMargin) {
            return this._first(function(elem) {
                var style = getComputedStyle(elem);
                var margins = includeMargin ? (parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10)) : 0;
                return elem.offsetHeight + margins;
            });
        },
        /**
         * Find the position of the first element in the set
         * relative to its sibling elements.
         */
        index: function() {
            return this._first(function(el) {
                return arrayFrom(el.parentNode.children).indexOf(el)
            }, -1);
        }
    })
    // LOOKUP
    Wrap.extend({
        children: function(selector) {
            var childs = [];
            this.each(function(i, item) {
                childs = childs.concat(map(item.children, function(item) {
                    return item
                }))
            })
            return Wrap.Constructor(childs).filter(selector);
        },
        siblings: function() {
            var sibs = []
            this.each(function(i, item) {
                sibs = sibs.concat(filter(item.parentNode.children, function(child) {
                    return child !== item;
                }))
            })
            return Wrap.Constructor(sibs)
        },
        /** Return the parent of each element in the current set */
        parent: function() {
            var par = map(this.elements, function(item) {
                return item.parentNode;
            })
            return Wrap.Constructor(par)
        },
        /** Return ALL parents of each element in the current set */
        parents: function(selector) {
            var par = [];
            this.each(function(i, item) {
                for (var p = item.parentElement; p; p = p.parentElement)
                    par.push(p);
            })
            return Wrap.Constructor(par).filter(selector)
        },
        /**
         * Get the descendants of each element in the set, filtered by a selector
         * Selector can't start with ">" (:scope not supported on IE).
         */
        find: function(selector) {
            var found = []
            this.each(function(i, item) {
                found = found.concat(map(item.querySelectorAll( /*':scope ' + */ selector), function(fitem) {
                    return fitem
                }))
            })
            return Wrap.Constructor(found)
        },
        /** filter the actual set based on given selector */
        filter: function(selector) {
            if (!selector) return this;
            var res = filter(this.elements, function(item) {
                return matches(item, selector)
            })
            return Wrap.Constructor(res)
        },
        /** Works only with a string selector */
        is: function(selector) {
            var found = false;
            this.each(function(i, item) {
                return !(found = matches(item, selector))
            })
            return found;
        }
    });
    // ELEMENTS
    Wrap.extend({
        /**
         * append current set to given node
         * expects a dom node or set
         * if element is a set, prepends only the first
         */
        appendTo: function(elem) {
            elem = elem.nodeType ? elem : elem._first()
            return this.each(function(i, item) {
                elem.appendChild(item);
            })
        },
        /**
         * Append a domNode to each element in the set
         * if element is a set, append only the first
         */
        append: function(elem) {
            elem = elem.nodeType ? elem : elem._first()
            return this.each(function(i, item) {
                item.appendChild(elem);
            })
        },
        /**
         * Insert the current set of elements after the element
         * that matches the given selector in param
         */
        insertAfter: function(selector) {
            var target = document.querySelector(selector);
            return this.each(function(i, item) {
                target.parentNode.insertBefore(item, target.nextSibling);
            })
        },
        /**
         * Clones all element in the set
         * returns a new set with the cloned elements
         */
        clone: function() {
            var clones = map(this.elements, function(item) {
                return item.cloneNode(true)
            })
            return Wrap.Constructor(clones);
        },
        /** Remove all node in the set from DOM. */
        remove: function() {
            this.each(function(i, item) {
                delete item.events;
                delete item.data;
                if (item.parentNode) item.parentNode.removeChild(item);
            })
            this._setup([])
        }
    })
    // DATASETS
    Wrap.extend({
        /**
         * Expected key in camelCase format
         * if value provided save data into element set
         * if not, return data for the first element
         */
        data: function(key, value) {
            var hasJSON = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
                dataAttr = 'data-' + key.replace(/[A-Z]/g, '-$&').toLowerCase();
            if (value === undefined) {
                return this._first(function(el) {
                    if (el.data && el.data[key])
                        return el.data[key];
                    else {
                        var data = el.getAttribute(dataAttr)
                        if (data === 'true') return true;
                        if (data === 'false') return false;
                        if (data === +data + '') return +data;
                        if (hasJSON.test(data)) return JSON.parse(data);
                        return data;
                    }
                });
            } else {
                return this.each(function(i, item) {
                    item.data = item.data || {};
                    item.data[key] = value;
                });
            }
        }
    })
    // EVENTS
    Wrap.extend({
        trigger: function(type) {
            type = type.split('.')[0]; // ignore namespace
            var event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, false);
            return this.each(function(i, item) {
                item.dispatchEvent(event);
            })
        },
        blur: function() {
            return this.trigger('blur')
        },
        focus: function() {
            return this.trigger('focus')
        },
        on: function(event, callback) {
            return this.each(function(i, item) {
                if (!item.events) item.events = new EventHandler();
                event.split(' ').forEach(function(ev) {
                    item.events.bind(ev, callback, item);
                })
            })
        },
        off: function(event) {
            return this.each(function(i, item) {
                if (item.events) {
                    item.events.unbind(event, item);
                    delete item.events;
                }
            })
        }
    })
    // CLASSES
    Wrap.extend({
        toggleClass: function(classname) {
            return this._classes('toggle', classname);
        },
        addClass: function(classname) {
            return this._classes('add', classname);
        },
        removeClass: function(classname) {
            return this._classes('remove', classname);
        },
        hasClass: function(classname) {
            return this._classes('contains', classname);
        }
    })


    /**
     * Some basic features in this template relies on Bootstrap
     * plugins, like Collapse, Dropdown and Tab.
     * Below code emulates plugins behavior by toggling classes
     * from elements to allow a minimum interaction without animation.
     * - Only Collapse is required which is used by the sidebar.
     * - Tab and Dropdown are optional features.
     */

    // Emulate jQuery symbol to simplify usage
    var $ = Wrap.Constructor;

    // Emulates Collapse plugin
    Wrap.extend({
        collapse: function(action) {
            return this.each(function(i, item) {
                var $item = $(item).trigger(action + '.bs.collapse');
                if (action === 'toggle') $item.collapse($item.hasClass('show') ? 'hide' : 'show');
                else $item[action === 'show' ? 'addClass' : 'removeClass']('show');
            })
        }
    })
    // Initializations
    $('[data-toggle]').on('click', function(e) {
        var target = $(e.currentTarget);
        if (target.is('a')) e.preventDefault();
        switch (target.data('toggle')) {
            case 'collapse':
                $(target.attr('href')).collapse('toggle');
                break;
            case 'tab':
                target.parent().parent().find('.active').removeClass('active');
                target.addClass('active');
                var tabPane = $(target.attr('href'));
                tabPane.siblings().removeClass('active show');
                tabPane.addClass('active show');
                break;
            case 'dropdown':
                var dd = target.parent().toggleClass('show');
                dd.find('.dropdown-menu').toggleClass('show');
                break;
            default:
                break;
        }
    })


    return Wrap.Constructor

}));
/*!
 *
 * Angle - Bootstrap Admin Template
 *
 * Version: 4.1.1
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */


(function() {
    'use strict';

    $(function() {

        // Restore body classes
        // -----------------------------------
        var $body = $('body');
        new StateToggler().restoreState($body);

        // enable settings toggle after restore
        $('#chk-fixed').prop('checked', $body.hasClass('layout-fixed'));
        $('#chk-collapsed').prop('checked', $body.hasClass('aside-collapsed'));
        $('#chk-collapsed-text').prop('checked', $body.hasClass('aside-collapsed-text'));
        $('#chk-boxed').prop('checked', $body.hasClass('layout-boxed'));
        $('#chk-float').prop('checked', $body.hasClass('aside-float'));
        $('#chk-hover').prop('checked', $body.hasClass('aside-hover'));

        // When ready display the offsidebar
        $('.offsidebar.d-none').removeClass('d-none');

    }); // doc ready

})();
// Start Bootstrap JS
// -----------------------------------

(function() {
    'use strict';

    $(initBootstrap);

    function initBootstrap() {

        // necessary check at least til BS doesn't require jQuery
        if (!$.fn || !$.fn.tooltip || !$.fn.popover) return;

        // POPOVER
        // -----------------------------------

        $('[data-toggle="popover"]').popover();

        // TOOLTIP
        // -----------------------------------

        $('[data-toggle="tooltip"]').tooltip({
            container: 'body'
        });

        // DROPDOWN INPUTS
        // -----------------------------------
        $('.dropdown input').on('click focus', function(event) {
            event.stopPropagation();
        });

    }

})();
// Module: card-tools
// -----------------------------------

(function() {
    'use strict';

    $(initCardDismiss);
    $(initCardCollapse);
    $(initCardRefresh);


    /**
     * Helper function to find the closest
     * ascending .card element
     */
    function getCardParent(item) {
        var el = item.parentElement;
        while (el && !el.classList.contains('card'))
            el = el.parentElement
        return el
    }
    /**
     * Helper to trigger custom event
     */
    function triggerEvent(type, item, data) {
        var ev;
        if (typeof CustomEvent === 'function') {
            ev = new CustomEvent(type, { detail: data });
        } else {
            ev = document.createEvent('CustomEvent');
            ev.initCustomEvent(type, true, false, data);
        }
        item.dispatchEvent(ev);
    }

    /**
     * Dismiss cards
     * [data-tool="card-dismiss"]
     */
    function initCardDismiss() {
        var cardtoolSelector = '[data-tool="card-dismiss"]'

        var cardList = [].slice.call(document.querySelectorAll(cardtoolSelector))

        cardList.forEach(function(item) {
            new CardDismiss(item);
        })

        function CardDismiss(item) {
            var EVENT_REMOVE = 'card.remove';
            var EVENT_REMOVED = 'card.removed';

            this.item = item;
            this.cardParent = getCardParent(this.item);
            this.removing = false; // prevents double execution

            this.clickHandler = function(e) {
                if (this.removing) return;
                this.removing = true;
                // pass callbacks via event.detail to confirm/cancel the removal
                triggerEvent(EVENT_REMOVE, this.cardParent, {
                    confirm: this.confirm.bind(this),
                    cancel: this.cancel.bind(this)
                });
            }
            this.confirm = function() {
                this.animate(this.cardParent, function() {
                    triggerEvent(EVENT_REMOVED, this.cardParent);
                    this.remove(this.cardParent);
                })
            }
            this.cancel = function() {
                this.removing = false;
            }
            this.animate = function(item, cb) {
                if ('onanimationend' in window) { // animation supported
                    item.addEventListener('animationend', cb.bind(this))
                    item.className += ' animated bounceOut'; // requires animate.css
                } else cb.call(this) // no animation, just remove
            }
            this.remove = function(item) {
                item.parentNode.removeChild(item);
            }
            // attach listener
            item.addEventListener('click', this.clickHandler.bind(this), false)
        }
    }


    /**
     * Collapsed cards
     * [data-tool="card-collapse"]
     * [data-start-collapsed]
     */
    function initCardCollapse() {
        var cardtoolSelector = '[data-tool="card-collapse"]';
        var cardList = [].slice.call(document.querySelectorAll(cardtoolSelector))

        cardList.forEach(function(item) {
            var initialState = item.hasAttribute('data-start-collapsed')
            new CardCollapse(item, initialState);
        })

        function CardCollapse(item, startCollapsed) {
            var EVENT_SHOW = 'card.collapse.show';
            var EVENT_HIDE = 'card.collapse.hide';

            this.state = true; // true -> show / false -> hide
            this.item = item;
            this.cardParent = getCardParent(this.item);
            this.wrapper = this.cardParent.querySelector('.card-wrapper');

            this.toggleCollapse = function(action) {
                triggerEvent(action ? EVENT_SHOW : EVENT_HIDE, this.cardParent)
                this.wrapper.style.maxHeight = (action ? this.wrapper.scrollHeight : 0) + 'px'
                this.state = action;
                this.updateIcon(action)
            }
            this.updateIcon = function(action) {
                this.item.firstElementChild.className = action ? 'fa fa-minus' : 'fa fa-plus'
            }
            this.clickHandler = function() {
                this.toggleCollapse(!this.state);
            }
            this.initStyles = function() {
                this.wrapper.style.maxHeight = this.wrapper.scrollHeight + 'px';
                this.wrapper.style.transition = 'max-height 0.5s';
                this.wrapper.style.overflow = 'hidden';
            }

            // prepare styles for collapse animation
            this.initStyles()
            // set initial state if provided
            if (startCollapsed) {
                this.toggleCollapse(false)
            }
            // attach listener
            this.item.addEventListener('click', this.clickHandler.bind(this), false)

        }
    }


    /**
     * Refresh cards
     * [data-tool="card-refresh"]
     * [data-spinner="standard"]
     */
    function initCardRefresh() {

        var cardtoolSelector = '[data-tool="card-refresh"]';
        var cardList = [].slice.call(document.querySelectorAll(cardtoolSelector))

        cardList.forEach(function(item) {
            new CardRefresh(item);
        })

        function CardRefresh(item) {
            var EVENT_REFRESH = 'card.refresh';
            var WHIRL_CLASS = 'whirl';
            var DEFAULT_SPINNER = 'standard'

            this.item = item;
            this.cardParent = getCardParent(this.item)
            this.spinner = ((this.item.dataset || {}).spinner || DEFAULT_SPINNER).split(' '); // support space separated classes

            this.refresh = function(e) {
                var card = this.cardParent;
                // start showing the spinner
                this.showSpinner(card, this.spinner)
                // attach as public method
                card.removeSpinner = this.removeSpinner.bind(this);
                // Trigger the event and send the card
                triggerEvent(EVENT_REFRESH, card, { card: card });
            }
            this.showSpinner = function(card, spinner) {
                card.classList.add(WHIRL_CLASS);
                spinner.forEach(function(s) { card.classList.add(s) })
            }
            this.removeSpinner = function() {
                this.cardParent.classList.remove(WHIRL_CLASS);
            }

            // attach listener
            this.item.addEventListener('click', this.refresh.bind(this), false)

        }
    }

})();
// GLOBAL CONSTANTS
// -----------------------------------

(function() {

    window.APP_COLORS = {
        'primary':                '#5d9cec',
        'success':                '#27c24c',
        'info':                   '#23b7e5',
        'warning':                '#ff902b',
        'danger':                 '#f05050',
        'inverse':                '#131e26',
        'green':                  '#37bc9b',
        'pink':                   '#f532e5',
        'purple':                 '#7266ba',
        'dark':                   '#3a3f51',
        'yellow':                 '#fad732',
        'gray-darker':            '#232735',
        'gray-dark':              '#3a3f51',
        'gray':                   '#dde6e9',
        'gray-light':             '#e4eaec',
        'gray-lighter':           '#edf1f2'
    };

    window.APP_MEDIAQUERY = {
        'desktopLG':             1200,
        'desktop':                992,
        'tablet':                 768,
        'mobile':                 480
    };

})();
// FULLSCREEN
// -----------------------------------

(function() {
    'use strict';

    $(initScreenFull);

    function initScreenFull() {
        if (typeof screenfull === 'undefined') return;

        var $doc = $(document);
        var $fsToggler = $('[data-toggle-fullscreen]');

        // Not supported under IE
        var ua = window.navigator.userAgent;
        if (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./)) {
            $fsToggler.addClass('d-none'); // hide element
            return; // and abort
        }

        $fsToggler.on('click', function(e) {
            e.preventDefault();

            if (screenfull.enabled) {

                screenfull.toggle();

                // Switch icon indicator
                toggleFSIcon($fsToggler);

            } else {
                console.log('Fullscreen not enabled');
            }
        });

        if (screenfull.raw && screenfull.raw.fullscreenchange)
            $doc.on(screenfull.raw.fullscreenchange, function() {
                toggleFSIcon($fsToggler);
            });

        function toggleFSIcon($element) {
            if (screenfull.isFullscreen)
                $element.children('em').removeClass('fa-expand').addClass('fa-compress');
            else
                $element.children('em').removeClass('fa-compress').addClass('fa-expand');
        }

    }

})();
// LOAD CUSTOM CSS
// -----------------------------------

(function() {
    'use strict';

    $(initLoadCSS);

    function initLoadCSS() {

        $('[data-load-css]').on('click', function(e) {

            var element = $(this);

            if (element.is('a'))
                e.preventDefault();

            var uri = element.data('loadCss'),
                link;

            if (uri) {
                link = createLink(uri);
                if (!link) {
                    $.error('Error creating stylesheet link element.');
                }
            } else {
                $.error('No stylesheet location defined.');
            }

        });
    }

    function createLink(uri) {
        var linkId = 'autoloaded-stylesheet',
            oldLink = $('#' + linkId).attr('id', linkId + '-old');

        $('head').append($('<link/>').attr({
            'id': linkId,
            'rel': 'stylesheet',
            'href': uri
        }));

        if (oldLink.length) {
            oldLink.remove();
        }

        return $('#' + linkId);
    }

})();
// TRANSLATION
// -----------------------------------

(function() {
    'use strict';

    $(initTranslation);


    var pathPrefix = '/Content/i18n'; // folder of json files
    var STORAGEKEY = 'jq-appLang';
    var savedLanguage = Storages.localStorage.get(STORAGEKEY);

    function initTranslation() {
        i18next
            .use(i18nextXHRBackend)
            // .use(LanguageDetector)
            .init({
                fallbackLng: savedLanguage || 'en',
                backend: {
                    loadPath: pathPrefix + '/{{ns}}-{{lng}}.json',
                },
                ns: ['site'],
                defaultNS: 'site',
                debug: false
            }, function(err, t) {
                // initialize elements
                applyTranlations();
                // listen to language changes
                attachChangeListener();
            })

        function applyTranlations() {
            var list = [].slice.call(document.querySelectorAll('[data-localize]'))
            list.forEach(function(item) {
                var key = item.getAttribute('data-localize')
                if (i18next.exists(key)) item.innerHTML = i18next.t(key);
            })
        }

        function attachChangeListener() {
            var list = [].slice.call(document.querySelectorAll('[data-set-lang]'))
            list.forEach(function(item) {

                item.addEventListener('click', function(e) {
                    if (e.target.tagName === 'A') e.preventDefault();
                    var lang = item.getAttribute('data-set-lang')
                    if (lang) {
                        i18next.changeLanguage(lang, function(err) {
                            if (err) console.log(err)
                            else {
                                applyTranlations();
                                Storages.localStorage.set(STORAGEKEY, lang);
                            }
                        });
                    }
                    activateDropdown(item)
                });

            })
        }

        function activateDropdown(item) {
            if (item.classList.contains('dropdown-item')) {
                item.parentElement.previousElementSibling.innerHTML = item.innerHTML;
            }
        }

    }


})();
// NAVBAR SEARCH
// -----------------------------------

(function() {
    'use strict';

    $(initNavbarSearch);

    function initNavbarSearch() {

        var navSearch = new navbarSearchInput();

        // Open search input
        var $searchOpen = $('[data-search-open]');

        $searchOpen
            .on('click', function(e) { e.stopPropagation(); })
            .on('click', navSearch.toggle);

        // Close search input
        var $searchDismiss = $('[data-search-dismiss]');
        var inputSelector = '.navbar-form input[type="text"]';

        $(inputSelector)
            .on('click', function(e) { e.stopPropagation(); })
            .on('keyup', function(e) {
                if (e.keyCode == 27) // ESC
                    navSearch.dismiss();
            });

        // click anywhere closes the search
        $(document).on('click', navSearch.dismiss);
        // dismissable options
        $searchDismiss
            .on('click', function(e) { e.stopPropagation(); })
            .on('click', navSearch.dismiss);

    }

    var navbarSearchInput = function() {
        var navbarFormSelector = 'form.navbar-form';
        return {
            toggle: function() {

                var navbarForm = $(navbarFormSelector);

                navbarForm.toggleClass('open');

                var isOpen = navbarForm.hasClass('open');

                navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

            },

            dismiss: function() {
                $(navbarFormSelector)
                    .removeClass('open') // Close control
                    .find('input[type="text"]').blur() // remove focus
                // .val('')                    // Empty input
                ;
            }
        };

    }

})();
// NOW TIMER
// -----------------------------------

(function() {
    'use strict';

    $(initNowTimer);

    function initNowTimer() {

        if (typeof moment === 'undefined') return;

        $('[data-now]').each(function() {
            var element = $(this),
                format = element.data('format');

            function updateTime() {
                var dt = moment(new Date()).format(format);
                element.text(dt);
            }

            updateTime();
            setInterval(updateTime, 1000);

        });
    }

})();
// Toggle RTL mode for demo
// -----------------------------------


(function() {
    'use strict';

    $(initRTL);

    function initRTL() {
        var maincss = $('#maincss');
        var bscss = $('#bscss');
        $('#chk-rtl').on('change', function() {
            // app rtl check
            maincss.attr('href', this.checked ? '/Content/css/app-rtl.css' : '/Content/css/app.css');
            // bootstrap rtl check
            bscss.attr('href', this.checked ? '/Content/css/bootstrap-rtl.css' : '/Content/css/bootstrap.css');
        });
    }

})();
// SIDEBAR
// -----------------------------------


(function() {
    'use strict';

    $(initSidebar);

    var $html;
    var $body;
    var $sidebar;

    function initSidebar() {

        $html = $('html');
        $body = $('body');
        $sidebar = $('.sidebar');

        // AUTOCOLLAPSE ITEMS
        // -----------------------------------

        var sidebarCollapse = $sidebar.find('.collapse');
        sidebarCollapse.on('show.bs.collapse', function(event) {

            event.stopPropagation();
            if ($(this).parents('.collapse').length === 0)
                sidebarCollapse.filter('.show').collapse('hide');

        });

        // SIDEBAR ACTIVE STATE
        // -----------------------------------

        // Find current active item
        var currentItem = $('.sidebar .active').parents('li');

        // hover mode don't try to expand active collapse
        if (!useAsideHover())
            currentItem
            .addClass('active') // activate the parent
            .children('.collapse') // find the collapse
            .collapse('show'); // and show it

        // remove this if you use only collapsible sidebar items
        $sidebar.find('li > a + ul').on('show.bs.collapse', function(e) {
            if (useAsideHover()) e.preventDefault();
        });

        // SIDEBAR COLLAPSED ITEM HANDLER
        // -----------------------------------


        var eventName = isTouch() ? 'click' : 'mouseenter';
        var subNav = $();
        $sidebar.find('.sidebar-nav > li').on(eventName, function(e) {

            if (isSidebarCollapsed() || useAsideHover()) {

                subNav.trigger('mouseleave');
                subNav = toggleMenuItem($(this));

                // Used to detect click and touch events outside the sidebar
                sidebarAddBackdrop();
            }

        });

        var sidebarAnyclickClose = $sidebar.data('sidebarAnyclickClose');

        // Allows to close
        if (typeof sidebarAnyclickClose !== 'undefined') {

            $('.wrapper').on('click.sidebar', function(e) {
                // don't check if sidebar not visible
                if (!$body.hasClass('aside-toggled')) return;

                var $target = $(e.target);
                if (!$target.parents('.aside-container').length && // if not child of sidebar
                    !$target.is('#user-block-toggle') && // user block toggle anchor
                    !$target.parent().is('#user-block-toggle') // user block toggle icon
                ) {
                    $body.removeClass('aside-toggled');
                }

            });
        }
    }

    function sidebarAddBackdrop() {
        var $backdrop = $('<div/>', { 'class': 'sideabr-backdrop' });
        $backdrop.insertAfter('.aside-container').on("click mouseenter", function() {
            removeFloatingNav();
        });
    }

    // Open the collapse sidebar submenu items when on touch devices
    // - desktop only opens on hover
    function toggleTouchItem($element) {
        $element
            .siblings('li')
            .removeClass('open')
        $element
            .toggleClass('open');
    }

    // Handles hover to open items under collapsed menu
    // -----------------------------------
    function toggleMenuItem($listItem) {

        removeFloatingNav();

        var ul = $listItem.children('ul');

        if (!ul.length) return $();
        if ($listItem.hasClass('open')) {
            toggleTouchItem($listItem);
            return $();
        }

        var $aside = $('.aside-container');
        var $asideInner = $('.aside-inner'); // for top offset calculation
        // float aside uses extra padding on aside
        var mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);

        var subNav = ul.clone().appendTo($aside);

        toggleTouchItem($listItem);

        var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
        var vwHeight = document.body.clientHeight;

        subNav
            .addClass('nav-floating')
            .css({
                position: isFixed() ? 'fixed' : 'absolute',
                top: itemTop,
                bottom: (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
            });

        subNav.on('mouseleave', function() {
            toggleTouchItem($listItem);
            subNav.remove();
        });

        return subNav;
    }

    function removeFloatingNav() {
        $('.sidebar-subnav.nav-floating').remove();
        $('.sideabr-backdrop').remove();
        $('.sidebar li.open').removeClass('open');
    }

    function isTouch() {
        return $html.hasClass('touch');
    }

    function isSidebarCollapsed() {
        return $body.hasClass('aside-collapsed') || $body.hasClass('aside-collapsed-text');
    }

    function isSidebarToggled() {
        return $body.hasClass('aside-toggled');
    }

    function isMobile() {
        return document.body.clientWidth < APP_MEDIAQUERY.tablet;
    }

    function isFixed() {
        return $body.hasClass('layout-fixed');
    }

    function useAsideHover() {
        return $body.hasClass('aside-hover');
    }

})();
// SLIMSCROLL
// -----------------------------------

(function() {
    'use strict';

    $(initSlimsSroll);

    function initSlimsSroll() {

        if (!$.fn || !$.fn.slimScroll) return;

        $('[data-scrollable]').each(function() {

            var element = $(this),
                defaultHeight = 250;

            element.slimScroll({
                height: (element.data('height') || defaultHeight)
            });

        });
    }

})();
// Table Check All
// -----------------------------------

(function() {
    'use strict';

    $(initTableCheckAll);

    function initTableCheckAll() {

        $('[data-check-all]').on('change', function() {
            var $this = $(this),
                index = $this.index() + 1,
                checkbox = $this.find('input[type="checkbox"]'),
                table = $this.parents('table');
            // Make sure to affect only the correct checkbox column
            table.find('tbody > tr > td:nth-child(' + index + ') input[type="checkbox"]')
                .prop('checked', checkbox[0].checked);

        });

    }

})();
// TOGGLE STATE
// -----------------------------------

(function() {
    'use strict';

    $(initToggleState);

    function initToggleState() {

        var $body = $('body');
        var toggle = new StateToggler();

        $('[data-toggle-state]')
            .on('click', function(e) {
                // e.preventDefault();
                e.stopPropagation();
                var element = $(this),
                    classname = element.data('toggleState'),
                    target = element.data('target'),
                    noPersist = (element.attr('data-no-persist') !== undefined);

                // Specify a target selector to toggle classname
                // use body by default
                var $target = target ? $(target) : $body;

                if (classname) {
                    if ($target.hasClass(classname)) {
                        $target.removeClass(classname);
                        if (!noPersist)
                            toggle.removeState(classname);
                    } else {
                        $target.addClass(classname);
                        if (!noPersist)
                            toggle.addState(classname);
                    }

                }

                // some elements may need this when toggled class change the content size
                if (typeof(Event) === 'function') { // modern browsers
                    window.dispatchEvent(new Event('resize'));
                } else { // old browsers and IE
                    var resizeEvent = window.document.createEvent('UIEvents');
                    resizeEvent.initUIEvent('resize', true, false, window, 0);
                    window.dispatchEvent(resizeEvent);
                }
            });

    }

    // Handle states to/from localstorage
    var StateToggler = function() {

        var STORAGE_KEY_NAME = 'jq-toggleState';

        /** Add a state to the browser storage to be restored later */
        this.addState = function(classname) {
            var data = Storages.localStorage.get(STORAGE_KEY_NAME);
            if (data instanceof Array) data.push(classname);
            else data = [classname];
            Storages.localStorage.set(STORAGE_KEY_NAME, data);
        };
        /** Remove a state from the browser storage */
        this.removeState = function(classname) {
            var data = Storages.localStorage.get(STORAGE_KEY_NAME);
            if (data) {
                var index = data.indexOf(classname);
                if (index !== -1) data.splice(index, 1);
                Storages.localStorage.set(STORAGE_KEY_NAME, data);
            }
        };
        /** Load the state string and restore the classlist */
        this.restoreState = function($elem) {
            var data = Storages.localStorage.get(STORAGE_KEY_NAME);
            if (data instanceof Array)
                $elem.addClass(data.join(' '));
        };
    };

    window.StateToggler = StateToggler;

})();
/**=========================================================
 * Module: trigger-resize.js
 * Triggers a window resize event from any element
 =========================================================*/

(function() {
    'use strict';

    $(initTriggerResize);

    function initTriggerResize() {
        var element = $('[data-trigger-resize]');
        var value = element.data('triggerResize')
        element.on('click', function() {
            setTimeout(function() {
                // all IE friendly dispatchEvent
                var evt = document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
                // modern dispatchEvent way
                // window.dispatchEvent(new Event('resize'));
            }, value || 300);
        });
    }

})();
// Custom Code
// -----------------------------------

(function() {
    'use strict';

    $(initCustom);

    function initCustom() {

        // custom code

    }

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndyYXBwZXIuanMiLCJhcHAuaW5pdC5qcyIsImNvbW1vbi9ib290c3RyYXAtc3RhcnQuanMiLCJjb21tb24vY2FyZC10b29scy5qcyIsImNvbW1vbi9jb25zdGFudHMuanMiLCJjb21tb24vZnVsbHNjcmVlbi5qcyIsImNvbW1vbi9sb2FkLWNzcy5qcyIsImNvbW1vbi9sb2NhbGl6ZS5qcyIsImNvbW1vbi9uYXZiYXItc2VhcmNoLmpzIiwiY29tbW9uL25vdy5qcyIsImNvbW1vbi9ydGwuanMiLCJjb21tb24vc2lkZWJhci5qcyIsImNvbW1vbi9zbGltc2Nyb2xsLmpzIiwiY29tbW9uL3RhYmxlLWNoZWNrYWxsLmpzIiwiY29tbW9uL3RvZ2dsZS1zdGF0ZS5qcyIsImNvbW1vbi90cmlnZ2VyLXJlc2l6ZS5qcyIsImN1c3RvbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25lQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBUaGlzIGxpYnJhcnkgd2FzIGNyZWF0ZWQgdG8gZW11bGF0ZSBzb21lIGpRdWVyeSBmZWF0dXJlc1xyXG4gKiB1c2VkIGluIHRoaXMgdGVtcGxhdGUgb25seSB3aXRoIEphdmFzY3JpcHQgYW5kIERPTVxyXG4gKiBtYW5pcHVsYXRpb24gZnVuY3Rpb25zIChJRTEwKykuXHJcbiAqIEFsbCBtZXRob2RzIHdlcmUgZGVzaWduZWQgZm9yIGFuIGFkZXF1YXRlIGFuZCBzcGVjaWZpYyB1c2VcclxuICogYW5kIGRvbid0IHBlcmZvcm0gYSBkZWVwIHZhbGlkYXRpb24gb24gdGhlIGFyZ3VtZW50cyBwcm92aWRlZC5cclxuICpcclxuICogSU1QT1JUQU5UOlxyXG4gKiA9PT09PT09PT09XHJcbiAqIEl0J3Mgc3VnZ2VzdGVkIE5PVCB0byB1c2UgdGhpcyBsaWJyYXJ5IGV4dGVuc2l2ZWx5IHVubGVzcyB5b3VcclxuICogdW5kZXJzdGFuZCB3aGF0IGVhY2ggbWV0aG9kIGRvZXMuIEluc3RlYWQsIHVzZSBvbmx5IEpTIG9yXHJcbiAqIHlvdSBtaWdodCBldmVuIG5lZWQgalF1ZXJ5LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbihnbG9iYWwsIGZhY3RvcnkpIHtcclxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHsgLy8gQ29tbW9uSlMtbGlrZVxyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xyXG4gICAgfSBlbHNlIHsgLy8gQnJvd3NlclxyXG4gICAgICAgIGlmICh0eXBlb2YgZ2xvYmFsLmpRdWVyeSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIGdsb2JhbC4kID0gZmFjdG9yeSgpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8vIEhFTFBFUlNcclxuICAgIGZ1bmN0aW9uIGFycmF5RnJvbShvYmopIHtcclxuICAgICAgICByZXR1cm4gKCdsZW5ndGgnIGluIG9iaikgJiYgKG9iaiAhPT0gd2luZG93KSA/IFtdLnNsaWNlLmNhbGwob2JqKSA6IFtvYmpdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbHRlcihjdHgsIGZuKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdLmZpbHRlci5jYWxsKGN0eCwgZm4pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1hcChjdHgsIGZuKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdLm1hcC5jYWxsKGN0eCwgZm4pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1hdGNoZXMoaXRlbSwgc2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gKEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IpLmNhbGwoaXRlbSwgc2VsZWN0b3IpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gRXZlbnRzIGhhbmRsZXIgd2l0aCBzaW1wbGUgc2NvcGVkIGV2ZW50cyBzdXBwb3J0XHJcbiAgICB2YXIgRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7fTtcclxuICAgIH1cclxuICAgIEV2ZW50SGFuZGxlci5wcm90b3R5cGUgPSB7XHJcbiAgICAgICAgLy8gZXZlbnQgYWNjZXB0czogJ2NsaWNrJyBvciAnY2xpY2suc2NvcGUnXHJcbiAgICAgICAgYmluZDogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyLCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBldmVudC5zcGxpdCgnLicpWzBdO1xyXG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudF0gPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHVuYmluZDogZnVuY3Rpb24oZXZlbnQsIHRhcmdldCkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQgaW4gdGhpcy5ldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuZXZlbnRzW2V2ZW50XS50eXBlLCB0aGlzLmV2ZW50c1tldmVudF0ubGlzdGVuZXIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tldmVudF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT2JqZWN0IERlZmluaXRpb25cclxuICAgIHZhciBXcmFwID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldHVwKFtdKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDT05TVFJVQ1RPUlxyXG4gICAgV3JhcC5Db25zdHJ1Y3RvciA9IGZ1bmN0aW9uKHBhcmFtLCBhdHRycykge1xyXG4gICAgICAgIHZhciBlbCA9IG5ldyBXcmFwKHBhcmFtKTtcclxuICAgICAgICByZXR1cm4gZWwuaW5pdChhdHRycyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENvcmUgbWV0aG9kc1xyXG4gICAgV3JhcC5wcm90b3R5cGUgPSB7XHJcbiAgICAgICAgY29uc3RydWN0b3I6IFdyYXAsXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5pdGlhbGl6ZSB0aGUgb2JqZWN0IGRlcGVuZGluZyBvbiBwYXJhbSB0eXBlXHJcbiAgICAgICAgICogW2F0dHJzXSBvbmx5IHRvIGhhbmRsZSAkKGh0bWxTdHJpbmcsIHthdHRyaWJ1dGVzfSlcclxuICAgICAgICAgKi9cclxuICAgICAgICBpbml0OiBmdW5jdGlvbihhdHRycykge1xyXG4gICAgICAgICAgICAvLyBlbXB0eSBvYmplY3RcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdG9yKSByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgLy8gc2VsZWN0b3IgPT09IHN0cmluZ1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBsb29rcyBsaWtlIG1hcmt1cCwgdHJ5IHRvIGNyZWF0ZSBhbiBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RvclswXSA9PT0gJzwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW0gPSB0aGlzLl9zZXR1cChbdGhpcy5fY3JlYXRlKHRoaXMuc2VsZWN0b3IpXSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0cnMgPyBlbGVtLmF0dHIoYXR0cnMpIDogZWxlbTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXR1cChhcnJheUZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yKSkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gc2VsZWN0b3IgPT09IERPTUVsZW1lbnRcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0b3Iubm9kZVR5cGUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0dXAoW3RoaXMuc2VsZWN0b3JdKVxyXG4gICAgICAgICAgICBlbHNlIC8vIHNob3J0aGFuZCBmb3IgRE9NUmVhZHlcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5zZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0dXAoW2RvY3VtZW50XSkucmVhZHkodGhpcy5zZWxlY3RvcilcclxuICAgICAgICAgICAgLy8gQXJyYXkgbGlrZSBvYmplY3RzIChlLmcuIE5vZGVMaXN0L0hUTUxDb2xsZWN0aW9uKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0dXAoYXJyYXlGcm9tKHRoaXMuc2VsZWN0b3IpKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlcyBhIERPTSBlbGVtZW50IGZyb20gYSBzdHJpbmdcclxuICAgICAgICAgKiBTdHJpY3RseSBzdXBwb3J0cyB0aGUgZm9ybTogJzx0YWc+JyBvciAnPHRhZy8+J1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF9jcmVhdGU6IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgICAgICB2YXIgbm9kZU5hbWUgPSBzdHIuc3Vic3RyKHN0ci5pbmRleE9mKCc8JykgKyAxLCBzdHIuaW5kZXhPZignPicpIC0gMSkucmVwbGFjZSgnLycsICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiogc2V0dXAgcHJvcGVydGllcyBhbmQgYXJyYXkgdG8gZWxlbWVudCBzZXQgKi9cclxuICAgICAgICBfc2V0dXA6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgZm9yICg7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykgZGVsZXRlIHRoaXNbaV07IC8vIGNsZWFuIHVwIG9sZCBzZXRcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB0aGlzW2ldID0gZWxlbWVudHNbaV0gLy8gbmV3IHNldFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIF9maXJzdDogZnVuY3Rpb24oY2IsIHJldCkge1xyXG4gICAgICAgICAgICB2YXIgZiA9IHRoaXMuZWxlbWVudHNbMF07XHJcbiAgICAgICAgICAgIHJldHVybiBmID8gKGNiID8gY2IuY2FsbCh0aGlzLCBmKSA6IGYpIDogcmV0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqIENvbW1vbiBmdW5jdGlvbiBmb3IgY2xhc3MgbWFuaXB1bGF0aW9uICAqL1xyXG4gICAgICAgIF9jbGFzc2VzOiBmdW5jdGlvbihtZXRob2QsIGNsYXNzbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY2xzID0gY2xhc3NuYW1lLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgIGlmIChjbHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY2xzLmZvckVhY2godGhpcy5fY2xhc3Nlcy5iaW5kKHRoaXMsIG1ldGhvZCkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kID09PSAnY29udGFpbnMnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW0gPSB0aGlzLl9maXJzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtID8gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NuYW1lKSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjbGFzc25hbWUgPT09ICcnKSA/IHRoaXMgOiB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0W21ldGhvZF0oY2xhc3NuYW1lKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE11bHRpIHB1cnBvc2UgZnVuY3Rpb24gdG8gc2V0IG9yIGdldCBhIChrZXksIHZhbHVlKVxyXG4gICAgICAgICAqIElmIG5vIHZhbHVlLCB3b3JrcyBhcyBhIGdldHRlciBmb3IgdGhlIGdpdmVuIGtleVxyXG4gICAgICAgICAqIGtleSBjYW4gYmUgYW4gb2JqZWN0IGluIHRoZSBmb3JtIHtrZXk6IHZhbHVlLCAuLi59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgX2FjY2VzczogZnVuY3Rpb24oa2V5LCB2YWx1ZSwgZm4pIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjY2VzcyhrLCBrZXlba10sIGZuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3QoZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihlbGVtLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBmbihpdGVtLCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlYWNoOiBmdW5jdGlvbihmbiwgYXJyKSB7XHJcbiAgICAgICAgICAgIGFyciA9IGFyciA/IGFyciA6IHRoaXMuZWxlbWVudHM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm4uY2FsbChhcnJbaV0sIGksIGFycltpXSkgPT09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQWxsb3dzIHRvIGV4dGVuZCB3aXRoIG5ldyBtZXRob2RzICovXHJcbiAgICBXcmFwLmV4dGVuZCA9IGZ1bmN0aW9uKG1ldGhvZHMpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgV3JhcC5wcm90b3R5cGVbbV0gPSBtZXRob2RzW21dXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBET00gUkVBRFlcclxuICAgIFdyYXAuZXh0ZW5kKHtcclxuICAgICAgICByZWFkeTogZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50ID8gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyA6IGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJykge1xyXG4gICAgICAgICAgICAgICAgZm4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8vIEFDQ0VTU1xyXG4gICAgV3JhcC5leHRlbmQoe1xyXG4gICAgICAgIC8qKiBHZXQgb3Igc2V0IGEgY3NzIHZhbHVlICovXHJcbiAgICAgICAgY3NzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBnZXRTdHlsZSA9IGZ1bmN0aW9uKGUsIGspIHsgcmV0dXJuIGUuc3R5bGVba10gfHwgZ2V0Q29tcHV0ZWRTdHlsZShlKVtrXTsgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2VzcyhrZXksIHZhbHVlLCBmdW5jdGlvbihpdGVtLCBrLCB2YWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1bml0ID0gKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSA/ICdweCcgOiAnJztcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IGdldFN0eWxlKGl0ZW0sIGspIDogKGl0ZW0uc3R5bGVba10gPSB2YWwgKyB1bml0KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKiBHZXQgYW4gYXR0cmlidXRlIG9yIHNldCBpdCAqL1xyXG4gICAgICAgIGF0dHI6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2VzcyhrZXksIHZhbHVlLCBmdW5jdGlvbihpdGVtLCBrLCB2YWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IGl0ZW0uZ2V0QXR0cmlidXRlKGspIDogaXRlbS5zZXRBdHRyaWJ1dGUoaywgdmFsKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqIEdldCBhIHByb3BlcnR5IG9yIHNldCBpdCAqL1xyXG4gICAgICAgIHByb3A6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2VzcyhrZXksIHZhbHVlLCBmdW5jdGlvbihpdGVtLCBrLCB2YWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IGl0ZW1ba10gOiAoaXRlbVtrXSA9IHZhbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3NpdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9maXJzdChmdW5jdGlvbihlbGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBsZWZ0OiBlbGVtLm9mZnNldExlZnQsIHRvcDogZWxlbS5vZmZzZXRUb3AgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjcm9sbFRvcDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2Vzcygnc2Nyb2xsVG9wJywgdmFsdWUsIGZ1bmN0aW9uKGl0ZW0sIGssIHZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID8gaXRlbVtrXSA6IChpdGVtW2tdID0gdmFsKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIG91dGVySGVpZ2h0OiBmdW5jdGlvbihpbmNsdWRlTWFyZ2luKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9maXJzdChmdW5jdGlvbihlbGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcmdpbnMgPSBpbmNsdWRlTWFyZ2luID8gKHBhcnNlSW50KHN0eWxlLm1hcmdpblRvcCwgMTApICsgcGFyc2VJbnQoc3R5bGUubWFyZ2luQm90dG9tLCAxMCkpIDogMDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtLm9mZnNldEhlaWdodCArIG1hcmdpbnM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRmluZCB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIHNldFxyXG4gICAgICAgICAqIHJlbGF0aXZlIHRvIGl0cyBzaWJsaW5nIGVsZW1lbnRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGluZGV4OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0KGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlGcm9tKGVsLnBhcmVudE5vZGUuY2hpbGRyZW4pLmluZGV4T2YoZWwpXHJcbiAgICAgICAgICAgIH0sIC0xKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy8gTE9PS1VQXHJcbiAgICBXcmFwLmV4dGVuZCh7XHJcbiAgICAgICAgY2hpbGRyZW46IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcyA9IGNoaWxkcy5jb25jYXQobWFwKGl0ZW0uY2hpbGRyZW4sIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVxyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBXcmFwLkNvbnN0cnVjdG9yKGNoaWxkcykuZmlsdGVyKHNlbGVjdG9yKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNpYmxpbmdzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNpYnMgPSBbXVxyXG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgc2licyA9IHNpYnMuY29uY2F0KGZpbHRlcihpdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkICE9PSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBXcmFwLkNvbnN0cnVjdG9yKHNpYnMpXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiogUmV0dXJuIHRoZSBwYXJlbnQgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBjdXJyZW50IHNldCAqL1xyXG4gICAgICAgIHBhcmVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXIgPSBtYXAodGhpcy5lbGVtZW50cywgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIFdyYXAuQ29uc3RydWN0b3IocGFyKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqIFJldHVybiBBTEwgcGFyZW50cyBvZiBlYWNoIGVsZW1lbnQgaW4gdGhlIGN1cnJlbnQgc2V0ICovXHJcbiAgICAgICAgcGFyZW50czogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIHBhciA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IGl0ZW0ucGFyZW50RWxlbWVudDsgcDsgcCA9IHAucGFyZW50RWxlbWVudClcclxuICAgICAgICAgICAgICAgICAgICBwYXIucHVzaChwKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIFdyYXAuQ29uc3RydWN0b3IocGFyKS5maWx0ZXIoc2VsZWN0b3IpXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIGRlc2NlbmRhbnRzIG9mIGVhY2ggZWxlbWVudCBpbiB0aGUgc2V0LCBmaWx0ZXJlZCBieSBhIHNlbGVjdG9yXHJcbiAgICAgICAgICogU2VsZWN0b3IgY2FuJ3Qgc3RhcnQgd2l0aCBcIj5cIiAoOnNjb3BlIG5vdCBzdXBwb3J0ZWQgb24gSUUpLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZpbmQ6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IFtdXHJcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGZvdW5kLmNvbmNhdChtYXAoaXRlbS5xdWVyeVNlbGVjdG9yQWxsKCAvKic6c2NvcGUgJyArICovIHNlbGVjdG9yKSwgZnVuY3Rpb24oZml0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZml0ZW1cclxuICAgICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gV3JhcC5Db25zdHJ1Y3Rvcihmb3VuZClcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKiBmaWx0ZXIgdGhlIGFjdHVhbCBzZXQgYmFzZWQgb24gZ2l2ZW4gc2VsZWN0b3IgKi9cclxuICAgICAgICBmaWx0ZXI6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIGlmICghc2VsZWN0b3IpIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gZmlsdGVyKHRoaXMuZWxlbWVudHMsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaGVzKGl0ZW0sIHNlbGVjdG9yKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gV3JhcC5Db25zdHJ1Y3RvcihyZXMpXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiogV29ya3Mgb25seSB3aXRoIGEgc3RyaW5nIHNlbGVjdG9yICovXHJcbiAgICAgICAgaXM6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEoZm91bmQgPSBtYXRjaGVzKGl0ZW0sIHNlbGVjdG9yKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gRUxFTUVOVFNcclxuICAgIFdyYXAuZXh0ZW5kKHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBhcHBlbmQgY3VycmVudCBzZXQgdG8gZ2l2ZW4gbm9kZVxyXG4gICAgICAgICAqIGV4cGVjdHMgYSBkb20gbm9kZSBvciBzZXRcclxuICAgICAgICAgKiBpZiBlbGVtZW50IGlzIGEgc2V0LCBwcmVwZW5kcyBvbmx5IHRoZSBmaXJzdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGFwcGVuZFRvOiBmdW5jdGlvbihlbGVtKSB7XHJcbiAgICAgICAgICAgIGVsZW0gPSBlbGVtLm5vZGVUeXBlID8gZWxlbSA6IGVsZW0uX2ZpcnN0KClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXBwZW5kIGEgZG9tTm9kZSB0byBlYWNoIGVsZW1lbnQgaW4gdGhlIHNldFxyXG4gICAgICAgICAqIGlmIGVsZW1lbnQgaXMgYSBzZXQsIGFwcGVuZCBvbmx5IHRoZSBmaXJzdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGFwcGVuZDogZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgICAgICAgICBlbGVtID0gZWxlbS5ub2RlVHlwZSA/IGVsZW0gOiBlbGVtLl9maXJzdCgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChlbGVtKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluc2VydCB0aGUgY3VycmVudCBzZXQgb2YgZWxlbWVudHMgYWZ0ZXIgdGhlIGVsZW1lbnRcclxuICAgICAgICAgKiB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yIGluIHBhcmFtXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaXRlbSwgdGFyZ2V0Lm5leHRTaWJsaW5nKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENsb25lcyBhbGwgZWxlbWVudCBpbiB0aGUgc2V0XHJcbiAgICAgICAgICogcmV0dXJucyBhIG5ldyBzZXQgd2l0aCB0aGUgY2xvbmVkIGVsZW1lbnRzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY2xvbmVzID0gbWFwKHRoaXMuZWxlbWVudHMsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmNsb25lTm9kZSh0cnVlKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gV3JhcC5Db25zdHJ1Y3RvcihjbG9uZXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqIFJlbW92ZSBhbGwgbm9kZSBpbiB0aGUgc2V0IGZyb20gRE9NLiAqL1xyXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5ldmVudHM7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ucGFyZW50Tm9kZSkgaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLl9zZXR1cChbXSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy8gREFUQVNFVFNcclxuICAgIFdyYXAuZXh0ZW5kKHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFeHBlY3RlZCBrZXkgaW4gY2FtZWxDYXNlIGZvcm1hdFxyXG4gICAgICAgICAqIGlmIHZhbHVlIHByb3ZpZGVkIHNhdmUgZGF0YSBpbnRvIGVsZW1lbnQgc2V0XHJcbiAgICAgICAgICogaWYgbm90LCByZXR1cm4gZGF0YSBmb3IgdGhlIGZpcnN0IGVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBkYXRhOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNKU09OID0gL14oPzpcXHtbXFx3XFxXXSpcXH18XFxbW1xcd1xcV10qXFxdKSQvLFxyXG4gICAgICAgICAgICAgICAgZGF0YUF0dHIgPSAnZGF0YS0nICsga2V5LnJlcGxhY2UoL1tBLVpdL2csICctJCYnKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0KGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLmRhdGEgJiYgZWwuZGF0YVtrZXldKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGVsLmdldEF0dHJpYnV0ZShkYXRhQXR0cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09ICd0cnVlJykgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSAnZmFsc2UnKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSArZGF0YSArICcnKSByZXR1cm4gK2RhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNKU09OLnRlc3QoZGF0YSkpIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmRhdGFba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy8gRVZFTlRTXHJcbiAgICBXcmFwLmV4dGVuZCh7XHJcbiAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICB0eXBlID0gdHlwZS5zcGxpdCgnLicpWzBdOyAvLyBpZ25vcmUgbmFtZXNwYWNlXHJcbiAgICAgICAgICAgIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XHJcbiAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudCh0eXBlLCB0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJsdXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmlnZ2VyKCdibHVyJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvY3VzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJpZ2dlcignZm9jdXMnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGZ1bmN0aW9uKGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5ldmVudHMpIGl0ZW0uZXZlbnRzID0gbmV3IEV2ZW50SGFuZGxlcigpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKGV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5ldmVudHMuYmluZChldiwgY2FsbGJhY2ssIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9mZjogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5ldmVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmV2ZW50cy51bmJpbmQoZXZlbnQsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLmV2ZW50cztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy8gQ0xBU1NFU1xyXG4gICAgV3JhcC5leHRlbmQoe1xyXG4gICAgICAgIHRvZ2dsZUNsYXNzOiBmdW5jdGlvbihjbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsYXNzZXMoJ3RvZ2dsZScsIGNsYXNzbmFtZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGFzc2VzKCdhZGQnLCBjbGFzc25hbWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xhc3NlcygncmVtb3ZlJywgY2xhc3NuYW1lKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhhc0NsYXNzOiBmdW5jdGlvbihjbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsYXNzZXMoJ2NvbnRhaW5zJywgY2xhc3NuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNvbWUgYmFzaWMgZmVhdHVyZXMgaW4gdGhpcyB0ZW1wbGF0ZSByZWxpZXMgb24gQm9vdHN0cmFwXHJcbiAgICAgKiBwbHVnaW5zLCBsaWtlIENvbGxhcHNlLCBEcm9wZG93biBhbmQgVGFiLlxyXG4gICAgICogQmVsb3cgY29kZSBlbXVsYXRlcyBwbHVnaW5zIGJlaGF2aW9yIGJ5IHRvZ2dsaW5nIGNsYXNzZXNcclxuICAgICAqIGZyb20gZWxlbWVudHMgdG8gYWxsb3cgYSBtaW5pbXVtIGludGVyYWN0aW9uIHdpdGhvdXQgYW5pbWF0aW9uLlxyXG4gICAgICogLSBPbmx5IENvbGxhcHNlIGlzIHJlcXVpcmVkIHdoaWNoIGlzIHVzZWQgYnkgdGhlIHNpZGViYXIuXHJcbiAgICAgKiAtIFRhYiBhbmQgRHJvcGRvd24gYXJlIG9wdGlvbmFsIGZlYXR1cmVzLlxyXG4gICAgICovXHJcblxyXG4gICAgLy8gRW11bGF0ZSBqUXVlcnkgc3ltYm9sIHRvIHNpbXBsaWZ5IHVzYWdlXHJcbiAgICB2YXIgJCA9IFdyYXAuQ29uc3RydWN0b3I7XHJcblxyXG4gICAgLy8gRW11bGF0ZXMgQ29sbGFwc2UgcGx1Z2luXHJcbiAgICBXcmFwLmV4dGVuZCh7XHJcbiAgICAgICAgY29sbGFwc2U6IGZ1bmN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciAkaXRlbSA9ICQoaXRlbSkudHJpZ2dlcihhY3Rpb24gKyAnLmJzLmNvbGxhcHNlJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAndG9nZ2xlJykgJGl0ZW0uY29sbGFwc2UoJGl0ZW0uaGFzQ2xhc3MoJ3Nob3cnKSA/ICdoaWRlJyA6ICdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlICRpdGVtW2FjdGlvbiA9PT0gJ3Nob3cnID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8vIEluaXRpYWxpemF0aW9uc1xyXG4gICAgJCgnW2RhdGEtdG9nZ2xlXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgIGlmICh0YXJnZXQuaXMoJ2EnKSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHN3aXRjaCAodGFyZ2V0LmRhdGEoJ3RvZ2dsZScpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NvbGxhcHNlJzpcclxuICAgICAgICAgICAgICAgICQodGFyZ2V0LmF0dHIoJ2hyZWYnKSkuY29sbGFwc2UoJ3RvZ2dsZScpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RhYic6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFiUGFuZSA9ICQodGFyZ2V0LmF0dHIoJ2hyZWYnKSk7XHJcbiAgICAgICAgICAgICAgICB0YWJQYW5lLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZSBzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICB0YWJQYW5lLmFkZENsYXNzKCdhY3RpdmUgc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Ryb3Bkb3duJzpcclxuICAgICAgICAgICAgICAgIHZhciBkZCA9IHRhcmdldC5wYXJlbnQoKS50b2dnbGVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgZGQuZmluZCgnLmRyb3Bkb3duLW1lbnUnKS50b2dnbGVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICByZXR1cm4gV3JhcC5Db25zdHJ1Y3RvclxyXG5cclxufSkpOyIsIi8qIVxyXG4gKlxyXG4gKiBBbmdsZSAtIEJvb3RzdHJhcCBBZG1pbiBUZW1wbGF0ZVxyXG4gKlxyXG4gKiBWZXJzaW9uOiBAdmVyc2lvbkBcclxuICogQXV0aG9yOiBAYXV0aG9yQFxyXG4gKiBXZWJzaXRlOiBAdXJsQFxyXG4gKiBMaWNlbnNlOiBAbGljZW5zZUBcclxuICpcclxuICovXHJcblxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vIFJlc3RvcmUgYm9keSBjbGFzc2VzXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICB2YXIgJGJvZHkgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgbmV3IFN0YXRlVG9nZ2xlcigpLnJlc3RvcmVTdGF0ZSgkYm9keSk7XHJcblxyXG4gICAgICAgIC8vIGVuYWJsZSBzZXR0aW5ncyB0b2dnbGUgYWZ0ZXIgcmVzdG9yZVxyXG4gICAgICAgICQoJyNjaGstZml4ZWQnKS5wcm9wKCdjaGVja2VkJywgJGJvZHkuaGFzQ2xhc3MoJ2xheW91dC1maXhlZCcpKTtcclxuICAgICAgICAkKCcjY2hrLWNvbGxhcHNlZCcpLnByb3AoJ2NoZWNrZWQnLCAkYm9keS5oYXNDbGFzcygnYXNpZGUtY29sbGFwc2VkJykpO1xyXG4gICAgICAgICQoJyNjaGstY29sbGFwc2VkLXRleHQnKS5wcm9wKCdjaGVja2VkJywgJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLWNvbGxhcHNlZC10ZXh0JykpO1xyXG4gICAgICAgICQoJyNjaGstYm94ZWQnKS5wcm9wKCdjaGVja2VkJywgJGJvZHkuaGFzQ2xhc3MoJ2xheW91dC1ib3hlZCcpKTtcclxuICAgICAgICAkKCcjY2hrLWZsb2F0JykucHJvcCgnY2hlY2tlZCcsICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1mbG9hdCcpKTtcclxuICAgICAgICAkKCcjY2hrLWhvdmVyJykucHJvcCgnY2hlY2tlZCcsICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1ob3ZlcicpKTtcclxuXHJcbiAgICAgICAgLy8gV2hlbiByZWFkeSBkaXNwbGF5IHRoZSBvZmZzaWRlYmFyXHJcbiAgICAgICAgJCgnLm9mZnNpZGViYXIuZC1ub25lJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cclxuICAgIH0pOyAvLyBkb2MgcmVhZHlcclxuXHJcbn0pKCk7IiwiLy8gU3RhcnQgQm9vdHN0cmFwIEpTXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0Qm9vdHN0cmFwKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0Qm9vdHN0cmFwKCkge1xyXG5cclxuICAgICAgICAvLyBuZWNlc3NhcnkgY2hlY2sgYXQgbGVhc3QgdGlsIEJTIGRvZXNuJ3QgcmVxdWlyZSBqUXVlcnlcclxuICAgICAgICBpZiAoISQuZm4gfHwgISQuZm4udG9vbHRpcCB8fCAhJC5mbi5wb3BvdmVyKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIFBPUE9WRVJcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJwb3BvdmVyXCJdJykucG9wb3ZlcigpO1xyXG5cclxuICAgICAgICAvLyBUT09MVElQXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICBjb250YWluZXI6ICdib2R5J1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBEUk9QRE9XTiBJTlBVVFNcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICQoJy5kcm9wZG93biBpbnB1dCcpLm9uKCdjbGljayBmb2N1cycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gTW9kdWxlOiBjYXJkLXRvb2xzXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0Q2FyZERpc21pc3MpO1xyXG4gICAgJChpbml0Q2FyZENvbGxhcHNlKTtcclxuICAgICQoaW5pdENhcmRSZWZyZXNoKTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gZmluZCB0aGUgY2xvc2VzdFxyXG4gICAgICogYXNjZW5kaW5nIC5jYXJkIGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0Q2FyZFBhcmVudChpdGVtKSB7XHJcbiAgICAgICAgdmFyIGVsID0gaXRlbS5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIHdoaWxlIChlbCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdjYXJkJykpXHJcbiAgICAgICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudFxyXG4gICAgICAgIHJldHVybiBlbFxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgdG8gdHJpZ2dlciBjdXN0b20gZXZlbnRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdHJpZ2dlckV2ZW50KHR5cGUsIGl0ZW0sIGRhdGEpIHtcclxuICAgICAgICB2YXIgZXY7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBDdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBldiA9IG5ldyBDdXN0b21FdmVudCh0eXBlLCB7IGRldGFpbDogZGF0YSB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xyXG4gICAgICAgICAgICBldi5pbml0Q3VzdG9tRXZlbnQodHlwZSwgdHJ1ZSwgZmFsc2UsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpdGVtLmRpc3BhdGNoRXZlbnQoZXYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzbWlzcyBjYXJkc1xyXG4gICAgICogW2RhdGEtdG9vbD1cImNhcmQtZGlzbWlzc1wiXVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0Q2FyZERpc21pc3MoKSB7XHJcbiAgICAgICAgdmFyIGNhcmR0b29sU2VsZWN0b3IgPSAnW2RhdGEtdG9vbD1cImNhcmQtZGlzbWlzc1wiXSdcclxuXHJcbiAgICAgICAgdmFyIGNhcmRMaXN0ID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhcmR0b29sU2VsZWN0b3IpKVxyXG5cclxuICAgICAgICBjYXJkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgbmV3IENhcmREaXNtaXNzKGl0ZW0pO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIENhcmREaXNtaXNzKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIEVWRU5UX1JFTU9WRSA9ICdjYXJkLnJlbW92ZSc7XHJcbiAgICAgICAgICAgIHZhciBFVkVOVF9SRU1PVkVEID0gJ2NhcmQucmVtb3ZlZCc7XHJcblxyXG4gICAgICAgICAgICB0aGlzLml0ZW0gPSBpdGVtO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRQYXJlbnQgPSBnZXRDYXJkUGFyZW50KHRoaXMuaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZpbmcgPSBmYWxzZTsgLy8gcHJldmVudHMgZG91YmxlIGV4ZWN1dGlvblxyXG5cclxuICAgICAgICAgICAgdGhpcy5jbGlja0hhbmRsZXIgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW1vdmluZykgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAvLyBwYXNzIGNhbGxiYWNrcyB2aWEgZXZlbnQuZGV0YWlsIHRvIGNvbmZpcm0vY2FuY2VsIHRoZSByZW1vdmFsXHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyRXZlbnQoRVZFTlRfUkVNT1ZFLCB0aGlzLmNhcmRQYXJlbnQsIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25maXJtOiB0aGlzLmNvbmZpcm0uYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICBjYW5jZWw6IHRoaXMuY2FuY2VsLmJpbmQodGhpcylcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlybSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlKHRoaXMuY2FyZFBhcmVudCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckV2ZW50KEVWRU5UX1JFTU9WRUQsIHRoaXMuY2FyZFBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUodGhpcy5jYXJkUGFyZW50KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jYW5jZWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGUgPSBmdW5jdGlvbihpdGVtLCBjYikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCdvbmFuaW1hdGlvbmVuZCcgaW4gd2luZG93KSB7IC8vIGFuaW1hdGlvbiBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGNiLmJpbmQodGhpcykpXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jbGFzc05hbWUgKz0gJyBhbmltYXRlZCBib3VuY2VPdXQnOyAvLyByZXF1aXJlcyBhbmltYXRlLmNzc1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGNiLmNhbGwodGhpcykgLy8gbm8gYW5pbWF0aW9uLCBqdXN0IHJlbW92ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlID0gZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGF0dGFjaCBsaXN0ZW5lclxyXG4gICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGlja0hhbmRsZXIuYmluZCh0aGlzKSwgZmFsc2UpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbGxhcHNlZCBjYXJkc1xyXG4gICAgICogW2RhdGEtdG9vbD1cImNhcmQtY29sbGFwc2VcIl1cclxuICAgICAqIFtkYXRhLXN0YXJ0LWNvbGxhcHNlZF1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5pdENhcmRDb2xsYXBzZSgpIHtcclxuICAgICAgICB2YXIgY2FyZHRvb2xTZWxlY3RvciA9ICdbZGF0YS10b29sPVwiY2FyZC1jb2xsYXBzZVwiXSc7XHJcbiAgICAgICAgdmFyIGNhcmRMaXN0ID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhcmR0b29sU2VsZWN0b3IpKVxyXG5cclxuICAgICAgICBjYXJkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIGluaXRpYWxTdGF0ZSA9IGl0ZW0uaGFzQXR0cmlidXRlKCdkYXRhLXN0YXJ0LWNvbGxhcHNlZCcpXHJcbiAgICAgICAgICAgIG5ldyBDYXJkQ29sbGFwc2UoaXRlbSwgaW5pdGlhbFN0YXRlKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBDYXJkQ29sbGFwc2UoaXRlbSwgc3RhcnRDb2xsYXBzZWQpIHtcclxuICAgICAgICAgICAgdmFyIEVWRU5UX1NIT1cgPSAnY2FyZC5jb2xsYXBzZS5zaG93JztcclxuICAgICAgICAgICAgdmFyIEVWRU5UX0hJREUgPSAnY2FyZC5jb2xsYXBzZS5oaWRlJztcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0cnVlOyAvLyB0cnVlIC0+IHNob3cgLyBmYWxzZSAtPiBoaWRlXHJcbiAgICAgICAgICAgIHRoaXMuaXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZFBhcmVudCA9IGdldENhcmRQYXJlbnQodGhpcy5pdGVtKTtcclxuICAgICAgICAgICAgdGhpcy53cmFwcGVyID0gdGhpcy5jYXJkUGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXdyYXBwZXInKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlQ29sbGFwc2UgPSBmdW5jdGlvbihhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXJFdmVudChhY3Rpb24gPyBFVkVOVF9TSE9XIDogRVZFTlRfSElERSwgdGhpcy5jYXJkUGFyZW50KVxyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLm1heEhlaWdodCA9IChhY3Rpb24gPyB0aGlzLndyYXBwZXIuc2Nyb2xsSGVpZ2h0IDogMCkgKyAncHgnXHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gYWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJY29uKGFjdGlvbilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUljb24gPSBmdW5jdGlvbihhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc05hbWUgPSBhY3Rpb24gPyAnZmEgZmEtbWludXMnIDogJ2ZhIGZhLXBsdXMnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jbGlja0hhbmRsZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlQ29sbGFwc2UoIXRoaXMuc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFN0eWxlcyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLm1heEhlaWdodCA9IHRoaXMud3JhcHBlci5zY3JvbGxIZWlnaHQgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLnRyYW5zaXRpb24gPSAnbWF4LWhlaWdodCAwLjVzJztcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcHBlci5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBwcmVwYXJlIHN0eWxlcyBmb3IgY29sbGFwc2UgYW5pbWF0aW9uXHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFN0eWxlcygpXHJcbiAgICAgICAgICAgIC8vIHNldCBpbml0aWFsIHN0YXRlIGlmIHByb3ZpZGVkXHJcbiAgICAgICAgICAgIGlmIChzdGFydENvbGxhcHNlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVDb2xsYXBzZShmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhdHRhY2ggbGlzdGVuZXJcclxuICAgICAgICAgICAgdGhpcy5pdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbGlja0hhbmRsZXIuYmluZCh0aGlzKSwgZmFsc2UpXHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZyZXNoIGNhcmRzXHJcbiAgICAgKiBbZGF0YS10b29sPVwiY2FyZC1yZWZyZXNoXCJdXHJcbiAgICAgKiBbZGF0YS1zcGlubmVyPVwic3RhbmRhcmRcIl1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5pdENhcmRSZWZyZXNoKCkge1xyXG5cclxuICAgICAgICB2YXIgY2FyZHRvb2xTZWxlY3RvciA9ICdbZGF0YS10b29sPVwiY2FyZC1yZWZyZXNoXCJdJztcclxuICAgICAgICB2YXIgY2FyZExpc3QgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY2FyZHRvb2xTZWxlY3RvcikpXHJcblxyXG4gICAgICAgIGNhcmRMaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICBuZXcgQ2FyZFJlZnJlc2goaXRlbSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gQ2FyZFJlZnJlc2goaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgRVZFTlRfUkVGUkVTSCA9ICdjYXJkLnJlZnJlc2gnO1xyXG4gICAgICAgICAgICB2YXIgV0hJUkxfQ0xBU1MgPSAnd2hpcmwnO1xyXG4gICAgICAgICAgICB2YXIgREVGQVVMVF9TUElOTkVSID0gJ3N0YW5kYXJkJ1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkUGFyZW50ID0gZ2V0Q2FyZFBhcmVudCh0aGlzLml0ZW0pXHJcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lciA9ICgodGhpcy5pdGVtLmRhdGFzZXQgfHwge30pLnNwaW5uZXIgfHwgREVGQVVMVF9TUElOTkVSKS5zcGxpdCgnICcpOyAvLyBzdXBwb3J0IHNwYWNlIHNlcGFyYXRlZCBjbGFzc2VzXHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2ggPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FyZCA9IHRoaXMuY2FyZFBhcmVudDtcclxuICAgICAgICAgICAgICAgIC8vIHN0YXJ0IHNob3dpbmcgdGhlIHNwaW5uZXJcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1NwaW5uZXIoY2FyZCwgdGhpcy5zcGlubmVyKVxyXG4gICAgICAgICAgICAgICAgLy8gYXR0YWNoIGFzIHB1YmxpYyBtZXRob2RcclxuICAgICAgICAgICAgICAgIGNhcmQucmVtb3ZlU3Bpbm5lciA9IHRoaXMucmVtb3ZlU3Bpbm5lci5iaW5kKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciB0aGUgZXZlbnQgYW5kIHNlbmQgdGhlIGNhcmRcclxuICAgICAgICAgICAgICAgIHRyaWdnZXJFdmVudChFVkVOVF9SRUZSRVNILCBjYXJkLCB7IGNhcmQ6IGNhcmQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zaG93U3Bpbm5lciA9IGZ1bmN0aW9uKGNhcmQsIHNwaW5uZXIpIHtcclxuICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZChXSElSTF9DTEFTUyk7XHJcbiAgICAgICAgICAgICAgICBzcGlubmVyLmZvckVhY2goZnVuY3Rpb24ocykgeyBjYXJkLmNsYXNzTGlzdC5hZGQocykgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVNwaW5uZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FyZFBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKFdISVJMX0NMQVNTKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYXR0YWNoIGxpc3RlbmVyXHJcbiAgICAgICAgICAgIHRoaXMuaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpLCBmYWxzZSlcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBHTE9CQUwgQ09OU1RBTlRTXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgd2luZG93LkFQUF9DT0xPUlMgPSB7XHJcbiAgICAgICAgJ3ByaW1hcnknOiAgICAgICAgICAgICAgICAnIzVkOWNlYycsXHJcbiAgICAgICAgJ3N1Y2Nlc3MnOiAgICAgICAgICAgICAgICAnIzI3YzI0YycsXHJcbiAgICAgICAgJ2luZm8nOiAgICAgICAgICAgICAgICAgICAnIzIzYjdlNScsXHJcbiAgICAgICAgJ3dhcm5pbmcnOiAgICAgICAgICAgICAgICAnI2ZmOTAyYicsXHJcbiAgICAgICAgJ2Rhbmdlcic6ICAgICAgICAgICAgICAgICAnI2YwNTA1MCcsXHJcbiAgICAgICAgJ2ludmVyc2UnOiAgICAgICAgICAgICAgICAnIzEzMWUyNicsXHJcbiAgICAgICAgJ2dyZWVuJzogICAgICAgICAgICAgICAgICAnIzM3YmM5YicsXHJcbiAgICAgICAgJ3BpbmsnOiAgICAgICAgICAgICAgICAgICAnI2Y1MzJlNScsXHJcbiAgICAgICAgJ3B1cnBsZSc6ICAgICAgICAgICAgICAgICAnIzcyNjZiYScsXHJcbiAgICAgICAgJ2RhcmsnOiAgICAgICAgICAgICAgICAgICAnIzNhM2Y1MScsXHJcbiAgICAgICAgJ3llbGxvdyc6ICAgICAgICAgICAgICAgICAnI2ZhZDczMicsXHJcbiAgICAgICAgJ2dyYXktZGFya2VyJzogICAgICAgICAgICAnIzIzMjczNScsXHJcbiAgICAgICAgJ2dyYXktZGFyayc6ICAgICAgICAgICAgICAnIzNhM2Y1MScsXHJcbiAgICAgICAgJ2dyYXknOiAgICAgICAgICAgICAgICAgICAnI2RkZTZlOScsXHJcbiAgICAgICAgJ2dyYXktbGlnaHQnOiAgICAgICAgICAgICAnI2U0ZWFlYycsXHJcbiAgICAgICAgJ2dyYXktbGlnaHRlcic6ICAgICAgICAgICAnI2VkZjFmMidcclxuICAgIH07XHJcblxyXG4gICAgd2luZG93LkFQUF9NRURJQVFVRVJZID0ge1xyXG4gICAgICAgICdkZXNrdG9wTEcnOiAgICAgICAgICAgICAxMjAwLFxyXG4gICAgICAgICdkZXNrdG9wJzogICAgICAgICAgICAgICAgOTkyLFxyXG4gICAgICAgICd0YWJsZXQnOiAgICAgICAgICAgICAgICAgNzY4LFxyXG4gICAgICAgICdtb2JpbGUnOiAgICAgICAgICAgICAgICAgNDgwXHJcbiAgICB9O1xyXG5cclxufSkoKTsiLCIvLyBGVUxMU0NSRUVOXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0U2NyZWVuRnVsbCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFNjcmVlbkZ1bGwoKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzY3JlZW5mdWxsID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgJGRvYyA9ICQoZG9jdW1lbnQpO1xyXG4gICAgICAgIHZhciAkZnNUb2dnbGVyID0gJCgnW2RhdGEtdG9nZ2xlLWZ1bGxzY3JlZW5dJyk7XHJcblxyXG4gICAgICAgIC8vIE5vdCBzdXBwb3J0ZWQgdW5kZXIgSUVcclxuICAgICAgICB2YXIgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuICAgICAgICBpZiAodWEuaW5kZXhPZihcIk1TSUUgXCIpID4gMCB8fCAhIXVhLm1hdGNoKC9UcmlkZW50LipydlxcOjExXFwuLykpIHtcclxuICAgICAgICAgICAgJGZzVG9nZ2xlci5hZGRDbGFzcygnZC1ub25lJyk7IC8vIGhpZGUgZWxlbWVudFxyXG4gICAgICAgICAgICByZXR1cm47IC8vIGFuZCBhYm9ydFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGZzVG9nZ2xlci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzY3JlZW5mdWxsLmVuYWJsZWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzY3JlZW5mdWxsLnRvZ2dsZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBpY29uIGluZGljYXRvclxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlRlNJY29uKCRmc1RvZ2dsZXIpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGdWxsc2NyZWVuIG5vdCBlbmFibGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHNjcmVlbmZ1bGwucmF3ICYmIHNjcmVlbmZ1bGwucmF3LmZ1bGxzY3JlZW5jaGFuZ2UpXHJcbiAgICAgICAgICAgICRkb2Mub24oc2NyZWVuZnVsbC5yYXcuZnVsbHNjcmVlbmNoYW5nZSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVGU0ljb24oJGZzVG9nZ2xlcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVGU0ljb24oJGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKHNjcmVlbmZ1bGwuaXNGdWxsc2NyZWVuKVxyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuY2hpbGRyZW4oJ2VtJykucmVtb3ZlQ2xhc3MoJ2ZhLWV4cGFuZCcpLmFkZENsYXNzKCdmYS1jb21wcmVzcycpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5jaGlsZHJlbignZW0nKS5yZW1vdmVDbGFzcygnZmEtY29tcHJlc3MnKS5hZGRDbGFzcygnZmEtZXhwYW5kJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gTE9BRCBDVVNUT00gQ1NTXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0TG9hZENTUyk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdExvYWRDU1MoKSB7XHJcblxyXG4gICAgICAgICQoJ1tkYXRhLWxvYWQtY3NzXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmlzKCdhJykpXHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdXJpID0gZWxlbWVudC5kYXRhKCdsb2FkQ3NzJyksXHJcbiAgICAgICAgICAgICAgICBsaW5rO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVyaSkge1xyXG4gICAgICAgICAgICAgICAgbGluayA9IGNyZWF0ZUxpbmsodXJpKTtcclxuICAgICAgICAgICAgICAgIGlmICghbGluaykge1xyXG4gICAgICAgICAgICAgICAgICAgICQuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIHN0eWxlc2hlZXQgbGluayBlbGVtZW50LicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJC5lcnJvcignTm8gc3R5bGVzaGVldCBsb2NhdGlvbiBkZWZpbmVkLicpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxpbmsodXJpKSB7XHJcbiAgICAgICAgdmFyIGxpbmtJZCA9ICdhdXRvbG9hZGVkLXN0eWxlc2hlZXQnLFxyXG4gICAgICAgICAgICBvbGRMaW5rID0gJCgnIycgKyBsaW5rSWQpLmF0dHIoJ2lkJywgbGlua0lkICsgJy1vbGQnKTtcclxuXHJcbiAgICAgICAgJCgnaGVhZCcpLmFwcGVuZCgkKCc8bGluay8+JykuYXR0cih7XHJcbiAgICAgICAgICAgICdpZCc6IGxpbmtJZCxcclxuICAgICAgICAgICAgJ3JlbCc6ICdzdHlsZXNoZWV0JyxcclxuICAgICAgICAgICAgJ2hyZWYnOiB1cmlcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIGlmIChvbGRMaW5rLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBvbGRMaW5rLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICQoJyMnICsgbGlua0lkKTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gVFJBTlNMQVRJT05cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRUcmFuc2xhdGlvbik7XHJcblxyXG5cclxuICAgIHZhciBwYXRoUHJlZml4ID0gJy9Db250ZW50L2kxOG4nOyAvLyBmb2xkZXIgb2YganNvbiBmaWxlc1xyXG4gICAgdmFyIFNUT1JBR0VLRVkgPSAnanEtYXBwTGFuZyc7XHJcbiAgICB2YXIgc2F2ZWRMYW5ndWFnZSA9IFN0b3JhZ2VzLmxvY2FsU3RvcmFnZS5nZXQoU1RPUkFHRUtFWSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFRyYW5zbGF0aW9uKCkge1xyXG4gICAgICAgIGkxOG5leHRcclxuICAgICAgICAgICAgLnVzZShpMThuZXh0WEhSQmFja2VuZClcclxuICAgICAgICAgICAgLy8gLnVzZShMYW5ndWFnZURldGVjdG9yKVxyXG4gICAgICAgICAgICAuaW5pdCh7XHJcbiAgICAgICAgICAgICAgICBmYWxsYmFja0xuZzogc2F2ZWRMYW5ndWFnZSB8fCAnZW4nLFxyXG4gICAgICAgICAgICAgICAgYmFja2VuZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvYWRQYXRoOiBwYXRoUHJlZml4ICsgJy97e25zfX0te3tsbmd9fS5qc29uJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBuczogWydzaXRlJ10sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0TlM6ICdzaXRlJyxcclxuICAgICAgICAgICAgICAgIGRlYnVnOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIsIHQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemUgZWxlbWVudHNcclxuICAgICAgICAgICAgICAgIGFwcGx5VHJhbmxhdGlvbnMoKTtcclxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbiB0byBsYW5ndWFnZSBjaGFuZ2VzXHJcbiAgICAgICAgICAgICAgICBhdHRhY2hDaGFuZ2VMaXN0ZW5lcigpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhcHBseVRyYW5sYXRpb25zKCkge1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbG9jYWxpemVdJykpXHJcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbG9jYWxpemUnKVxyXG4gICAgICAgICAgICAgICAgaWYgKGkxOG5leHQuZXhpc3RzKGtleSkpIGl0ZW0uaW5uZXJIVE1MID0gaTE4bmV4dC50KGtleSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdHRhY2hDaGFuZ2VMaXN0ZW5lcigpIHtcclxuICAgICAgICAgICAgdmFyIGxpc3QgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNldC1sYW5nXScpKVxyXG4gICAgICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnRhZ05hbWUgPT09ICdBJykgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYW5nID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2V0LWxhbmcnKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG5leHQuY2hhbmdlTGFuZ3VhZ2UobGFuZywgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBseVRyYW5sYXRpb25zKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RvcmFnZXMubG9jYWxTdG9yYWdlLnNldChTVE9SQUdFS0VZLCBsYW5nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2YXRlRHJvcGRvd24oaXRlbSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlRHJvcGRvd24oaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2Ryb3Bkb3duLWl0ZW0nKSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5wYXJlbnRFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MID0gaXRlbS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn0pKCk7IiwiLy8gTkFWQkFSIFNFQVJDSFxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdE5hdmJhclNlYXJjaCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdE5hdmJhclNlYXJjaCgpIHtcclxuXHJcbiAgICAgICAgdmFyIG5hdlNlYXJjaCA9IG5ldyBuYXZiYXJTZWFyY2hJbnB1dCgpO1xyXG5cclxuICAgICAgICAvLyBPcGVuIHNlYXJjaCBpbnB1dFxyXG4gICAgICAgIHZhciAkc2VhcmNoT3BlbiA9ICQoJ1tkYXRhLXNlYXJjaC1vcGVuXScpO1xyXG5cclxuICAgICAgICAkc2VhcmNoT3BlblxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9KVxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgbmF2U2VhcmNoLnRvZ2dsZSk7XHJcblxyXG4gICAgICAgIC8vIENsb3NlIHNlYXJjaCBpbnB1dFxyXG4gICAgICAgIHZhciAkc2VhcmNoRGlzbWlzcyA9ICQoJ1tkYXRhLXNlYXJjaC1kaXNtaXNzXScpO1xyXG4gICAgICAgIHZhciBpbnB1dFNlbGVjdG9yID0gJy5uYXZiYXItZm9ybSBpbnB1dFt0eXBlPVwidGV4dFwiXSc7XHJcblxyXG4gICAgICAgICQoaW5wdXRTZWxlY3RvcilcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSlcclxuICAgICAgICAgICAgLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMjcpIC8vIEVTQ1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdlNlYXJjaC5kaXNtaXNzKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBjbGljayBhbnl3aGVyZSBjbG9zZXMgdGhlIHNlYXJjaFxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIG5hdlNlYXJjaC5kaXNtaXNzKTtcclxuICAgICAgICAvLyBkaXNtaXNzYWJsZSBvcHRpb25zXHJcbiAgICAgICAgJHNlYXJjaERpc21pc3NcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSlcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsIG5hdlNlYXJjaC5kaXNtaXNzKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5hdmJhclNlYXJjaElucHV0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG5hdmJhckZvcm1TZWxlY3RvciA9ICdmb3JtLm5hdmJhci1mb3JtJztcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0b2dnbGU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBuYXZiYXJGb3JtID0gJChuYXZiYXJGb3JtU2VsZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIG5hdmJhckZvcm0udG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaXNPcGVuID0gbmF2YmFyRm9ybS5oYXNDbGFzcygnb3BlbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIG5hdmJhckZvcm0uZmluZCgnaW5wdXQnKVtpc09wZW4gPyAnZm9jdXMnIDogJ2JsdXInXSgpO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGRpc21pc3M6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJChuYXZiYXJGb3JtU2VsZWN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJykgLy8gQ2xvc2UgY29udHJvbFxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpLmJsdXIoKSAvLyByZW1vdmUgZm9jdXNcclxuICAgICAgICAgICAgICAgIC8vIC52YWwoJycpICAgICAgICAgICAgICAgICAgICAvLyBFbXB0eSBpbnB1dFxyXG4gICAgICAgICAgICAgICAgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIE5PVyBUSU1FUlxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdE5vd1RpbWVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0Tm93VGltZXIoKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgbW9tZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xyXG5cclxuICAgICAgICAkKCdbZGF0YS1ub3ddJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZWxlbWVudC5kYXRhKCdmb3JtYXQnKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVRpbWUoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHQgPSBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KGZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnRleHQoZHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB1cGRhdGVUaW1lKCk7XHJcbiAgICAgICAgICAgIHNldEludGVydmFsKHVwZGF0ZVRpbWUsIDEwMDApO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gVG9nZ2xlIFJUTCBtb2RlIGZvciBkZW1vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdFJUTCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFJUTCgpIHtcclxuICAgICAgICB2YXIgbWFpbmNzcyA9ICQoJyNtYWluY3NzJyk7XHJcbiAgICAgICAgdmFyIGJzY3NzID0gJCgnI2JzY3NzJyk7XHJcbiAgICAgICAgJCgnI2Noay1ydGwnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIGFwcCBydGwgY2hlY2tcclxuICAgICAgICAgICAgbWFpbmNzcy5hdHRyKCdocmVmJywgdGhpcy5jaGVja2VkID8gJy9Db250ZW50L2Nzcy9hcHAtcnRsLmNzcycgOiAnL0NvbnRlbnQvY3NzL2FwcC5jc3MnKTtcclxuICAgICAgICAgICAgLy8gYm9vdHN0cmFwIHJ0bCBjaGVja1xyXG4gICAgICAgICAgICBic2Nzcy5hdHRyKCdocmVmJywgdGhpcy5jaGVja2VkID8gJy9Db250ZW50L2Nzcy9ib290c3RyYXAtcnRsLmNzcycgOiAnL0NvbnRlbnQvY3NzL2Jvb3RzdHJhcC5jc3MnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gU0lERUJBUlxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRTaWRlYmFyKTtcclxuXHJcbiAgICB2YXIgJGh0bWw7XHJcbiAgICB2YXIgJGJvZHk7XHJcbiAgICB2YXIgJHNpZGViYXI7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFNpZGViYXIoKSB7XHJcblxyXG4gICAgICAgICRodG1sID0gJCgnaHRtbCcpO1xyXG4gICAgICAgICRib2R5ID0gJCgnYm9keScpO1xyXG4gICAgICAgICRzaWRlYmFyID0gJCgnLnNpZGViYXInKTtcclxuXHJcbiAgICAgICAgLy8gQVVUT0NPTExBUFNFIElURU1TXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgdmFyIHNpZGViYXJDb2xsYXBzZSA9ICRzaWRlYmFyLmZpbmQoJy5jb2xsYXBzZScpO1xyXG4gICAgICAgIHNpZGViYXJDb2xsYXBzZS5vbignc2hvdy5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykucGFyZW50cygnLmNvbGxhcHNlJykubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgICAgc2lkZWJhckNvbGxhcHNlLmZpbHRlcignLnNob3cnKS5jb2xsYXBzZSgnaGlkZScpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gU0lERUJBUiBBQ1RJVkUgU1RBVEVcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAvLyBGaW5kIGN1cnJlbnQgYWN0aXZlIGl0ZW1cclxuICAgICAgICB2YXIgY3VycmVudEl0ZW0gPSAkKCcuc2lkZWJhciAuYWN0aXZlJykucGFyZW50cygnbGknKTtcclxuXHJcbiAgICAgICAgLy8gaG92ZXIgbW9kZSBkb24ndCB0cnkgdG8gZXhwYW5kIGFjdGl2ZSBjb2xsYXBzZVxyXG4gICAgICAgIGlmICghdXNlQXNpZGVIb3ZlcigpKVxyXG4gICAgICAgICAgICBjdXJyZW50SXRlbVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpIC8vIGFjdGl2YXRlIHRoZSBwYXJlbnRcclxuICAgICAgICAgICAgLmNoaWxkcmVuKCcuY29sbGFwc2UnKSAvLyBmaW5kIHRoZSBjb2xsYXBzZVxyXG4gICAgICAgICAgICAuY29sbGFwc2UoJ3Nob3cnKTsgLy8gYW5kIHNob3cgaXRcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgaWYgeW91IHVzZSBvbmx5IGNvbGxhcHNpYmxlIHNpZGViYXIgaXRlbXNcclxuICAgICAgICAkc2lkZWJhci5maW5kKCdsaSA+IGEgKyB1bCcpLm9uKCdzaG93LmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBpZiAodXNlQXNpZGVIb3ZlcigpKSBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFNJREVCQVIgQ09MTEFQU0VEIElURU0gSEFORExFUlxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gaXNUb3VjaCgpID8gJ2NsaWNrJyA6ICdtb3VzZWVudGVyJztcclxuICAgICAgICB2YXIgc3ViTmF2ID0gJCgpO1xyXG4gICAgICAgICRzaWRlYmFyLmZpbmQoJy5zaWRlYmFyLW5hdiA+IGxpJykub24oZXZlbnROYW1lLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNTaWRlYmFyQ29sbGFwc2VkKCkgfHwgdXNlQXNpZGVIb3ZlcigpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc3ViTmF2LnRyaWdnZXIoJ21vdXNlbGVhdmUnKTtcclxuICAgICAgICAgICAgICAgIHN1Yk5hdiA9IHRvZ2dsZU1lbnVJdGVtKCQodGhpcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVzZWQgdG8gZGV0ZWN0IGNsaWNrIGFuZCB0b3VjaCBldmVudHMgb3V0c2lkZSB0aGUgc2lkZWJhclxyXG4gICAgICAgICAgICAgICAgc2lkZWJhckFkZEJhY2tkcm9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBzaWRlYmFyQW55Y2xpY2tDbG9zZSA9ICRzaWRlYmFyLmRhdGEoJ3NpZGViYXJBbnljbGlja0Nsb3NlJyk7XHJcblxyXG4gICAgICAgIC8vIEFsbG93cyB0byBjbG9zZVxyXG4gICAgICAgIGlmICh0eXBlb2Ygc2lkZWJhckFueWNsaWNrQ2xvc2UgIT09ICd1bmRlZmluZWQnKSB7XHJcblxyXG4gICAgICAgICAgICAkKCcud3JhcHBlcicpLm9uKCdjbGljay5zaWRlYmFyJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgY2hlY2sgaWYgc2lkZWJhciBub3QgdmlzaWJsZVxyXG4gICAgICAgICAgICAgICAgaWYgKCEkYm9keS5oYXNDbGFzcygnYXNpZGUtdG9nZ2xlZCcpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGlmICghJHRhcmdldC5wYXJlbnRzKCcuYXNpZGUtY29udGFpbmVyJykubGVuZ3RoICYmIC8vIGlmIG5vdCBjaGlsZCBvZiBzaWRlYmFyXHJcbiAgICAgICAgICAgICAgICAgICAgISR0YXJnZXQuaXMoJyN1c2VyLWJsb2NrLXRvZ2dsZScpICYmIC8vIHVzZXIgYmxvY2sgdG9nZ2xlIGFuY2hvclxyXG4gICAgICAgICAgICAgICAgICAgICEkdGFyZ2V0LnBhcmVudCgpLmlzKCcjdXNlci1ibG9jay10b2dnbGUnKSAvLyB1c2VyIGJsb2NrIHRvZ2dsZSBpY29uXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5yZW1vdmVDbGFzcygnYXNpZGUtdG9nZ2xlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNpZGViYXJBZGRCYWNrZHJvcCgpIHtcclxuICAgICAgICB2YXIgJGJhY2tkcm9wID0gJCgnPGRpdi8+JywgeyAnY2xhc3MnOiAnc2lkZWFici1iYWNrZHJvcCcgfSk7XHJcbiAgICAgICAgJGJhY2tkcm9wLmluc2VydEFmdGVyKCcuYXNpZGUtY29udGFpbmVyJykub24oXCJjbGljayBtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZW1vdmVGbG9hdGluZ05hdigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wZW4gdGhlIGNvbGxhcHNlIHNpZGViYXIgc3VibWVudSBpdGVtcyB3aGVuIG9uIHRvdWNoIGRldmljZXNcclxuICAgIC8vIC0gZGVza3RvcCBvbmx5IG9wZW5zIG9uIGhvdmVyXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVUb3VjaEl0ZW0oJGVsZW1lbnQpIHtcclxuICAgICAgICAkZWxlbWVudFxyXG4gICAgICAgICAgICAuc2libGluZ3MoJ2xpJylcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJylcclxuICAgICAgICAkZWxlbWVudFxyXG4gICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGVzIGhvdmVyIHRvIG9wZW4gaXRlbXMgdW5kZXIgY29sbGFwc2VkIG1lbnVcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVNZW51SXRlbSgkbGlzdEl0ZW0pIHtcclxuXHJcbiAgICAgICAgcmVtb3ZlRmxvYXRpbmdOYXYoKTtcclxuXHJcbiAgICAgICAgdmFyIHVsID0gJGxpc3RJdGVtLmNoaWxkcmVuKCd1bCcpO1xyXG5cclxuICAgICAgICBpZiAoIXVsLmxlbmd0aCkgcmV0dXJuICQoKTtcclxuICAgICAgICBpZiAoJGxpc3RJdGVtLmhhc0NsYXNzKCdvcGVuJykpIHtcclxuICAgICAgICAgICAgdG9nZ2xlVG91Y2hJdGVtKCRsaXN0SXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiAkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgJGFzaWRlID0gJCgnLmFzaWRlLWNvbnRhaW5lcicpO1xyXG4gICAgICAgIHZhciAkYXNpZGVJbm5lciA9ICQoJy5hc2lkZS1pbm5lcicpOyAvLyBmb3IgdG9wIG9mZnNldCBjYWxjdWxhdGlvblxyXG4gICAgICAgIC8vIGZsb2F0IGFzaWRlIHVzZXMgZXh0cmEgcGFkZGluZyBvbiBhc2lkZVxyXG4gICAgICAgIHZhciBtYXIgPSBwYXJzZUludCgkYXNpZGVJbm5lci5jc3MoJ3BhZGRpbmctdG9wJyksIDApICsgcGFyc2VJbnQoJGFzaWRlLmNzcygncGFkZGluZy10b3AnKSwgMCk7XHJcblxyXG4gICAgICAgIHZhciBzdWJOYXYgPSB1bC5jbG9uZSgpLmFwcGVuZFRvKCRhc2lkZSk7XHJcblxyXG4gICAgICAgIHRvZ2dsZVRvdWNoSXRlbSgkbGlzdEl0ZW0pO1xyXG5cclxuICAgICAgICB2YXIgaXRlbVRvcCA9ICgkbGlzdEl0ZW0ucG9zaXRpb24oKS50b3AgKyBtYXIpIC0gJHNpZGViYXIuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgdmFyIHZ3SGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICAgIHN1Yk5hdlxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ25hdi1mbG9hdGluZycpXHJcbiAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGlzRml4ZWQoKSA/ICdmaXhlZCcgOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICAgICAgdG9wOiBpdGVtVG9wLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAoc3ViTmF2Lm91dGVySGVpZ2h0KHRydWUpICsgaXRlbVRvcCA+IHZ3SGVpZ2h0KSA/IDAgOiAnYXV0bydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN1Yk5hdi5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0b2dnbGVUb3VjaEl0ZW0oJGxpc3RJdGVtKTtcclxuICAgICAgICAgICAgc3ViTmF2LnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc3ViTmF2O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbW92ZUZsb2F0aW5nTmF2KCkge1xyXG4gICAgICAgICQoJy5zaWRlYmFyLXN1Ym5hdi5uYXYtZmxvYXRpbmcnKS5yZW1vdmUoKTtcclxuICAgICAgICAkKCcuc2lkZWFici1iYWNrZHJvcCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICQoJy5zaWRlYmFyIGxpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzVG91Y2goKSB7XHJcbiAgICAgICAgcmV0dXJuICRodG1sLmhhc0NsYXNzKCd0b3VjaCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzU2lkZWJhckNvbGxhcHNlZCgpIHtcclxuICAgICAgICByZXR1cm4gJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLWNvbGxhcHNlZCcpIHx8ICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1jb2xsYXBzZWQtdGV4dCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzU2lkZWJhclRvZ2dsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuICRib2R5Lmhhc0NsYXNzKCdhc2lkZS10b2dnbGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXNNb2JpbGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCBBUFBfTUVESUFRVUVSWS50YWJsZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXNGaXhlZCgpIHtcclxuICAgICAgICByZXR1cm4gJGJvZHkuaGFzQ2xhc3MoJ2xheW91dC1maXhlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVzZUFzaWRlSG92ZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1ob3ZlcicpO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBTTElNU0NST0xMXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0U2xpbXNTcm9sbCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFNsaW1zU3JvbGwoKSB7XHJcblxyXG4gICAgICAgIGlmICghJC5mbiB8fCAhJC5mbi5zbGltU2Nyb2xsKSByZXR1cm47XHJcblxyXG4gICAgICAgICQoJ1tkYXRhLXNjcm9sbGFibGVdJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRIZWlnaHQgPSAyNTA7XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50LnNsaW1TY3JvbGwoe1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAoZWxlbWVudC5kYXRhKCdoZWlnaHQnKSB8fCBkZWZhdWx0SGVpZ2h0KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIFRhYmxlIENoZWNrIEFsbFxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdFRhYmxlQ2hlY2tBbGwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRUYWJsZUNoZWNrQWxsKCkge1xyXG5cclxuICAgICAgICAkKCdbZGF0YS1jaGVjay1hbGxdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAkdGhpcy5pbmRleCgpICsgMSxcclxuICAgICAgICAgICAgICAgIGNoZWNrYm94ID0gJHRoaXMuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyksXHJcbiAgICAgICAgICAgICAgICB0YWJsZSA9ICR0aGlzLnBhcmVudHMoJ3RhYmxlJyk7XHJcbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0byBhZmZlY3Qgb25seSB0aGUgY29ycmVjdCBjaGVja2JveCBjb2x1bW5cclxuICAgICAgICAgICAgdGFibGUuZmluZCgndGJvZHkgPiB0ciA+IHRkOm50aC1jaGlsZCgnICsgaW5kZXggKyAnKSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKVxyXG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCBjaGVja2JveFswXS5jaGVja2VkKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBUT0dHTEUgU1RBVEVcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRUb2dnbGVTdGF0ZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFRvZ2dsZVN0YXRlKCkge1xyXG5cclxuICAgICAgICB2YXIgJGJvZHkgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgdmFyIHRvZ2dsZSA9IG5ldyBTdGF0ZVRvZ2dsZXIoKTtcclxuXHJcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlLXN0YXRlXScpXHJcbiAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzbmFtZSA9IGVsZW1lbnQuZGF0YSgndG9nZ2xlU3RhdGUnKSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBlbGVtZW50LmRhdGEoJ3RhcmdldCcpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vUGVyc2lzdCA9IChlbGVtZW50LmF0dHIoJ2RhdGEtbm8tcGVyc2lzdCcpICE9PSB1bmRlZmluZWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNwZWNpZnkgYSB0YXJnZXQgc2VsZWN0b3IgdG8gdG9nZ2xlIGNsYXNzbmFtZVxyXG4gICAgICAgICAgICAgICAgLy8gdXNlIGJvZHkgYnkgZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgdmFyICR0YXJnZXQgPSB0YXJnZXQgPyAkKHRhcmdldCkgOiAkYm9keTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2xhc3NuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0YXJnZXQuaGFzQ2xhc3MoY2xhc3NuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0LnJlbW92ZUNsYXNzKGNsYXNzbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbm9QZXJzaXN0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlLnJlbW92ZVN0YXRlKGNsYXNzbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRhcmdldC5hZGRDbGFzcyhjbGFzc25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW5vUGVyc2lzdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZS5hZGRTdGF0ZShjbGFzc25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc29tZSBlbGVtZW50cyBtYXkgbmVlZCB0aGlzIHdoZW4gdG9nZ2xlZCBjbGFzcyBjaGFuZ2UgdGhlIGNvbnRlbnQgc2l6ZVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihFdmVudCkgPT09ICdmdW5jdGlvbicpIHsgLy8gbW9kZXJuIGJyb3dzZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBvbGQgYnJvd3NlcnMgYW5kIElFXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc2l6ZUV2ZW50ID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUV2ZW50KCdVSUV2ZW50cycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZUV2ZW50LmluaXRVSUV2ZW50KCdyZXNpemUnLCB0cnVlLCBmYWxzZSwgd2luZG93LCAwKTtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChyZXNpemVFdmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGUgc3RhdGVzIHRvL2Zyb20gbG9jYWxzdG9yYWdlXHJcbiAgICB2YXIgU3RhdGVUb2dnbGVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBTVE9SQUdFX0tFWV9OQU1FID0gJ2pxLXRvZ2dsZVN0YXRlJztcclxuXHJcbiAgICAgICAgLyoqIEFkZCBhIHN0YXRlIHRvIHRoZSBicm93c2VyIHN0b3JhZ2UgdG8gYmUgcmVzdG9yZWQgbGF0ZXIgKi9cclxuICAgICAgICB0aGlzLmFkZFN0YXRlID0gZnVuY3Rpb24oY2xhc3NuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gU3RvcmFnZXMubG9jYWxTdG9yYWdlLmdldChTVE9SQUdFX0tFWV9OQU1FKTtcclxuICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkgZGF0YS5wdXNoKGNsYXNzbmFtZSk7XHJcbiAgICAgICAgICAgIGVsc2UgZGF0YSA9IFtjbGFzc25hbWVdO1xyXG4gICAgICAgICAgICBTdG9yYWdlcy5sb2NhbFN0b3JhZ2Uuc2V0KFNUT1JBR0VfS0VZX05BTUUsIGRhdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqIFJlbW92ZSBhIHN0YXRlIGZyb20gdGhlIGJyb3dzZXIgc3RvcmFnZSAqL1xyXG4gICAgICAgIHRoaXMucmVtb3ZlU3RhdGUgPSBmdW5jdGlvbihjbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBTdG9yYWdlcy5sb2NhbFN0b3JhZ2UuZ2V0KFNUT1JBR0VfS0VZX05BTUUpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZGF0YS5pbmRleE9mKGNsYXNzbmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSBkYXRhLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICBTdG9yYWdlcy5sb2NhbFN0b3JhZ2Uuc2V0KFNUT1JBR0VfS0VZX05BTUUsIGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKiogTG9hZCB0aGUgc3RhdGUgc3RyaW5nIGFuZCByZXN0b3JlIHRoZSBjbGFzc2xpc3QgKi9cclxuICAgICAgICB0aGlzLnJlc3RvcmVTdGF0ZSA9IGZ1bmN0aW9uKCRlbGVtKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gU3RvcmFnZXMubG9jYWxTdG9yYWdlLmdldChTVE9SQUdFX0tFWV9OQU1FKTtcclxuICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgICAgICRlbGVtLmFkZENsYXNzKGRhdGEuam9pbignICcpKTtcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3cuU3RhdGVUb2dnbGVyID0gU3RhdGVUb2dnbGVyO1xyXG5cclxufSkoKTsiLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICogTW9kdWxlOiB0cmlnZ2VyLXJlc2l6ZS5qc1xyXG4gKiBUcmlnZ2VycyBhIHdpbmRvdyByZXNpemUgZXZlbnQgZnJvbSBhbnkgZWxlbWVudFxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRUcmlnZ2VyUmVzaXplKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0VHJpZ2dlclJlc2l6ZSgpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9ICQoJ1tkYXRhLXRyaWdnZXItcmVzaXplXScpO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGVsZW1lbnQuZGF0YSgndHJpZ2dlclJlc2l6ZScpXHJcbiAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIGFsbCBJRSBmcmllbmRseSBkaXNwYXRjaEV2ZW50XHJcbiAgICAgICAgICAgICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1VJRXZlbnRzJyk7XHJcbiAgICAgICAgICAgICAgICBldnQuaW5pdFVJRXZlbnQoJ3Jlc2l6ZScsIHRydWUsIGZhbHNlLCB3aW5kb3csIDApO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZ0KTtcclxuICAgICAgICAgICAgICAgIC8vIG1vZGVybiBkaXNwYXRjaEV2ZW50IHdheVxyXG4gICAgICAgICAgICAgICAgLy8gd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSk7XHJcbiAgICAgICAgICAgIH0sIHZhbHVlIHx8IDMwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIEN1c3RvbSBDb2RlXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0Q3VzdG9tKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0Q3VzdG9tKCkge1xyXG5cclxuICAgICAgICAvLyBjdXN0b20gY29kZVxyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7Il19
