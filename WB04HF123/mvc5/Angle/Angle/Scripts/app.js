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
// Knob chart
// -----------------------------------

(function() {
    'use strict';

    $(initKnob);

    function initKnob() {

        if (!$.fn.knob) return;

        var knobLoaderOptions1 = {
            width: '50%', // responsive
            displayInput: true,
            fgColor: APP_COLORS['info']
        };
        $('#knob-chart1').knob(knobLoaderOptions1);

        var knobLoaderOptions2 = {
            width: '50%', // responsive
            displayInput: true,
            fgColor: APP_COLORS['purple'],
            readOnly: true
        };
        $('#knob-chart2').knob(knobLoaderOptions2);

        var knobLoaderOptions3 = {
            width: '50%', // responsive
            displayInput: true,
            fgColor: APP_COLORS['info'],
            bgColor: APP_COLORS['gray'],
            angleOffset: -125,
            angleArc: 250
        };
        $('#knob-chart3').knob(knobLoaderOptions3);

        var knobLoaderOptions4 = {
            width: '50%', // responsive
            displayInput: true,
            fgColor: APP_COLORS['pink'],
            displayPrevious: true,
            thickness: 0.1,
            lineCap: 'round'
        };
        $('#knob-chart4').knob(knobLoaderOptions4);

    }

})();
// Chart JS
// -----------------------------------

(function() {
    'use strict';

    $(initChartJS);

    function initChartJS() {

        if (typeof Chart === 'undefined') return;

        // random values for demo
        var rFactor = function() {
            return Math.round(Math.random() * 100);
        };

        // Line chart
        // -----------------------------------

        var lineData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgba(114,102,186,0.2)',
                borderColor: 'rgba(114,102,186,1)',
                pointBorderColor: '#fff',
                data: [rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor()]
            }, {
                label: 'My Second dataset',
                backgroundColor: 'rgba(35,183,229,0.2)',
                borderColor: 'rgba(35,183,229,1)',
                pointBorderColor: '#fff',
                data: [rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor()]
            }]
        };

        var lineOptions = {
            legend: {
                display: false
            }
        };
        var linectx = document.getElementById('chartjs-linechart').getContext('2d');
        var lineChart = new Chart(linectx, {
            data: lineData,
            type: 'line',
            options: lineOptions
        });

        // Bar chart
        // -----------------------------------

        var barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                backgroundColor: '#23b7e5',
                borderColor: '#23b7e5',
                data: [rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor()]
            }, {
                backgroundColor: '#5d9cec',
                borderColor: '#5d9cec',
                data: [rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor(), rFactor()]
            }]
        };

        var barOptions = {
            legend: {
                display: false
            }
        };
        var barctx = document.getElementById('chartjs-barchart').getContext('2d');
        var barChart = new Chart(barctx, {
            data: barData,
            type: 'bar',
            options: barOptions
        });

        //  Doughnut chart
        // -----------------------------------

        var doughnutData = {
            labels: [
                'Purple',
                'Yellow',
                'Blue'
            ],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                    '#7266ba',
                    '#fad732',
                    '#23b7e5'
                ],
                hoverBackgroundColor: [
                    '#7266ba',
                    '#fad732',
                    '#23b7e5'
                ]
            }]
        };

        var doughnutOptions = {
            legend: {
                display: false
            }
        };
        var doughnutctx = document.getElementById('chartjs-doughnutchart').getContext('2d');
        var doughnutChart = new Chart(doughnutctx, {
            data: doughnutData,
            type: 'doughnut',
            options: doughnutOptions
        });

        // Pie chart
        // -----------------------------------

        var pieData = {
            labels: [
                'Purple',
                'Yellow',
                'Blue'
            ],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                    '#7266ba',
                    '#fad732',
                    '#23b7e5'
                ],
                hoverBackgroundColor: [
                    '#7266ba',
                    '#fad732',
                    '#23b7e5'
                ]
            }]
        };

        var pieOptions = {
            legend: {
                display: false
            }
        };
        var piectx = document.getElementById('chartjs-piechart').getContext('2d');
        var pieChart = new Chart(piectx, {
            data: pieData,
            type: 'pie',
            options: pieOptions
        });

        // Polar chart
        // -----------------------------------

        var polarData = {
            datasets: [{
                data: [
                    11,
                    16,
                    7,
                    3
                ],
                backgroundColor: [
                    '#f532e5',
                    '#7266ba',
                    '#f532e5',
                    '#7266ba'
                ],
                label: 'My dataset' // for legend
            }],
            labels: [
                'Label 1',
                'Label 2',
                'Label 3',
                'Label 4'
            ]
        };

        var polarOptions = {
            legend: {
                display: false
            }
        };
        var polarctx = document.getElementById('chartjs-polarchart').getContext('2d');
        var polarChart = new Chart(polarctx, {
            data: polarData,
            type: 'polarArea',
            options: polarOptions
        });

        // Radar chart
        // -----------------------------------

        var radarData = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgba(114,102,186,0.2)',
                borderColor: 'rgba(114,102,186,1)',
                data: [65, 59, 90, 81, 56, 55, 40]
            }, {
                label: 'My Second dataset',
                backgroundColor: 'rgba(151,187,205,0.2)',
                borderColor: 'rgba(151,187,205,1)',
                data: [28, 48, 40, 19, 96, 27, 100]
            }]
        };

        var radarOptions = {
            legend: {
                display: false
            }
        };
        var radarctx = document.getElementById('chartjs-radarchart').getContext('2d');
        var radarChart = new Chart(radarctx, {
            data: radarData,
            type: 'radar',
            options: radarOptions
        });

    }

})();
// Chartist
// -----------------------------------

(function() {
    'use strict';

    $(initChartists);

    function initChartists() {

        if (typeof Chartist === 'undefined') return;

        // Bar bipolar
        // -----------------------------------
        var data1 = {
            labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
            series: [
                [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
            ]
        };

        var options1 = {
            high: 10,
            low: -10,
            height: 280,
            axisX: {
                labelInterpolationFnc: function(value, index) {
                    return index % 2 === 0 ? value : null;
                }
            }
        };

        new Chartist.Bar('#ct-bar1', data1, options1);

        // Bar Horizontal
        // -----------------------------------
        new Chartist.Bar('#ct-bar2', {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            series: [
                [5, 4, 3, 7, 5, 10, 3],
                [3, 2, 9, 5, 4, 6, 4]
            ]
        }, {
            seriesBarDistance: 10,
            reverseData: true,
            horizontalBars: true,
            height: 280,
            axisY: {
                offset: 70
            }
        });

        // Line
        // -----------------------------------
        new Chartist.Line('#ct-line1', {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            series: [
                [12, 9, 7, 8, 5],
                [2, 1, 3.5, 7, 3],
                [1, 3, 4, 5, 6]
            ]
        }, {
            fullWidth: true,
            height: 280,
            chartPadding: {
                right: 40
            }
        });


        // SVG Animation
        // -----------------------------------

        var chart1 = new Chartist.Line('#ct-line3', {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            series: [
                [1, 5, 2, 5, 4, 3],
                [2, 3, 4, 8, 1, 2],
                [5, 4, 3, 2, 1, 0.5]
            ]
        }, {
            low: 0,
            showArea: true,
            showPoint: false,
            fullWidth: true,
            height: 300
        });

        chart1.on('draw', function(data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 2000 * data.index,
                        dur: 2000,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            }
        });


        // Slim animation
        // -----------------------------------


        var chart = new Chartist.Line('#ct-line2', {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            series: [
                [12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6],
                [4, 5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5],
                [5, 3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
                [3, 4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3]
            ]
        }, {
            low: 0,
            height: 300
        });

        // Let's put a sequence number aside so we can use it in the event callbacks
        var seq = 0,
            delays = 80,
            durations = 500;

        // Once the chart is fully created we reset the sequence
        chart.on('created', function() {
            seq = 0;
        });

        // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
        chart.on('draw', function(data) {
            seq++;

            if (data.type === 'line') {
                // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
                data.element.animate({
                    opacity: {
                        // The delay when we like to start the animation
                        begin: seq * delays + 1000,
                        // Duration of the animation
                        dur: durations,
                        // The value where the animation should start
                        from: 0,
                        // The value where it should end
                        to: 1
                    }
                });
            } else if (data.type === 'label' && data.axis === 'x') {
                data.element.animate({
                    y: {
                        begin: seq * delays,
                        dur: durations,
                        from: data.y + 100,
                        to: data.y,
                        // We can specify an easing function from Chartist.Svg.Easing
                        easing: 'easeOutQuart'
                    }
                });
            } else if (data.type === 'label' && data.axis === 'y') {
                data.element.animate({
                    x: {
                        begin: seq * delays,
                        dur: durations,
                        from: data.x - 100,
                        to: data.x,
                        easing: 'easeOutQuart'
                    }
                });
            } else if (data.type === 'point') {
                data.element.animate({
                    x1: {
                        begin: seq * delays,
                        dur: durations,
                        from: data.x - 10,
                        to: data.x,
                        easing: 'easeOutQuart'
                    },
                    x2: {
                        begin: seq * delays,
                        dur: durations,
                        from: data.x - 10,
                        to: data.x,
                        easing: 'easeOutQuart'
                    },
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'easeOutQuart'
                    }
                });
            } else if (data.type === 'grid') {
                // Using data.axis we get x or y which we can use to construct our animation definition objects
                var pos1Animation = {
                    begin: seq * delays,
                    dur: durations,
                    from: data[data.axis.units.pos + '1'] - 30,
                    to: data[data.axis.units.pos + '1'],
                    easing: 'easeOutQuart'
                };

                var pos2Animation = {
                    begin: seq * delays,
                    dur: durations,
                    from: data[data.axis.units.pos + '2'] - 100,
                    to: data[data.axis.units.pos + '2'],
                    easing: 'easeOutQuart'
                };

                var animations = {};
                animations[data.axis.units.pos + '1'] = pos1Animation;
                animations[data.axis.units.pos + '2'] = pos2Animation;
                animations['opacity'] = {
                    begin: seq * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: 'easeOutQuart'
                };

                data.element.animate(animations);
            }
        });

        // For the sake of the example we update the chart every time it's created with a delay of 10 seconds
        chart.on('created', function() {
            if (window.__exampleAnimateTimeout) {
                clearTimeout(window.__exampleAnimateTimeout);
                window.__exampleAnimateTimeout = null;
            }
            window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 12000);
        });

    }

})();
// Easypie chart Loader
// -----------------------------------

(function() {
    'use strict';

    $(initEasyPieChart);

    function initEasyPieChart() {

        if (!$.fn.easyPieChart) return;

        // Usage via data attributes
        // <div class="easypie-chart" data-easypiechart data-percent="X" data-optionName="value"></div>
        $('[data-easypiechart]').each(function() {
            var $elem = $(this);
            var options = $elem.data();
            $elem.easyPieChart(options || {});
        });

        // programmatic usage
        var pieOptions1 = {
            animate: {
                duration: 800,
                enabled: true
            },
            barColor: APP_COLORS['success'],
            trackColor: false,
            scaleColor: false,
            lineWidth: 10,
            lineCap: 'circle'
        };
        $('#easypie1').easyPieChart(pieOptions1);

        var pieOptions2 = {
            animate: {
                duration: 800,
                enabled: true
            },
            barColor: APP_COLORS['warning'],
            trackColor: false,
            scaleColor: false,
            lineWidth: 4,
            lineCap: 'circle'
        };
        $('#easypie2').easyPieChart(pieOptions2);

        var pieOptions3 = {
            animate: {
                duration: 800,
                enabled: true
            },
            barColor: APP_COLORS['danger'],
            trackColor: false,
            scaleColor: APP_COLORS['gray'],
            lineWidth: 15,
            lineCap: 'circle'
        };
        $('#easypie3').easyPieChart(pieOptions3);

        var pieOptions4 = {
            animate: {
                duration: 800,
                enabled: true
            },
            barColor: APP_COLORS['danger'],
            trackColor: APP_COLORS['yellow'],
            scaleColor: APP_COLORS['gray-dark'],
            lineWidth: 15,
            lineCap: 'circle'
        };
        $('#easypie4').easyPieChart(pieOptions4);

    }

})();
// CHART SPLINE
// -----------------------------------
(function() {
    'use strict';

    $(initFlotSpline);

    function initFlotSpline() {

        var data = [{
            "label": "Uniques",
            "color": "#768294",
            "data": [
                ["Mar", 70],
                ["Apr", 85],
                ["May", 59],
                ["Jun", 93],
                ["Jul", 66],
                ["Aug", 86],
                ["Sep", 60]
            ]
        }, {
            "label": "Recurrent",
            "color": "#1f92fe",
            "data": [
                ["Mar", 21],
                ["Apr", 12],
                ["May", 27],
                ["Jun", 24],
                ["Jul", 16],
                ["Aug", 39],
                ["Sep", 15]
            ]
        }];

        var datav2 = [{
            "label": "Hours",
            "color": "#23b7e5",
            "data": [
                ["Jan", 70],
                ["Feb", 20],
                ["Mar", 70],
                ["Apr", 85],
                ["May", 59],
                ["Jun", 93],
                ["Jul", 66],
                ["Aug", 86],
                ["Sep", 60],
                ["Oct", 60],
                ["Nov", 12],
                ["Dec", 50]
            ]
        }, {
            "label": "Commits",
            "color": "#7266ba",
            "data": [
                ["Jan", 20],
                ["Feb", 70],
                ["Mar", 30],
                ["Apr", 50],
                ["May", 85],
                ["Jun", 43],
                ["Jul", 96],
                ["Aug", 36],
                ["Sep", 80],
                ["Oct", 10],
                ["Nov", 72],
                ["Dec", 31]
            ]
        }];

        var datav3 = [{
            "label": "Home",
            "color": "#1ba3cd",
            "data": [
                ["1", 38],
                ["2", 40],
                ["3", 42],
                ["4", 48],
                ["5", 50],
                ["6", 70],
                ["7", 145],
                ["8", 70],
                ["9", 59],
                ["10", 48],
                ["11", 38],
                ["12", 29],
                ["13", 30],
                ["14", 22],
                ["15", 28]
            ]
        }, {
            "label": "Overall",
            "color": "#3a3f51",
            "data": [
                ["1", 16],
                ["2", 18],
                ["3", 17],
                ["4", 16],
                ["5", 30],
                ["6", 110],
                ["7", 19],
                ["8", 18],
                ["9", 110],
                ["10", 19],
                ["11", 16],
                ["12", 10],
                ["13", 20],
                ["14", 10],
                ["15", 20]
            ]
        }];

        var options = {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true,
                    radius: 4
                },
                splines: {
                    show: true,
                    tension: 0.4,
                    lineWidth: 1,
                    fill: 0.5
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function(label, x, y) { return x + ' : ' + y; }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                max: 150, // optional: use it for a clear represetation
                tickColor: '#eee',
                //position: 'right' or 'left',
                tickFormatter: function(v) {
                    return v /* + ' visitors'*/ ;
                }
            },
            shadowSize: 0
        };

        var chart = $('.chart-spline');
        if (chart.length)
            $.plot(chart, data, options);

        var chartv2 = $('.chart-splinev2');
        if (chartv2.length)
            $.plot(chartv2, datav2, options);

        var chartv3 = $('.chart-splinev3');
        if (chartv3.length)
            $.plot(chartv3, datav3, options);

    }

})();

// CHART AREA
// -----------------------------------
(function() {
    'use strict';


    $(initFlotArea)

    function initFlotArea() {

        var data = [{
            "label": "Uniques",
            "color": "#aad874",
            "data": [
                ["Mar", 50],
                ["Apr", 84],
                ["May", 52],
                ["Jun", 88],
                ["Jul", 69],
                ["Aug", 92],
                ["Sep", 58]
            ]
        }, {
            "label": "Recurrent",
            "color": "#7dc7df",
            "data": [
                ["Mar", 13],
                ["Apr", 44],
                ["May", 44],
                ["Jun", 27],
                ["Jul", 38],
                ["Aug", 11],
                ["Sep", 39]
            ]
        }];

        var options = {
            series: {
                lines: {
                    show: true,
                    fill: 0.8
                },
                points: {
                    show: true,
                    radius: 4
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function(label, x, y) { return x + ' : ' + y; }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                min: 0,
                tickColor: '#eee',
                // position: 'right' or 'left'
                tickFormatter: function(v) {
                    return v + ' visitors';
                }
            },
            shadowSize: 0
        };

        var chart = $('.chart-area');
        if (chart.length)
            $.plot(chart, data, options);

    }

})();

// CHART BAR
// -----------------------------------
(function() {
    'use strict';


    $(initFlotBar)

    function initFlotBar() {

        var data = [{
            "label": "Sales",
            "color": "#9cd159",
            "data": [
                ["Jan", 27],
                ["Feb", 82],
                ["Mar", 56],
                ["Apr", 14],
                ["May", 28],
                ["Jun", 77],
                ["Jul", 23],
                ["Aug", 49],
                ["Sep", 81],
                ["Oct", 20]
            ]
        }];

        var options = {
            series: {
                bars: {
                    align: 'center',
                    lineWidth: 0,
                    show: true,
                    barWidth: 0.6,
                    fill: 0.9
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function(label, x, y) { return x + ' : ' + y; }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                // position: 'right' or 'left'
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        var chart = $('.chart-bar');
        if (chart.length)
            $.plot(chart, data, options);

    }

})();


// CHART BAR STACKED
// -----------------------------------
(function() {
    'use strict';


    $(initFlotBarStacked);

    function initFlotBarStacked() {

        var data = [{
            "label": "Tweets",
            "color": "#51bff2",
            "data": [
                ["Jan", 56],
                ["Feb", 81],
                ["Mar", 97],
                ["Apr", 44],
                ["May", 24],
                ["Jun", 85],
                ["Jul", 94],
                ["Aug", 78],
                ["Sep", 52],
                ["Oct", 17],
                ["Nov", 90],
                ["Dec", 62]
            ]
        }, {
            "label": "Likes",
            "color": "#4a8ef1",
            "data": [
                ["Jan", 69],
                ["Feb", 135],
                ["Mar", 14],
                ["Apr", 100],
                ["May", 100],
                ["Jun", 62],
                ["Jul", 115],
                ["Aug", 22],
                ["Sep", 104],
                ["Oct", 132],
                ["Nov", 72],
                ["Dec", 61]
            ]
        }, {
            "label": "+1",
            "color": "#f0693a",
            "data": [
                ["Jan", 29],
                ["Feb", 36],
                ["Mar", 47],
                ["Apr", 21],
                ["May", 5],
                ["Jun", 49],
                ["Jul", 37],
                ["Aug", 44],
                ["Sep", 28],
                ["Oct", 9],
                ["Nov", 12],
                ["Dec", 35]
            ]
        }];

        var datav2 = [{
            "label": "Pending",
            "color": "#9289ca",
            "data": [
                ["Pj1", 86],
                ["Pj2", 136],
                ["Pj3", 97],
                ["Pj4", 110],
                ["Pj5", 62],
                ["Pj6", 85],
                ["Pj7", 115],
                ["Pj8", 78],
                ["Pj9", 104],
                ["Pj10", 82],
                ["Pj11", 97],
                ["Pj12", 110],
                ["Pj13", 62]
            ]
        }, {
            "label": "Assigned",
            "color": "#7266ba",
            "data": [
                ["Pj1", 49],
                ["Pj2", 81],
                ["Pj3", 47],
                ["Pj4", 44],
                ["Pj5", 100],
                ["Pj6", 49],
                ["Pj7", 94],
                ["Pj8", 44],
                ["Pj9", 52],
                ["Pj10", 17],
                ["Pj11", 47],
                ["Pj12", 44],
                ["Pj13", 100]
            ]
        }, {
            "label": "Completed",
            "color": "#564aa3",
            "data": [
                ["Pj1", 29],
                ["Pj2", 56],
                ["Pj3", 14],
                ["Pj4", 21],
                ["Pj5", 5],
                ["Pj6", 24],
                ["Pj7", 37],
                ["Pj8", 22],
                ["Pj9", 28],
                ["Pj10", 9],
                ["Pj11", 14],
                ["Pj12", 21],
                ["Pj13", 5]
            ]
        }];

        var options = {
            series: {
                stack: true,
                bars: {
                    align: 'center',
                    lineWidth: 0,
                    show: true,
                    barWidth: 0.6,
                    fill: 0.9
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function(label, x, y) { return x + ' : ' + y; }
            },
            xaxis: {
                tickColor: '#fcfcfc',
                mode: 'categories'
            },
            yaxis: {
                // position: 'right' or 'left'
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        var chart = $('.chart-bar-stacked');
        if (chart.length)
            $.plot(chart, data, options);

        var chartv2 = $('.chart-bar-stackedv2');
        if (chartv2.length)
            $.plot(chartv2, datav2, options);

    }

})();

// CHART DONUT
// -----------------------------------
(function() {
    'use strict';


    $(initFlotDonut);

    function initFlotDonut() {

        var data = [{
            "color": "#39C558",
            "data": 60,
            "label": "Coffee"
        }, {
            "color": "#00b4ff",
            "data": 90,
            "label": "CSS"
        }, {
            "color": "#FFBE41",
            "data": 50,
            "label": "LESS"
        }, {
            "color": "#ff3e43",
            "data": 80,
            "label": "Jade"
        }, {
            "color": "#937fc7",
            "data": 116,
            "label": "AngularJS"
        }];

        var options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.5 // This makes the donut shape
                }
            }
        };

        var chart = $('.chart-donut');
        if (chart.length)
            $.plot(chart, data, options);

    }

})();

// CHART LINE
// -----------------------------------
(function() {
    'use strict';


    $(initFlotLine)

    function initFlotLine() {

        var data = [{
            "label": "Complete",
            "color": "#5ab1ef",
            "data": [
                ["Jan", 188],
                ["Feb", 183],
                ["Mar", 185],
                ["Apr", 199],
                ["May", 190],
                ["Jun", 194],
                ["Jul", 194],
                ["Aug", 184],
                ["Sep", 74]
            ]
        }, {
            "label": "In Progress",
            "color": "#f5994e",
            "data": [
                ["Jan", 153],
                ["Feb", 116],
                ["Mar", 136],
                ["Apr", 119],
                ["May", 148],
                ["Jun", 133],
                ["Jul", 118],
                ["Aug", 161],
                ["Sep", 59]
            ]
        }, {
            "label": "Cancelled",
            "color": "#d87a80",
            "data": [
                ["Jan", 111],
                ["Feb", 97],
                ["Mar", 93],
                ["Apr", 110],
                ["May", 102],
                ["Jun", 93],
                ["Jul", 92],
                ["Aug", 92],
                ["Sep", 44]
            ]
        }];

        var options = {
            series: {
                lines: {
                    show: true,
                    fill: 0.01
                },
                points: {
                    show: true,
                    radius: 4
                }
            },
            grid: {
                borderColor: '#eee',
                borderWidth: 1,
                hoverable: true,
                backgroundColor: '#fcfcfc'
            },
            tooltip: true,
            tooltipOpts: {
                content: function(label, x, y) { return x + ' : ' + y; }
            },
            xaxis: {
                tickColor: '#eee',
                mode: 'categories'
            },
            yaxis: {
                // position: 'right' or 'left'
                tickColor: '#eee'
            },
            shadowSize: 0
        };

        var chart = $('.chart-line');
        if (chart.length)
            $.plot(chart, data, options);

    }

})();


// CHART PIE
// -----------------------------------
(function() {
    'use strict';


    $(initFlotPie);

    function initFlotPie() {

        var data = [{
            "label": "jQuery",
            "color": "#4acab4",
            "data": 30
        }, {
            "label": "CSS",
            "color": "#ffea88",
            "data": 40
        }, {
            "label": "LESS",
            "color": "#ff8153",
            "data": 90
        }, {
            "label": "SASS",
            "color": "#878bb6",
            "data": 75
        }, {
            "label": "Jade",
            "color": "#b2d767",
            "data": 120
        }];

        var options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0,
                    label: {
                        show: true,
                        radius: 0.8,
                        formatter: function(label, series) {
                            return '<div class="flot-pie-label">' +
                                //label + ' : ' +
                                Math.round(series.percent) +
                                '%</div>';
                        },
                        background: {
                            opacity: 0.8,
                            color: '#222'
                        }
                    }
                }
            }
        };

        var chart = $('.chart-pie');
        if (chart.length)
            $.plot(chart, data, options);

    }

})();
// Morris
// -----------------------------------

(function() {
    'use strict';

    $(initMorris);

    function initMorris() {

        if (typeof Morris === 'undefined') return;

        var chartdata = [
            { y: "2006", a: 100, b: 90 },
            { y: "2007", a: 75, b: 65 },
            { y: "2008", a: 50, b: 40 },
            { y: "2009", a: 75, b: 65 },
            { y: "2010", a: 50, b: 40 },
            { y: "2011", a: 75, b: 65 },
            { y: "2012", a: 100, b: 90 }
        ];

        var donutdata = [
            { label: "Download Sales", value: 12 },
            { label: "In-Store Sales", value: 30 },
            { label: "Mail-Order Sales", value: 20 }
        ];

        // Line Chart
        // -----------------------------------

        new Morris.Line({
            element: 'morris-line',
            data: chartdata,
            xkey: 'y',
            ykeys: ["a", "b"],
            labels: ["Serie A", "Serie B"],
            lineColors: ["#31C0BE", "#7a92a3"],
            resize: true
        });

        // Donut Chart
        // -----------------------------------
        new Morris.Donut({
            element: 'morris-donut',
            data: donutdata,
            colors: ['#f05050', '#fad732', '#ff902b'],
            resize: true
        });

        // Bar Chart
        // -----------------------------------
        new Morris.Bar({
            element: 'morris-bar',
            data: chartdata,
            xkey: 'y',
            ykeys: ["a", "b"],
            labels: ["Series A", "Series B"],
            xLabelMargin: 2,
            barColors: ['#23b7e5', '#f05050'],
            resize: true
        });

        // Area Chart
        // -----------------------------------
        new Morris.Area({
            element: 'morris-area',
            data: chartdata,
            xkey: 'y',
            ykeys: ["a", "b"],
            labels: ["Serie A", "Serie B"],
            lineColors: ['#7266ba', '#23b7e5'],
            resize: true
        });

    }

})();
// Rickshaw
// -----------------------------------

(function() {
    'use strict';

    $(initMorris);

    function initMorris() {

        if (typeof Rickshaw === 'undefined') return;

        var seriesData = [
            [],
            [],
            []
        ];
        var random = new Rickshaw.Fixtures.RandomData(150);

        for (var i = 0; i < 150; i++) {
            random.addData(seriesData);
        }

        var series1 = [{
            color: "#c05020",
            data: seriesData[0],
            name: 'New York'
        }, {
            color: "#30c020",
            data: seriesData[1],
            name: 'London'
        }, {
            color: "#6060c0",
            data: seriesData[2],
            name: 'Tokyo'
        }];

        var graph1 = new Rickshaw.Graph({
            element: document.querySelector("#rickshaw1"),
            series: series1,
            renderer: 'area'
        });

        graph1.render();


        // Graph 2
        // -----------------------------------

        var graph2 = new Rickshaw.Graph({
            element: document.querySelector("#rickshaw2"),
            renderer: 'area',
            stroke: true,
            series: [{
                data: [{ x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 }],
                color: '#f05050'
            }, {
                data: [{ x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 }],
                color: '#fad732'
            }]
        });

        graph2.render();

        // Graph 3
        // -----------------------------------


        var graph3 = new Rickshaw.Graph({
            element: document.querySelector("#rickshaw3"),
            renderer: 'line',
            series: [{
                data: [{ x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 }],
                color: '#7266ba'
            }, {
                data: [{ x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 19 }, { x: 3, y: 15 }, { x: 4, y: 16 }],
                color: '#23b7e5'
            }]
        });
        graph3.render();


        // Graph 4
        // -----------------------------------


        var graph4 = new Rickshaw.Graph({
            element: document.querySelector("#rickshaw4"),
            renderer: 'bar',
            series: [{
                data: [{ x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 38 }, { x: 3, y: 30 }, { x: 4, y: 32 }],
                color: '#fad732'
            }, {
                data: [{ x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 19 }, { x: 3, y: 15 }, { x: 4, y: 16 }],
                color: '#ff902b'

            }]
        });
        graph4.render();

    }

})();
// SPARKLINE
// -----------------------------------

(function() {
    'use strict';

    $(initSparkline);

    function initSparkline() {

        $('[data-sparkline]').each(initSparkLine);

        function initSparkLine() {
            var $element = $(this),
                options = $element.data(),
                values = options.values && options.values.split(',');

            options.type = options.type || 'bar'; // default chart is bar
            options.disableHiddenCheck = true;

            $element.sparkline(values, options);

            if (options.resize) {
                $(window).resize(function() {
                    $element.sparkline(values, options);
                });
            }
        }
    }

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
// Demo Cards
// -----------------------------------

(function() {
    'use strict';

    $(initCardDemo);

    function initCardDemo() {

        /**
         * This functions show a demonstration of how to use
         * the card tools system via custom event.
         */
        var cardList = [].slice.call(document.querySelectorAll('.card.card-demo'));
        cardList.forEach(function(item) {

            item.addEventListener('card.refresh', function(event) {
                // get the card element that is refreshing
                var card = event.detail.card;
                // perform any action here, when it is done,
                // remove the spinner calling "removeSpinner"
                // setTimeout used to simulate async operation
                setTimeout(card.removeSpinner, 3000);
            })
            item.addEventListener('card.collapse.hide', function() {
                console.log('Card Collapse Hide');
            })
            item.addEventListener('card.collapse.show', function() {
                console.log('Card Collapse Show');
            })
            item.addEventListener('card.remove', function(event) {
                var confirm = event.detail.confirm;
                var cancel = event.detail.cancel;
                // perform any action  here
                console.log('Removing Card');
                // Call confirm() to continue removing card
                // otherwise call cancel()
                confirm();
            })
            item.addEventListener('card.removed', function(event) {
                console.log('Removed Card');
            });

        })

    }

})();
// Nestable demo
// -----------------------------------

(function() {
    'use strict';

    $(initNestable);

    function initNestable() {

        if (!$.fn.nestable) return;

        var updateOutput = function(e) {
            var list = e.length ? e : $(e.target),
                output = list.data('output');
            if (window.JSON) {
                output.val(window.JSON.stringify(list.nestable('serialize'))); //, null, 2));
            } else {
                output.val('JSON browser support required for this demo.');
            }
        };

        // activate Nestable for list 1
        $('#nestable').nestable({
                group: 1
            })
            .on('change', updateOutput);

        // activate Nestable for list 2
        $('#nestable2').nestable({
                group: 1
            })
            .on('change', updateOutput);

        // output initial serialised data
        updateOutput($('#nestable').data('output', $('#nestable-output')));
        updateOutput($('#nestable2').data('output', $('#nestable2-output')));

        $('.js-nestable-action').on('click', function(e) {
            var target = $(e.target),
                action = target.data('action');
            if (action === 'expand-all') {
                $('.dd').nestable('expandAll');
            }
            if (action === 'collapse-all') {
                $('.dd').nestable('collapseAll');
            }
        });

    }

})();
/**=========================================================
 * Module: notify.js
 * Create toggleable notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 * [data-toggle="notify"]
 * [data-options="options in json format" ]
 =========================================================*/

(function() {
    'use strict';

    $(initNotify);

    function initNotify() {

        var Selector = '[data-notify]',
            autoloadSelector = '[data-onload]',
            doc = $(document);

        $(Selector).each(function() {

            var $this = $(this),
                onload = $this.data('onload');

            if (onload !== undefined) {
                setTimeout(function() {
                    notifyNow($this);
                }, 800);
            }

            $this.on('click', function(e) {
                e.preventDefault();
                notifyNow($this);
            });

        });

    }

    function notifyNow($element) {
        var message = $element.data('message'),
            options = $element.data('options');

        if (!message)
            $.error('Notify: No message specified');

        $.notify(message, options || {});
    }


})();


/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */

(function() {

    var containers = {},
        messages = {},

        notify = function(options) {

            if ($.type(options) == 'string') {
                options = { message: options };
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? { status: arguments[1] } : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll = function(group, instantly) {
            if (group) {
                for (var id in messages) { if (group === messages[id].group) messages[id].close(instantly); }
            } else {
                for (var id in messages) { messages[id].close(instantly); }
            }
        };

    var Message = function(options) {

        var $this = this;

        this.options = $.extend({}, Message.defaults, options);

        this.uuid = "ID" + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
        this.element = $([
            // alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
            '<a class="close">&times;</a>',
            '<div>' + this.options.message + '</div>',
            '</div>'

        ].join('')).data("notifyMessage", this);

        // status
        if (this.options.status) {
            this.element.addClass('alert alert-' + this.options.status);
            this.currentstatus = this.options.status;
        }

        this.group = this.options.group;

        messages[this.uuid] = this;

        if (!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".uk-notify-message", function() {
                $(this).data("notifyMessage").close();
            });
        }
    };


    $.extend(Message.prototype, {

        uuid: false,
        element: false,
        timout: false,
        currentstatus: "",
        group: false,

        show: function() {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({ "opacity": 0, "margin-top": -1 * this.element.outerHeight(), "margin-bottom": 0 }).animate({ "opacity": 1, "margin-top": 0, "margin-bottom": marginbottom }, function() {

                if ($this.options.timeout) {

                    var closefn = function() { $this.close(); };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout); }
                    );
                }

            });

            return this;
        },

        close: function(instantly) {

            var $this = this,
                finalize = function() {
                    $this.element.remove();

                    if (!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }

                    delete messages[$this.uuid];
                };

            if (this.timeout) clearTimeout(this.timeout);

            if (instantly) {
                finalize();
            } else {
                this.element.animate({ "opacity": 0, "margin-top": -1 * this.element.outerHeight(), "margin-bottom": 0 }, function() {
                    finalize();
                });
            }
        },

        content: function(html) {

            var container = this.element.find(">div");

            if (!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function(status) {

            if (!status) {
                return this.currentstatus;
            }

            this.element.removeClass('alert alert-' + this.currentstatus).addClass('alert alert-' + status);

            this.currentstatus = status;

            return this;
        }
    });

    Message.defaults = {
        message: "",
        status: "normal",
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };


    $["notify"] = notify;
    $["notify"].message = Message;
    $["notify"].closeAll = closeAll;

    return notify;

}());
/**=========================================================
 * Module: portlet.js
 * Drag and drop any card to change its position
 * The Selector should could be applied to any object that contains
 * card, so .col-* element are ideal.
 =========================================================*/

(function() {
    'use strict';

    var STORAGE_KEY_NAME = 'jq-portletState';

    $(initPortlets);

    function initPortlets() {

        // Component is NOT optional
        if (!$.fn.sortable) return;

        var Selector = '[data-toggle="portlet"]';

        $(Selector).sortable({
            connectWith:          Selector,
            items:                'div.card',
            handle:               '.portlet-handler',
            opacity:              0.7,
            placeholder:          'portlet box-placeholder',
            cancel:               '.portlet-cancel',
            forcePlaceholderSize: true,
            iframeFix:            false,
            tolerance:            'pointer',
            helper:               'original',
            revert:               200,
            forceHelperSize:      true,
            update:               savePortletOrder,
            create:               loadPortletOrder
        })
        // optionally disables mouse selection
        //.disableSelection()
        ;

    }

    function savePortletOrder(event, ui) {

        var data = Storages.localStorage.get(STORAGE_KEY_NAME);

        if (!data) { data = {}; }

        data[this.id] = $(this).sortable('toArray');

        if (data) {
            Storages.localStorage.set(STORAGE_KEY_NAME, data);
        }

    }

    function loadPortletOrder() {

        var data = Storages.localStorage.get(STORAGE_KEY_NAME);

        if (data) {

            var porletId = this.id,
                cards = data[porletId];

            if (cards) {
                var portlet = $('#' + porletId);

                $.each(cards, function(index, value) {
                    $('#' + value).appendTo(portlet);
                });
            }

        }

    }

    // Reset porlet save state
    window.resetPorlets = function(e) {
        Storages.localStorage.remove(STORAGE_KEY_NAME);
        // reload the page
        window.location.reload();
    }

})();
// HTML5 Sortable demo
// -----------------------------------

(function() {
    'use strict';

    $(initSortable);

    function initSortable() {

        if (typeof sortable === 'undefined') return;

        sortable('.sortable', {
            forcePlaceholderSize: true,
            placeholder: '<div class="box-placeholder p0 m0"><div></div></div>'
        });

    }

})();
// Sweet Alert
// -----------------------------------

(function() {
    'use strict';

    $(initSweetAlert);

    function initSweetAlert() {

        $('#swal-demo1').on('click', function(e) {
            e.preventDefault();
            swal("Here's a message!")
        });

        $('#swal-demo2').on('click', function(e) {
            e.preventDefault();
            swal("Here's a message!", "It's pretty, isn't it?")
        });

        $('#swal-demo3').on('click', function(e) {
            e.preventDefault();
            swal("Good job!", "You clicked the button!", "success")
        });

        $('#swal-demo4').on('click', function(e) {
            e.preventDefault();
            swal({
                title: 'Are you sure?',
                text: 'Your will not be able to recover this imaginary file!',
                icon: 'warning',
                buttons: {
                    cancel: true,
                    confirm: {
                        text: 'Yes, delete it!',
                        value: true,
                        visible: true,
                        className: "bg-danger",
                        closeModal: true
                    }
                }
            }).then(function() {
                swal('Booyah!');
            });

        });

        $('#swal-demo5').on('click', function(e) {
            e.preventDefault();
            swal({
                title: 'Are you sure?',
                text: 'Your will not be able to recover this imaginary file!',
                icon: 'warning',
                buttons: {
                    cancel: {
                        text: 'No, cancel plx!',
                        value: null,
                        visible: true,
                        className: "",
                        closeModal: false
                    },
                    confirm: {
                        text: 'Yes, delete it!',
                        value: true,
                        visible: true,
                        className: "bg-danger",
                        closeModal: false
                    }
                }
            }).then(function(isConfirm) {
                if (isConfirm) {
                    swal('Deleted!', 'Your imaginary file has been deleted.', 'success');
                } else {
                    swal('Cancelled', 'Your imaginary file is safe :)', 'error');
                }
            });

        });

    }

})();
// Full Calendar
// -----------------------------------


(function() {
    'use strict';

    // When dom ready, init calendar and events
    $(initFullCalendar);

    function initFullCalendar() {

        if (!$.fn.fullCalendar) return;

        // The element that will display the calendar
        var calendar = $('#calendar');

        var demoEvents = createDemoEvents();

        initExternalEvents(calendar);

        initCalendar(calendar, demoEvents);

    }


    // global shared var to know what we are dragging
    var draggingEvent = null;

    /**
     * ExternalEvent object
     * @param jQuery Object elements Set of element as jQuery objects
     */
    var ExternalEvent = function(elements) {

        if (!elements) return;

        elements.each(function() {
            var $this = $(this);
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var calendarEventObject = {
                title: $.trim($this.text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $this.data('calendarEventObject', calendarEventObject);

            // make the event draggable using jQuery UI
            $this.draggable({
                zIndex: 1070,
                revert: true, // will cause the event to go back to its
                revertDuration: 0 //  original position after the drag
            });

        });
    };

    /**
     * Invoke full calendar plugin and attach behavior
     * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
     * @param  EventObject [events] An object with the event list to load when the calendar displays
     */
    function initCalendar(calElement, events) {

        // check to remove elements from the list
        var removeAfterDrop = $('#remove-after-drop');

        calElement.fullCalendar({
            // isRTL: true,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            buttonIcons: { // note the space at the beginning
                prev: ' fa fa-caret-left',
                next: ' fa fa-caret-right'
            },
            buttonText: {
                today: 'today',
                month: 'month',
                week: 'week',
                day: 'day'
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            drop: function(date, allDay) { // this function is called when something is dropped

                var $this = $(this),
                    // retrieve the dropped element's stored Event Object
                    originalEventObject = $this.data('calendarEventObject');

                // if something went wrong, abort
                if (!originalEventObject) return;

                // clone the object to avoid multiple events with reference to the same object
                var clonedEventObject = $.extend({}, originalEventObject);

                // assign the reported date
                clonedEventObject.start = date;
                clonedEventObject.allDay = allDay;
                clonedEventObject.backgroundColor = $this.css('background-color');
                clonedEventObject.borderColor = $this.css('border-color');

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks"
                // (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                calElement.fullCalendar('renderEvent', clonedEventObject, true);

                // if necessary remove the element from the list
                if (removeAfterDrop.is(':checked')) {
                    $this.remove();
                }
            },
            eventDragStart: function(event, js, ui) {
                draggingEvent = event;
            },
            // This array is the events sources
            events: events
        });
    }

    /**
     * Inits the external events card
     * @param  jQuery [calElement] The calendar dom element wrapped into jQuery
     */
    function initExternalEvents(calElement) {
        // Card with the external events list
        var externalEvents = $('.external-events');

        // init the external events in the card
        new ExternalEvent(externalEvents.children('div'));

        // External event color is danger-red by default
        var currColor = '#f6504d';
        // Color selector button
        var eventAddBtn = $('.external-event-add-btn');
        // New external event name input
        var eventNameInput = $('.external-event-name');
        // Color switchers
        var eventColorSelector = $('.external-event-color-selector .circle');

        // Trash events Droparea
        $('.external-events-trash').droppable({
            accept: '.fc-event',
            activeClass: 'active',
            hoverClass: 'hovered',
            tolerance: 'touch',
            drop: function(event, ui) {

                // You can use this function to send an ajax request
                // to remove the event from the repository

                if (draggingEvent) {
                    var eid = draggingEvent.id || draggingEvent._id;
                    // Remove the event
                    calElement.fullCalendar('removeEvents', eid);
                    // Remove the dom element
                    ui.draggable.remove();
                    // clear
                    draggingEvent = null;
                }
            }
        });

        eventColorSelector.click(function(e) {
            e.preventDefault();
            var $this = $(this);

            // Save color
            currColor = $this.css('background-color');
            // De-select all and select the current one
            eventColorSelector.removeClass('selected');
            $this.addClass('selected');
        });

        eventAddBtn.click(function(e) {
            e.preventDefault();

            // Get event name from input
            var val = eventNameInput.val();
            // Dont allow empty values
            if ($.trim(val) === '') return;

            // Create new event element
            var newEvent = $('<div/>').css({
                    'background-color': currColor,
                    'border-color': currColor,
                    'color': '#fff'
                })
                .html(val);

            // Prepends to the external events list
            externalEvents.prepend(newEvent);
            // Initialize the new event element
            new ExternalEvent(newEvent);
            // Clear input
            eventNameInput.val('');
        });
    }

    /**
     * Creates an array of events to display in the first load of the calendar
     * Wrap into this function a request to a source to get via ajax the stored events
     * @return Array The array with the events
     */
    function createDemoEvents() {
        // Date for the calendar events (dummy data)
        var date = new Date();
        var d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear();

        return [{
            title: 'All Day Event',
            start: new Date(y, m, 1),
            backgroundColor: '#f56954', //red
            borderColor: '#f56954' //red
        }, {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2),
            backgroundColor: '#f39c12', //yellow
            borderColor: '#f39c12' //yellow
        }, {
            title: 'Meeting',
            start: new Date(y, m, d, 10, 30),
            allDay: false,
            backgroundColor: '#0073b7', //Blue
            borderColor: '#0073b7' //Blue
        }, {
            title: 'Lunch',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false,
            backgroundColor: '#00c0ef', //Info (aqua)
            borderColor: '#00c0ef' //Info (aqua)
        }, {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false,
            backgroundColor: '#00a65a', //Success (green)
            borderColor: '#00a65a' //Success (green)
        }, {
            title: 'Open Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: '//google.com/',
            backgroundColor: '#3c8dbc', //Primary (light-blue)
            borderColor: '#3c8dbc' //Primary (light-blue)
        }];
    }

})();
// JQCloud
// -----------------------------------


(function() {
    'use strict';

    $(initWordCloud);

    function initWordCloud() {

        if (!$.fn.jQCloud) return;

        //Create an array of word objects, each representing a word in the cloud
        var word_array = [
            { text: 'Lorem', weight: 13, /*link: 'http://themicon.co'*/ },
            { text: 'Ipsum', weight: 10.5 },
            { text: 'Dolor', weight: 9.4 },
            { text: 'Sit', weight: 8 },
            { text: 'Amet', weight: 6.2 },
            { text: 'Consectetur', weight: 5 },
            { text: 'Adipiscing', weight: 5 },
            { text: 'Sit', weight: 8 },
            { text: 'Amet', weight: 6.2 },
            { text: 'Consectetur', weight: 5 },
            { text: 'Adipiscing', weight: 5 }
        ];

        $("#jqcloud").jQCloud(word_array, {
            width: 240,
            height: 200,
            steps: 7
        });

    }

})();
// Search Results
// -----------------------------------


(function() {
    'use strict';

    $(initSearch);

    function initSearch() {

        if (!$.fn.slider) return;
        if (!$.fn.chosen) return;
        if (!$.fn.datepicker) return;

        // BOOTSTRAP SLIDER CTRL
        // -----------------------------------

        $('[data-ui-slider]').slider();

        // CHOSEN
        // -----------------------------------

        $('.chosen-select').chosen();

        // DATETIMEPICKER
        // -----------------------------------

        $('#datetimepicker').datepicker({
            orientation: 'bottom',
            icons: {
                time: 'fa fa-clock-o',
                date: 'fa fa-calendar',
                up: 'fa fa-chevron-up',
                down: 'fa fa-chevron-down',
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-crosshairs',
                clear: 'fa fa-trash'
            }
        });

    }

})();
// Color picker
// -----------------------------------

(function() {
    'use strict';

    $(initColorPicker);

    function initColorPicker() {

        if (!$.fn.colorpicker) return;

        $('.demo-colorpicker').colorpicker();

        $('#demo_selectors').colorpicker({
            colorSelectors: {
                'default': '#777777',
                'primary': APP_COLORS['primary'],
                'success': APP_COLORS['success'],
                'info': APP_COLORS['info'],
                'warning': APP_COLORS['warning'],
                'danger': APP_COLORS['danger']
            }
        });

    }

})();
// Forms Demo
// -----------------------------------


(function() {
    'use strict';

    $(initFormsDemo);

    function initFormsDemo() {

        if (!$.fn.slider) return;
        if (!$.fn.chosen) return;
        if (!$.fn.inputmask) return;
        if (!$.fn.filestyle) return;
        if (!$.fn.wysiwyg) return;
        if (!$.fn.datepicker) return;

        // BOOTSTRAP SLIDER CTRL
        // -----------------------------------

        $('[data-ui-slider]').slider();

        // CHOSEN
        // -----------------------------------

        $('.chosen-select').chosen();

        // MASKED
        // -----------------------------------

        $('[data-masked]').inputmask();

        // FILESTYLE
        // -----------------------------------

        $('.filestyle').filestyle();

        // WYSIWYG
        // -----------------------------------

        $('.wysiwyg').wysiwyg();


        // DATETIMEPICKER
        // -----------------------------------

        $('#datetimepicker1').datepicker({
            orientation: 'bottom',
            icons: {
                time: 'fa fa-clock-o',
                date: 'fa fa-calendar',
                up: 'fa fa-chevron-up',
                down: 'fa fa-chevron-down',
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-crosshairs',
                clear: 'fa fa-trash'
            }
        });
        // only time
        $('#datetimepicker2').datepicker({
            format: 'mm-dd-yyyy'
        });

    }

})();
/**=========================================================
 * Module: Image Cropper
 =========================================================*/

(function() {
    'use strict';

    $(initImageCropper);

    function initImageCropper() {

        if (!$.fn.cropper) return;

        var $image = $('.img-container > img'),
            $dataX = $('#dataX'),
            $dataY = $('#dataY'),
            $dataHeight = $('#dataHeight'),
            $dataWidth = $('#dataWidth'),
            $dataRotate = $('#dataRotate'),
            options = {
                // data: {
                //   x: 420,
                //   y: 60,
                //   width: 640,
                //   height: 360
                // },
                // strict: false,
                // responsive: false,
                // checkImageOrigin: false

                // modal: false,
                // guides: false,
                // highlight: false,
                // background: false,

                // autoCrop: false,
                // autoCropArea: 0.5,
                // dragCrop: false,
                // movable: false,
                // rotatable: false,
                // zoomable: false,
                // touchDragZoom: false,
                // mouseWheelZoom: false,
                // cropBoxMovable: false,
                // cropBoxResizable: false,
                // doubleClickToggle: false,

                // minCanvasWidth: 320,
                // minCanvasHeight: 180,
                // minCropBoxWidth: 160,
                // minCropBoxHeight: 90,
                // minContainerWidth: 320,
                // minContainerHeight: 180,

                // build: null,
                // built: null,
                // dragstart: null,
                // dragmove: null,
                // dragend: null,
                // zoomin: null,
                // zoomout: null,

                aspectRatio: 16 / 9,
                preview: '.img-preview',
                crop: function(data) {
                    $dataX.val(Math.round(data.x));
                    $dataY.val(Math.round(data.y));
                    $dataHeight.val(Math.round(data.height));
                    $dataWidth.val(Math.round(data.width));
                    $dataRotate.val(Math.round(data.rotate));
                }
            };

        $image.on({
            'build.cropper': function(e) {
                console.log(e.type);
            },
            'built.cropper': function(e) {
                console.log(e.type);
            },
            'dragstart.cropper': function(e) {
                console.log(e.type, e.dragType);
            },
            'dragmove.cropper': function(e) {
                console.log(e.type, e.dragType);
            },
            'dragend.cropper': function(e) {
                console.log(e.type, e.dragType);
            },
            'zoomin.cropper': function(e) {
                console.log(e.type);
            },
            'zoomout.cropper': function(e) {
                console.log(e.type);
            },
            'change.cropper': function(e) {
                console.log(e.type);
            }
        }).cropper(options);


        // Methods
        $(document.body).on('click', '[data-method]', function() {
            var data = $(this).data(),
                $target,
                result;

            if (!$image.data('cropper')) {
                return;
            }

            if (data.method) {
                data = $.extend({}, data); // Clone a new one

                if (typeof data.target !== 'undefined') {
                    $target = $(data.target);

                    if (typeof data.option === 'undefined') {
                        try {
                            data.option = JSON.parse($target.val());
                        } catch (e) {
                            console.log(e.message);
                        }
                    }
                }

                result = $image.cropper(data.method, data.option);

                if (data.method === 'getCroppedCanvas') {
                    $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
                }

                if ($.isPlainObject(result) && $target) {
                    try {
                        $target.val(JSON.stringify(result));
                    } catch (e) {
                        console.log(e.message);
                    }
                }

            }
        }).on('keydown', function(e) {

            if (!$image.data('cropper')) {
                return;
            }

            switch (e.which) {
                case 37:
                    e.preventDefault();
                    $image.cropper('move', -1, 0);
                    break;

                case 38:
                    e.preventDefault();
                    $image.cropper('move', 0, -1);
                    break;

                case 39:
                    e.preventDefault();
                    $image.cropper('move', 1, 0);
                    break;

                case 40:
                    e.preventDefault();
                    $image.cropper('move', 0, 1);
                    break;
            }

        });


        // Import image
        var $inputImage = $('#inputImage'),
            URL = window.URL || window.webkitURL,
            blobURL;

        if (URL) {
            $inputImage.change(function() {
                var files = this.files,
                    file;

                if (!$image.data('cropper')) {
                    return;
                }

                if (files && files.length) {
                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        blobURL = URL.createObjectURL(file);
                        $image.one('built.cropper', function() {
                            URL.revokeObjectURL(blobURL); // Revoke when load complete
                        }).cropper('reset').cropper('replace', blobURL);
                        $inputImage.val('');
                    } else {
                        alert('Please choose an image file.');
                    }
                }
            });
        } else {
            $inputImage.parent().remove();
        }


        // Options
        $('.docs-options :checkbox').on('change', function() {
            var $this = $(this);

            if (!$image.data('cropper')) {
                return;
            }

            options[$this.val()] = $this.prop('checked');
            $image.cropper('destroy').cropper(options);
        });


        // Tooltips
        $('[data-toggle="tooltip"]').tooltip();

    }

})();
// Select2
// -----------------------------------

(function() {
    'use strict';

    $(initSelect2);

    function initSelect2() {

        if (!$.fn.select2) return;

        // Select 2

        $('#select2-1').select2({
            theme: 'bootstrap4'
        });
        $('#select2-2').select2({
            theme: 'bootstrap4'
        });
        $('#select2-3').select2({
            theme: 'bootstrap4'
        });
        $('#select2-4').select2({
            placeholder: 'Select a state',
            allowClear: true,
            theme: 'bootstrap4'
        });

    }

})();
(function() {
    'use strict';

    if (typeof Dropzone === 'undefined') return;

    // Prevent Dropzone from auto discovering
    // This is useful when you want to create the
    // Dropzone programmatically later
    Dropzone.autoDiscover = false;

    $(initDropzone);

    function initDropzone() {

        // Dropzone settings
        var dropzoneOptions = {
            autoProcessQueue: false,
            uploadMultiple: true,
            parallelUploads: 100,
            maxFiles: 100,
            dictDefaultMessage: '<em class="fa fa-upload text-muted"></em><br>Drop files here to upload', // default messages before first drop
            paramName: 'file', // The name that will be used to transfer the file
            maxFilesize: 2, // MB
            addRemoveLinks: true,
            accept: function(file, done) {
                if (file.name === 'justinbieber.jpg') {
                    done('Naha, you dont. :)');
                } else {
                    done();
                }
            },
            init: function() {
                var dzHandler = this;

                this.element.querySelector('button[type=submit]').addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dzHandler.processQueue();
                });
                this.on('addedfile', function(file) {
                    console.log('Added file: ' + file.name);
                });
                this.on('removedfile', function(file) {
                    console.log('Removed file: ' + file.name);
                });
                this.on('sendingmultiple', function() {

                });
                this.on('successmultiple', function( /*files, response*/ ) {

                });
                this.on('errormultiple', function( /*files, response*/ ) {

                });
            }

        };

        var dropzoneArea = new Dropzone('#dropzone-area', dropzoneOptions);

    }

})();
// Forms Demo
// -----------------------------------


(function() {
    'use strict';

    $(initWizard);

    function initWizard() {

        if (!$.fn.validate) return;

        // FORM EXAMPLE
        // -----------------------------------
        var form = $("#example-form");
        form.validate({
            errorPlacement: function errorPlacement(error, element) { element.before(error); },
            rules: {
                confirm: {
                    equalTo: "#password"
                }
            }
        });
        form.children("div").steps({
            headerTag: "h4",
            bodyTag: "fieldset",
            transitionEffect: "slideLeft",
            onStepChanging: function(event, currentIndex, newIndex) {
                form.validate().settings.ignore = ":disabled,:hidden";
                return form.valid();
            },
            onFinishing: function(event, currentIndex) {
                form.validate().settings.ignore = ":disabled";
                return form.valid();
            },
            onFinished: function(event, currentIndex) {
                alert("Submitted!");

                // Submit form
                $(this).submit();
            }
        });

        // VERTICAL
        // -----------------------------------

        $("#example-vertical").steps({
            headerTag: "h4",
            bodyTag: "section",
            transitionEffect: "slideLeft",
            stepsOrientation: "vertical"
        });

    }

})();
// Xeditable Demo
// -----------------------------------

(function() {
    'use strict';

    $(initXEditable);

    function initXEditable() {

        if (!$.fn.editable) return

        // Font Awesome support
        $.fn.editableform.buttons =
            '<button type="submit" class="btn btn-primary btn-sm editable-submit">' +
            '<i class="fa fa-fw fa-check"></i>' +
            '</button>' +
            '<button type="button" class="btn btn-default btn-sm editable-cancel">' +
            '<i class="fa fa-fw fa-times"></i>' +
            '</button>';

        //defaults
        //$.fn.editable.defaults.url = 'url/to/server';

        //enable / disable
        $('#enable').click(function() {
            $('#user .editable').editable('toggleDisabled');
        });

        //editables
        $('#username').editable({
            // url: 'url/to/server',
            type: 'text',
            pk: 1,
            name: 'username',
            title: 'Enter username',
            mode: 'inline'
        });

        $('#firstname').editable({
            validate: function(value) {
                if ($.trim(value) === '') return 'This field is required';
            },
            mode: 'inline'
        });

        $('#sex').editable({
            prepend: "not selected",
            source: [
                { value: 1, text: 'Male' },
                { value: 2, text: 'Female' }
            ],
            display: function(value, sourceData) {
                var colors = { "": "gray", 1: "green", 2: "blue" },
                    elem = $.grep(sourceData, function(o) { return o.value == value; });

                if (elem.length) {
                    $(this).text(elem[0].text).css("color", colors[value]);
                } else {
                    $(this).empty();
                }
            },
            mode: 'inline'
        });

        $('#status').editable({
            mode: 'inline'
        });

        $('#group').editable({
            showbuttons: false,
            mode: 'inline'
        });

        $('#dob').editable({
            mode: 'inline'
        });

        $('#event').editable({
            placement: 'right',
            combodate: {
                firstItem: 'name'
            },
            mode: 'inline'
        });

        $('#comments').editable({
            showbuttons: 'bottom',
            mode: 'inline'
        });

        $('#note').editable({
            mode: 'inline'
        });
        $('#pencil').click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('#note').editable('toggle');
        });

        $('#user .editable').on('hidden', function(e, reason) {
            if (reason === 'save' || reason === 'nochange') {
                var $next = $(this).closest('tr').next().find('.editable');
                if ($('#autoopen').is(':checked')) {
                    setTimeout(function() {
                        $next.editable('show');
                    }, 300);
                } else {
                    $next.focus();
                }
            }
        });

        // TABLE
        // -----------------------------------

        $('#users a').editable({
            type: 'text',
            name: 'username',
            title: 'Enter username',
            mode: 'inline'
        });

    }

})();
/**=========================================================
 * Module: gmap.js
 * Init Google Map plugin
 =========================================================*/

(function() {
    'use strict';

    $(initGoogleMaps);

    // -------------------------
    // Map Style definition
    // -------------------------
    // Get more styles from http://snazzymaps.com/style/29/light-monochrome
    // - Just replace and assign to 'MapStyles' the new style array
    var MapStyles = [{ featureType: 'water', stylers: [{ visibility: 'on' }, { color: '#bdd1f9' }] }, { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#334165' }] }, { featureType: 'landscape', stylers: [{ color: '#e9ebf1' }] }, { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#c5c6c6' }] }, { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fff' }] }, { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#fff' }] }, { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#d8dbe0' }] }, { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#cfd5e0' }] }, { featureType: 'administrative', stylers: [{ visibility: 'on' }, { lightness: 33 }] }, { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'on' }, { lightness: 20 }] }, { featureType: 'road', stylers: [{ color: '#d8dbe0', lightness: 20 }] }];


    function initGoogleMaps() {

        if (!$.fn.gMap) return;

        var mapSelector = '[data-gmap]';
        var gMapRefs = [];

        $(mapSelector).each(function() {

            var $this = $(this),
                addresses = $this.data('address') && $this.data('address').split(';'),
                titles = $this.data('title') && $this.data('title').split(';'),
                zoom = $this.data('zoom') || 14,
                maptype = $this.data('maptype') || 'ROADMAP', // or 'TERRAIN'
                markers = [];

            if (addresses) {
                for (var a in addresses) {
                    if (typeof addresses[a] == 'string') {
                        markers.push({
                            address: addresses[a],
                            html: (titles && titles[a]) || '',
                            popup: true /* Always popup */
                        });
                    }
                }

                var options = {
                    controls: {
                        panControl: true,
                        zoomControl: true,
                        mapTypeControl: true,
                        scaleControl: true,
                        streetViewControl: true,
                        overviewMapControl: true
                    },
                    scrollwheel: false,
                    maptype: maptype,
                    markers: markers,
                    zoom: zoom
                    // More options https://github.com/marioestrada/jQuery-gMap
                };

                var gMap = $this.gMap(options);

                var ref = gMap.data('gMap.reference');
                // save in the map references list
                gMapRefs.push(ref);

                // set the styles
                if ($this.data('styled') !== undefined) {

                    ref.setOptions({
                        styles: MapStyles
                    });

                }
            }

        }); //each

    }

})();
// jVectorMap
// -----------------------------------


(function() {
    'use strict';

    $(initVectorMap);

    function initVectorMap() {

        var element = $('[data-vector-map]');

        var seriesData = {
            'CA': 11100, // Canada
            'DE': 2510, // Germany
            'FR': 3710, // France
            'AU': 5710, // Australia
            'GB': 8310, // Great Britain
            'RU': 9310, // Russia
            'BR': 6610, // Brazil
            'IN': 7810, // India
            'CN': 4310, // China
            'US': 839, // USA
            'SA': 410 // Saudi Arabia
        };

        var markersData = [
            { latLng: [41.90, 12.45], name: 'Vatican City' },
            { latLng: [43.73, 7.41], name: 'Monaco' },
            { latLng: [-0.52, 166.93], name: 'Nauru' },
            { latLng: [-8.51, 179.21], name: 'Tuvalu' },
            { latLng: [7.11, 171.06], name: 'Marshall Islands' },
            { latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis' },
            { latLng: [3.2, 73.22], name: 'Maldives' },
            { latLng: [35.88, 14.5], name: 'Malta' },
            { latLng: [41.0, -71.06], name: 'New England' },
            { latLng: [12.05, -61.75], name: 'Grenada' },
            { latLng: [13.16, -59.55], name: 'Barbados' },
            { latLng: [17.11, -61.85], name: 'Antigua and Barbuda' },
            { latLng: [-4.61, 55.45], name: 'Seychelles' },
            { latLng: [7.35, 134.46], name: 'Palau' },
            { latLng: [42.5, 1.51], name: 'Andorra' }
        ];

        new VectorMap(element, seriesData, markersData);

    }

})();
// JVECTOR MAP
// -----------------------------------

(function() {
    'use strict';

    // Allow Global access
    window.VectorMap = VectorMap

    var defaultColors = {
        markerColor: '#23b7e5', // the marker points
        bgColor: 'transparent', // the background
        scaleColors: ['#878c9a'], // the color of the region in the serie
        regionFill: '#bbbec6' // the base region color
    };

    function VectorMap(element, seriesData, markersData) {

        if (!element || !element.length) return;

        var attrs = element.data(),
            mapHeight = attrs.height || '300',
            options = {
                markerColor: attrs.markerColor || defaultColors.markerColor,
                bgColor: attrs.bgColor || defaultColors.bgColor,
                scale: attrs.scale || 1,
                scaleColors: attrs.scaleColors || defaultColors.scaleColors,
                regionFill: attrs.regionFill || defaultColors.regionFill,
                mapName: attrs.mapName || 'world_mill_en'
            };

        element.css('height', mapHeight);

        init(element, options, seriesData, markersData);

        function init($element, opts, series, markers) {

            $element.vectorMap({
                map: opts.mapName,
                backgroundColor: opts.bgColor,
                zoomMin: 1,
                zoomMax: 8,
                zoomOnScroll: false,
                regionStyle: {
                    initial: {
                        'fill': opts.regionFill,
                        'fill-opacity': 1,
                        'stroke': 'none',
                        'stroke-width': 1.5,
                        'stroke-opacity': 1
                    },
                    hover: {
                        'fill-opacity': 0.8
                    },
                    selected: {
                        fill: 'blue'
                    },
                    selectedHover: {}
                },
                focusOn: { x: 0.4, y: 0.6, scale: opts.scale },
                markerStyle: {
                    initial: {
                        fill: opts.markerColor,
                        stroke: opts.markerColor
                    }
                },
                onRegionLabelShow: function(e, el, code) {
                    if (series && series[code])
                        el.html(el.html() + ': ' + series[code] + ' visitors');
                },
                markers: markers,
                series: {
                    regions: [{
                        values: series,
                        scale: opts.scaleColors,
                        normalizeFunction: 'polynomial'
                    }]
                },
            });

        } // end init
    };

})();
/**
 * Used for user pages
 * Login and Register
 */
(function() {
    'use strict';

    $(initParsleyForPages)

    function initParsleyForPages() {

        // Parsley options setup for bootstrap validation classes
        var parsleyOptions = {
            errorClass: 'is-invalid',
            successClass: 'is-valid',
            classHandler: function(ParsleyField) {
                var el = ParsleyField.$element.parents('.form-group').find('input');
                if (!el.length) // support custom checkbox
                    el = ParsleyField.$element.parents('.c-checkbox').find('label');
                return el;
            },
            errorsContainer: function(ParsleyField) {
                return ParsleyField.$element.parents('.form-group');
            },
            errorsWrapper: '<div class="text-help">',
            errorTemplate: '<div></div>'
        };

        // Login form validation with Parsley
        var loginForm = $("#loginForm");
        if (loginForm.length)
            loginForm.parsley(parsleyOptions);

        // Register form validation with Parsley
        var registerForm = $("#registerForm");
        if (registerForm.length)
            registerForm.parsley(parsleyOptions);

    }

})();
// BOOTGRID
// -----------------------------------

(function() {
    'use strict';

    $(initBootgrid);

    function initBootgrid() {

        if (!$.fn.bootgrid) return;

        $('#bootgrid-basic').bootgrid({
            templates: {
                // templates for BS4
                actionButton: '<button class="btn btn-secondary" type="button" title="{{ctx.text}}">{{ctx.content}}</button>',
                actionDropDown: '<div class="{{css.dropDownMenu}}"><button class="btn btn-secondary dropdown-toggle dropdown-toggle-nocaret" type="button" data-toggle="dropdown"><span class="{{css.dropDownMenuText}}">{{ctx.content}}</span></button><ul class="{{css.dropDownMenuItems}}" role="menu"></ul></div>',
                actionDropDownItem: '<li class="dropdown-item"><a href="" data-action="{{ctx.action}}" class="dropdown-link {{css.dropDownItemButton}}">{{ctx.text}}</a></li>',
                actionDropDownCheckboxItem: '<li class="dropdown-item"><label class="dropdown-item p-0"><input name="{{ctx.name}}" type="checkbox" value="1" class="{{css.dropDownItemCheckbox}}" {{ctx.checked}} /> {{ctx.label}}</label></li>',
                paginationItem: '<li class="page-item {{ctx.css}}"><a href="" data-page="{{ctx.page}}" class="page-link {{css.paginationButton}}">{{ctx.text}}</a></li>',
            }
        });

        $('#bootgrid-selection').bootgrid({
            selection: true,
            multiSelect: true,
            rowSelect: true,
            keepSelection: true,
            templates: {
                select:
                    '<div class="checkbox c-checkbox">' +
                        '<label class="mb-0">' +
                            '<input type="{{ctx.type}}" class="{{css.selectBox}}" value="{{ctx.value}}" {{ctx.checked}}>' +
                            '<span class="fa fa-check"></span>' +
                        '</label>'+
                    '</div>',
                // templates for BS4
                actionButton: '<button class="btn btn-secondary" type="button" title="{{ctx.text}}">{{ctx.content}}</button>',
                actionDropDown: '<div class="{{css.dropDownMenu}}"><button class="btn btn-secondary dropdown-toggle dropdown-toggle-nocaret" type="button" data-toggle="dropdown"><span class="{{css.dropDownMenuText}}">{{ctx.content}}</span></button><ul class="{{css.dropDownMenuItems}}" role="menu"></ul></div>',
                actionDropDownItem: '<li class="dropdown-item"><a href="" data-action="{{ctx.action}}" class="dropdown-link {{css.dropDownItemButton}}">{{ctx.text}}</a></li>',
                actionDropDownCheckboxItem: '<li class="dropdown-item"><label class="dropdown-item p-0"><input name="{{ctx.name}}" type="checkbox" value="1" class="{{css.dropDownItemCheckbox}}" {{ctx.checked}} /> {{ctx.label}}</label></li>',
                paginationItem: '<li class="page-item {{ctx.css}}"><a href="" data-page="{{ctx.page}}" class="page-link {{css.paginationButton}}">{{ctx.text}}</a></li>',
            }
        });

        var grid = $('#bootgrid-command').bootgrid({
            formatters: {
                commands: function(column, row) {
                    return '<button type="button" class="btn btn-sm btn-info mr-2 command-edit" data-row-id="' + row.id + '"><em class="fa fa-edit fa-fw"></em></button>' +
                        '<button type="button" class="btn btn-sm btn-danger command-delete" data-row-id="' + row.id + '"><em class="fa fa-trash fa-fw"></em></button>';
                }
            },
            templates: {
                // templates for BS4
                actionButton: '<button class="btn btn-secondary" type="button" title="{{ctx.text}}">{{ctx.content}}</button>',
                actionDropDown: '<div class="{{css.dropDownMenu}}"><button class="btn btn-secondary dropdown-toggle dropdown-toggle-nocaret" type="button" data-toggle="dropdown"><span class="{{css.dropDownMenuText}}">{{ctx.content}}</span></button><ul class="{{css.dropDownMenuItems}}" role="menu"></ul></div>',
                actionDropDownItem: '<li class="dropdown-item"><a href="" data-action="{{ctx.action}}" class="dropdown-link {{css.dropDownItemButton}}">{{ctx.text}}</a></li>',
                actionDropDownCheckboxItem: '<li class="dropdown-item"><label class="dropdown-item p-0"><input name="{{ctx.name}}" type="checkbox" value="1" class="{{css.dropDownItemCheckbox}}" {{ctx.checked}} /> {{ctx.label}}</label></li>',
                paginationItem: '<li class="page-item {{ctx.css}}"><a href="" data-page="{{ctx.page}}" class="page-link {{css.paginationButton}}">{{ctx.text}}</a></li>',
            }
        }).on('loaded.rs.jquery.bootgrid', function() {
            /* Executes after data is loaded and rendered */
            grid.find('.command-edit').on('click', function() {
                console.log('You pressed edit on row: ' + $(this).data('row-id'));
            }).end().find('.command-delete').on('click', function() {
                console.log('You pressed delete on row: ' + $(this).data('row-id'));
            });
        });

    }

})();
// DATATABLES
// -----------------------------------

(function() {
    'use strict';

    $(initDatatables);

    function initDatatables() {

        if (!$.fn.DataTable) return;

        // Zero configuration

        $('#datatable1').DataTable({
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: true,
            // Text translation options
            // Note the required keywords between underscores (e.g _MENU_)
            oLanguage: {
                sSearch: '<em class="fas fa-search"></em>',
                sLengthMenu: '_MENU_ records per page',
                info: 'Showing page _PAGE_ of _PAGES_',
                zeroRecords: 'Nothing found - sorry',
                infoEmpty: 'No records available',
                infoFiltered: '(filtered from _MAX_ total records)',
                oPaginate: {
                    sNext: '<em class="fa fa-caret-right"></em>',
                    sPrevious: '<em class="fa fa-caret-left"></em>'
                }
            }
        });


        // Filter

        $('#datatable2').DataTable({
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: true,
            // Text translation options
            // Note the required keywords between underscores (e.g _MENU_)
            oLanguage: {
                sSearch: 'Search all columns:',
                sLengthMenu: '_MENU_ records per page',
                info: 'Showing page _PAGE_ of _PAGES_',
                zeroRecords: 'Nothing found - sorry',
                infoEmpty: 'No records available',
                infoFiltered: '(filtered from _MAX_ total records)',
                oPaginate: {
                    sNext: '<em class="fa fa-caret-right"></em>',
                    sPrevious: '<em class="fa fa-caret-left"></em>'
                }
            },
            // Datatable Buttons setup
            dom: 'Bfrtip',
            buttons: [
                { extend: 'copy', className: 'btn-info' },
                { extend: 'csv', className: 'btn-info' },
                { extend: 'excel', className: 'btn-info', title: 'XLS-File' },
                { extend: 'pdf', className: 'btn-info', title: $('title').text() },
                { extend: 'print', className: 'btn-info' }
            ]
        });

        $('#datatable3').DataTable({
            'paging': true, // Table pagination
            'ordering': true, // Column ordering
            'info': true, // Bottom left status text
            responsive: true,
            // Text translation options
            // Note the required keywords between underscores (e.g _MENU_)
            oLanguage: {
                sSearch: 'Search all columns:',
                sLengthMenu: '_MENU_ records per page',
                info: 'Showing page _PAGE_ of _PAGES_',
                zeroRecords: 'Nothing found - sorry',
                infoEmpty: 'No records available',
                infoFiltered: '(filtered from _MAX_ total records)',
                oPaginate: {
                    sNext: '<em class="fa fa-caret-right"></em>',
                    sPrevious: '<em class="fa fa-caret-left"></em>'
                }
            },
            // Datatable key setup
            keys: true
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndyYXBwZXIuanMiLCJhcHAuaW5pdC5qcyIsImNoYXJ0cy9jaGFydC1rbm9iLmpzIiwiY2hhcnRzL2NoYXJ0LmpzIiwiY2hhcnRzL2NoYXJ0aXN0LmpzIiwiY2hhcnRzL2Vhc3lwaWVjaGFydC5qcyIsImNoYXJ0cy9mbG90LmpzIiwiY2hhcnRzL21vcnJpcy5qcyIsImNoYXJ0cy9yaWNrc2hhdy5qcyIsImNoYXJ0cy9zcGFya2xpbmUuanMiLCJjb21tb24vYm9vdHN0cmFwLXN0YXJ0LmpzIiwiY29tbW9uL2NhcmQtdG9vbHMuanMiLCJjb21tb24vY29uc3RhbnRzLmpzIiwiY29tbW9uL2Z1bGxzY3JlZW4uanMiLCJjb21tb24vbG9hZC1jc3MuanMiLCJjb21tb24vbG9jYWxpemUuanMiLCJjb21tb24vbmF2YmFyLXNlYXJjaC5qcyIsImNvbW1vbi9ub3cuanMiLCJjb21tb24vcnRsLmpzIiwiY29tbW9uL3NpZGViYXIuanMiLCJjb21tb24vc2xpbXNjcm9sbC5qcyIsImNvbW1vbi90YWJsZS1jaGVja2FsbC5qcyIsImNvbW1vbi90b2dnbGUtc3RhdGUuanMiLCJjb21tb24vdHJpZ2dlci1yZXNpemUuanMiLCJlbGVtZW50cy9jYXJkcy5qcyIsImVsZW1lbnRzL25lc3RhYmxlLmpzIiwiZWxlbWVudHMvbm90aWZ5LmpzIiwiZWxlbWVudHMvcG9ybGV0cy5qcyIsImVsZW1lbnRzL3NvcnRhYmxlLmpzIiwiZWxlbWVudHMvc3dlZXRhbGVydC5qcyIsImV4dHJhcy9jYWxlbmRhci5qcyIsImV4dHJhcy9qcWNsb3VkLmpzIiwiZXh0cmFzL3NlYXJjaC5qcyIsImZvcm1zL2NvbG9yLXBpY2tlci5qcyIsImZvcm1zL2Zvcm1zLmpzIiwiZm9ybXMvaW1hZ2Vjcm9wLmpzIiwiZm9ybXMvc2VsZWN0Mi5qcyIsImZvcm1zL3VwbG9hZC5qcyIsImZvcm1zL3dpemFyZC5qcyIsImZvcm1zL3hlZGl0YWJsZS5qcyIsIm1hcHMvZ21hcC5qcyIsIm1hcHMvdmVjdG9yLm1hcC5kZW1vLmpzIiwibWFwcy92ZWN0b3IubWFwLmpzIiwicGFnZXMvcGFnZXMuanMiLCJ0YWJsZXMvYm9vdGdyaWQuanMiLCJ0YWJsZXMvZGF0YXRhYmxlLmpzIiwiY3VzdG9tLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbmVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBUaGlzIGxpYnJhcnkgd2FzIGNyZWF0ZWQgdG8gZW11bGF0ZSBzb21lIGpRdWVyeSBmZWF0dXJlc1xyXG4gKiB1c2VkIGluIHRoaXMgdGVtcGxhdGUgb25seSB3aXRoIEphdmFzY3JpcHQgYW5kIERPTVxyXG4gKiBtYW5pcHVsYXRpb24gZnVuY3Rpb25zIChJRTEwKykuXHJcbiAqIEFsbCBtZXRob2RzIHdlcmUgZGVzaWduZWQgZm9yIGFuIGFkZXF1YXRlIGFuZCBzcGVjaWZpYyB1c2VcclxuICogYW5kIGRvbid0IHBlcmZvcm0gYSBkZWVwIHZhbGlkYXRpb24gb24gdGhlIGFyZ3VtZW50cyBwcm92aWRlZC5cclxuICpcclxuICogSU1QT1JUQU5UOlxyXG4gKiA9PT09PT09PT09XHJcbiAqIEl0J3Mgc3VnZ2VzdGVkIE5PVCB0byB1c2UgdGhpcyBsaWJyYXJ5IGV4dGVuc2l2ZWx5IHVubGVzcyB5b3VcclxuICogdW5kZXJzdGFuZCB3aGF0IGVhY2ggbWV0aG9kIGRvZXMuIEluc3RlYWQsIHVzZSBvbmx5IEpTIG9yXHJcbiAqIHlvdSBtaWdodCBldmVuIG5lZWQgalF1ZXJ5LlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbihnbG9iYWwsIGZhY3RvcnkpIHtcclxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHsgLy8gQ29tbW9uSlMtbGlrZVxyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xyXG4gICAgfSBlbHNlIHsgLy8gQnJvd3NlclxyXG4gICAgICAgIGlmICh0eXBlb2YgZ2xvYmFsLmpRdWVyeSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIGdsb2JhbC4kID0gZmFjdG9yeSgpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8vIEhFTFBFUlNcclxuICAgIGZ1bmN0aW9uIGFycmF5RnJvbShvYmopIHtcclxuICAgICAgICByZXR1cm4gKCdsZW5ndGgnIGluIG9iaikgJiYgKG9iaiAhPT0gd2luZG93KSA/IFtdLnNsaWNlLmNhbGwob2JqKSA6IFtvYmpdO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZpbHRlcihjdHgsIGZuKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdLmZpbHRlci5jYWxsKGN0eCwgZm4pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1hcChjdHgsIGZuKSB7XHJcbiAgICAgICAgcmV0dXJuIFtdLm1hcC5jYWxsKGN0eCwgZm4pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1hdGNoZXMoaXRlbSwgc2VsZWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gKEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgfHwgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IpLmNhbGwoaXRlbSwgc2VsZWN0b3IpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gRXZlbnRzIGhhbmRsZXIgd2l0aCBzaW1wbGUgc2NvcGVkIGV2ZW50cyBzdXBwb3J0XHJcbiAgICB2YXIgRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7fTtcclxuICAgIH1cclxuICAgIEV2ZW50SGFuZGxlci5wcm90b3R5cGUgPSB7XHJcbiAgICAgICAgLy8gZXZlbnQgYWNjZXB0czogJ2NsaWNrJyBvciAnY2xpY2suc2NvcGUnXHJcbiAgICAgICAgYmluZDogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyLCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBldmVudC5zcGxpdCgnLicpWzBdO1xyXG4gICAgICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudF0gPSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHVuYmluZDogZnVuY3Rpb24oZXZlbnQsIHRhcmdldCkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQgaW4gdGhpcy5ldmVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuZXZlbnRzW2V2ZW50XS50eXBlLCB0aGlzLmV2ZW50c1tldmVudF0ubGlzdGVuZXIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tldmVudF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT2JqZWN0IERlZmluaXRpb25cclxuICAgIHZhciBXcmFwID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldHVwKFtdKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDT05TVFJVQ1RPUlxyXG4gICAgV3JhcC5Db25zdHJ1Y3RvciA9IGZ1bmN0aW9uKHBhcmFtLCBhdHRycykge1xyXG4gICAgICAgIHZhciBlbCA9IG5ldyBXcmFwKHBhcmFtKTtcclxuICAgICAgICByZXR1cm4gZWwuaW5pdChhdHRycyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENvcmUgbWV0aG9kc1xyXG4gICAgV3JhcC5wcm90b3R5cGUgPSB7XHJcbiAgICAgICAgY29uc3RydWN0b3I6IFdyYXAsXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5pdGlhbGl6ZSB0aGUgb2JqZWN0IGRlcGVuZGluZyBvbiBwYXJhbSB0eXBlXHJcbiAgICAgICAgICogW2F0dHJzXSBvbmx5IHRvIGhhbmRsZSAkKGh0bWxTdHJpbmcsIHthdHRyaWJ1dGVzfSlcclxuICAgICAgICAgKi9cclxuICAgICAgICBpbml0OiBmdW5jdGlvbihhdHRycykge1xyXG4gICAgICAgICAgICAvLyBlbXB0eSBvYmplY3RcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdG9yKSByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgLy8gc2VsZWN0b3IgPT09IHN0cmluZ1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBsb29rcyBsaWtlIG1hcmt1cCwgdHJ5IHRvIGNyZWF0ZSBhbiBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RvclswXSA9PT0gJzwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW0gPSB0aGlzLl9zZXR1cChbdGhpcy5fY3JlYXRlKHRoaXMuc2VsZWN0b3IpXSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0cnMgPyBlbGVtLmF0dHIoYXR0cnMpIDogZWxlbTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXR1cChhcnJheUZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yKSkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gc2VsZWN0b3IgPT09IERPTUVsZW1lbnRcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0b3Iubm9kZVR5cGUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0dXAoW3RoaXMuc2VsZWN0b3JdKVxyXG4gICAgICAgICAgICBlbHNlIC8vIHNob3J0aGFuZCBmb3IgRE9NUmVhZHlcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5zZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0dXAoW2RvY3VtZW50XSkucmVhZHkodGhpcy5zZWxlY3RvcilcclxuICAgICAgICAgICAgLy8gQXJyYXkgbGlrZSBvYmplY3RzIChlLmcuIE5vZGVMaXN0L0hUTUxDb2xsZWN0aW9uKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0dXAoYXJyYXlGcm9tKHRoaXMuc2VsZWN0b3IpKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlcyBhIERPTSBlbGVtZW50IGZyb20gYSBzdHJpbmdcclxuICAgICAgICAgKiBTdHJpY3RseSBzdXBwb3J0cyB0aGUgZm9ybTogJzx0YWc+JyBvciAnPHRhZy8+J1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF9jcmVhdGU6IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgICAgICAgICB2YXIgbm9kZU5hbWUgPSBzdHIuc3Vic3RyKHN0ci5pbmRleE9mKCc8JykgKyAxLCBzdHIuaW5kZXhPZignPicpIC0gMSkucmVwbGFjZSgnLycsICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiogc2V0dXAgcHJvcGVydGllcyBhbmQgYXJyYXkgdG8gZWxlbWVudCBzZXQgKi9cclxuICAgICAgICBfc2V0dXA6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgZm9yICg7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykgZGVsZXRlIHRoaXNbaV07IC8vIGNsZWFuIHVwIG9sZCBzZXRcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB0aGlzW2ldID0gZWxlbWVudHNbaV0gLy8gbmV3IHNldFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIF9maXJzdDogZnVuY3Rpb24oY2IsIHJldCkge1xyXG4gICAgICAgICAgICB2YXIgZiA9IHRoaXMuZWxlbWVudHNbMF07XHJcbiAgICAgICAgICAgIHJldHVybiBmID8gKGNiID8gY2IuY2FsbCh0aGlzLCBmKSA6IGYpIDogcmV0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqIENvbW1vbiBmdW5jdGlvbiBmb3IgY2xhc3MgbWFuaXB1bGF0aW9uICAqL1xyXG4gICAgICAgIF9jbGFzc2VzOiBmdW5jdGlvbihtZXRob2QsIGNsYXNzbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY2xzID0gY2xhc3NuYW1lLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgIGlmIChjbHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY2xzLmZvckVhY2godGhpcy5fY2xhc3Nlcy5iaW5kKHRoaXMsIG1ldGhvZCkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWV0aG9kID09PSAnY29udGFpbnMnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW0gPSB0aGlzLl9maXJzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbGVtID8gZWxlbS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NuYW1lKSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChjbGFzc25hbWUgPT09ICcnKSA/IHRoaXMgOiB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0W21ldGhvZF0oY2xhc3NuYW1lKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE11bHRpIHB1cnBvc2UgZnVuY3Rpb24gdG8gc2V0IG9yIGdldCBhIChrZXksIHZhbHVlKVxyXG4gICAgICAgICAqIElmIG5vIHZhbHVlLCB3b3JrcyBhcyBhIGdldHRlciBmb3IgdGhlIGdpdmVuIGtleVxyXG4gICAgICAgICAqIGtleSBjYW4gYmUgYW4gb2JqZWN0IGluIHRoZSBmb3JtIHtrZXk6IHZhbHVlLCAuLi59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgX2FjY2VzczogZnVuY3Rpb24oa2V5LCB2YWx1ZSwgZm4pIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIGtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjY2VzcyhrLCBrZXlba10sIGZuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmlyc3QoZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihlbGVtLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBmbihpdGVtLCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlYWNoOiBmdW5jdGlvbihmbiwgYXJyKSB7XHJcbiAgICAgICAgICAgIGFyciA9IGFyciA/IGFyciA6IHRoaXMuZWxlbWVudHM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm4uY2FsbChhcnJbaV0sIGksIGFycltpXSkgPT09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogQWxsb3dzIHRvIGV4dGVuZCB3aXRoIG5ldyBtZXRob2RzICovXHJcbiAgICBXcmFwLmV4dGVuZCA9IGZ1bmN0aW9uKG1ldGhvZHMpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgV3JhcC5wcm90b3R5cGVbbV0gPSBtZXRob2RzW21dXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBET00gUkVBRFlcclxuICAgIFdyYXAuZXh0ZW5kKHtcclxuICAgICAgICByZWFkeTogZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50ID8gZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyA6IGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJykge1xyXG4gICAgICAgICAgICAgICAgZm4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8vIEFDQ0VTU1xyXG4gICAgV3JhcC5leHRlbmQoe1xyXG4gICAgICAgIC8qKiBHZXQgb3Igc2V0IGEgY3NzIHZhbHVlICovXHJcbiAgICAgICAgY3NzOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBnZXRTdHlsZSA9IGZ1bmN0aW9uKGUsIGspIHsgcmV0dXJuIGUuc3R5bGVba10gfHwgZ2V0Q29tcHV0ZWRTdHlsZShlKVtrXTsgfTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2VzcyhrZXksIHZhbHVlLCBmdW5jdGlvbihpdGVtLCBrLCB2YWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciB1bml0ID0gKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSA/ICdweCcgOiAnJztcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IGdldFN0eWxlKGl0ZW0sIGspIDogKGl0ZW0uc3R5bGVba10gPSB2YWwgKyB1bml0KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKiBHZXQgYW4gYXR0cmlidXRlIG9yIHNldCBpdCAqL1xyXG4gICAgICAgIGF0dHI6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2VzcyhrZXksIHZhbHVlLCBmdW5jdGlvbihpdGVtLCBrLCB2YWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IGl0ZW0uZ2V0QXR0cmlidXRlKGspIDogaXRlbS5zZXRBdHRyaWJ1dGUoaywgdmFsKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqIEdldCBhIHByb3BlcnR5IG9yIHNldCBpdCAqL1xyXG4gICAgICAgIHByb3A6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2VzcyhrZXksIHZhbHVlLCBmdW5jdGlvbihpdGVtLCBrLCB2YWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IGl0ZW1ba10gOiAoaXRlbVtrXSA9IHZhbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3NpdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9maXJzdChmdW5jdGlvbihlbGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBsZWZ0OiBlbGVtLm9mZnNldExlZnQsIHRvcDogZWxlbS5vZmZzZXRUb3AgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjcm9sbFRvcDogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2Vzcygnc2Nyb2xsVG9wJywgdmFsdWUsIGZ1bmN0aW9uKGl0ZW0sIGssIHZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID8gaXRlbVtrXSA6IChpdGVtW2tdID0gdmFsKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIG91dGVySGVpZ2h0OiBmdW5jdGlvbihpbmNsdWRlTWFyZ2luKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9maXJzdChmdW5jdGlvbihlbGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcmdpbnMgPSBpbmNsdWRlTWFyZ2luID8gKHBhcnNlSW50KHN0eWxlLm1hcmdpblRvcCwgMTApICsgcGFyc2VJbnQoc3R5bGUubWFyZ2luQm90dG9tLCAxMCkpIDogMDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtLm9mZnNldEhlaWdodCArIG1hcmdpbnM7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRmluZCB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIHNldFxyXG4gICAgICAgICAqIHJlbGF0aXZlIHRvIGl0cyBzaWJsaW5nIGVsZW1lbnRzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGluZGV4OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0KGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlGcm9tKGVsLnBhcmVudE5vZGUuY2hpbGRyZW4pLmluZGV4T2YoZWwpXHJcbiAgICAgICAgICAgIH0sIC0xKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy8gTE9PS1VQXHJcbiAgICBXcmFwLmV4dGVuZCh7XHJcbiAgICAgICAgY2hpbGRyZW46IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkcyA9IGNoaWxkcy5jb25jYXQobWFwKGl0ZW0uY2hpbGRyZW4sIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVxyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBXcmFwLkNvbnN0cnVjdG9yKGNoaWxkcykuZmlsdGVyKHNlbGVjdG9yKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNpYmxpbmdzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNpYnMgPSBbXVxyXG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgc2licyA9IHNpYnMuY29uY2F0KGZpbHRlcihpdGVtLnBhcmVudE5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkICE9PSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBXcmFwLkNvbnN0cnVjdG9yKHNpYnMpXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiogUmV0dXJuIHRoZSBwYXJlbnQgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBjdXJyZW50IHNldCAqL1xyXG4gICAgICAgIHBhcmVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXIgPSBtYXAodGhpcy5lbGVtZW50cywgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ucGFyZW50Tm9kZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIFdyYXAuQ29uc3RydWN0b3IocGFyKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqIFJldHVybiBBTEwgcGFyZW50cyBvZiBlYWNoIGVsZW1lbnQgaW4gdGhlIGN1cnJlbnQgc2V0ICovXHJcbiAgICAgICAgcGFyZW50czogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgdmFyIHBhciA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IGl0ZW0ucGFyZW50RWxlbWVudDsgcDsgcCA9IHAucGFyZW50RWxlbWVudClcclxuICAgICAgICAgICAgICAgICAgICBwYXIucHVzaChwKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIFdyYXAuQ29uc3RydWN0b3IocGFyKS5maWx0ZXIoc2VsZWN0b3IpXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIGRlc2NlbmRhbnRzIG9mIGVhY2ggZWxlbWVudCBpbiB0aGUgc2V0LCBmaWx0ZXJlZCBieSBhIHNlbGVjdG9yXHJcbiAgICAgICAgICogU2VsZWN0b3IgY2FuJ3Qgc3RhcnQgd2l0aCBcIj5cIiAoOnNjb3BlIG5vdCBzdXBwb3J0ZWQgb24gSUUpLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZpbmQ6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IFtdXHJcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGZvdW5kLmNvbmNhdChtYXAoaXRlbS5xdWVyeVNlbGVjdG9yQWxsKCAvKic6c2NvcGUgJyArICovIHNlbGVjdG9yKSwgZnVuY3Rpb24oZml0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZml0ZW1cclxuICAgICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gV3JhcC5Db25zdHJ1Y3Rvcihmb3VuZClcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKiBmaWx0ZXIgdGhlIGFjdHVhbCBzZXQgYmFzZWQgb24gZ2l2ZW4gc2VsZWN0b3IgKi9cclxuICAgICAgICBmaWx0ZXI6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIGlmICghc2VsZWN0b3IpIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gZmlsdGVyKHRoaXMuZWxlbWVudHMsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaGVzKGl0ZW0sIHNlbGVjdG9yKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gV3JhcC5Db25zdHJ1Y3RvcihyZXMpXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiogV29ya3Mgb25seSB3aXRoIGEgc3RyaW5nIHNlbGVjdG9yICovXHJcbiAgICAgICAgaXM6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICEoZm91bmQgPSBtYXRjaGVzKGl0ZW0sIHNlbGVjdG9yKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gRUxFTUVOVFNcclxuICAgIFdyYXAuZXh0ZW5kKHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBhcHBlbmQgY3VycmVudCBzZXQgdG8gZ2l2ZW4gbm9kZVxyXG4gICAgICAgICAqIGV4cGVjdHMgYSBkb20gbm9kZSBvciBzZXRcclxuICAgICAgICAgKiBpZiBlbGVtZW50IGlzIGEgc2V0LCBwcmVwZW5kcyBvbmx5IHRoZSBmaXJzdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGFwcGVuZFRvOiBmdW5jdGlvbihlbGVtKSB7XHJcbiAgICAgICAgICAgIGVsZW0gPSBlbGVtLm5vZGVUeXBlID8gZWxlbSA6IGVsZW0uX2ZpcnN0KClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXBwZW5kIGEgZG9tTm9kZSB0byBlYWNoIGVsZW1lbnQgaW4gdGhlIHNldFxyXG4gICAgICAgICAqIGlmIGVsZW1lbnQgaXMgYSBzZXQsIGFwcGVuZCBvbmx5IHRoZSBmaXJzdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGFwcGVuZDogZnVuY3Rpb24oZWxlbSkge1xyXG4gICAgICAgICAgICBlbGVtID0gZWxlbS5ub2RlVHlwZSA/IGVsZW0gOiBlbGVtLl9maXJzdCgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChlbGVtKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluc2VydCB0aGUgY3VycmVudCBzZXQgb2YgZWxlbWVudHMgYWZ0ZXIgdGhlIGVsZW1lbnRcclxuICAgICAgICAgKiB0aGF0IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yIGluIHBhcmFtXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaW5zZXJ0QWZ0ZXI6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoaXRlbSwgdGFyZ2V0Lm5leHRTaWJsaW5nKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENsb25lcyBhbGwgZWxlbWVudCBpbiB0aGUgc2V0XHJcbiAgICAgICAgICogcmV0dXJucyBhIG5ldyBzZXQgd2l0aCB0aGUgY2xvbmVkIGVsZW1lbnRzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY2xvbmVzID0gbWFwKHRoaXMuZWxlbWVudHMsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmNsb25lTm9kZSh0cnVlKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gV3JhcC5Db25zdHJ1Y3RvcihjbG9uZXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqIFJlbW92ZSBhbGwgbm9kZSBpbiB0aGUgc2V0IGZyb20gRE9NLiAqL1xyXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5ldmVudHM7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ucGFyZW50Tm9kZSkgaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLl9zZXR1cChbXSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy8gREFUQVNFVFNcclxuICAgIFdyYXAuZXh0ZW5kKHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFeHBlY3RlZCBrZXkgaW4gY2FtZWxDYXNlIGZvcm1hdFxyXG4gICAgICAgICAqIGlmIHZhbHVlIHByb3ZpZGVkIHNhdmUgZGF0YSBpbnRvIGVsZW1lbnQgc2V0XHJcbiAgICAgICAgICogaWYgbm90LCByZXR1cm4gZGF0YSBmb3IgdGhlIGZpcnN0IGVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBkYXRhOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBoYXNKU09OID0gL14oPzpcXHtbXFx3XFxXXSpcXH18XFxbW1xcd1xcV10qXFxdKSQvLFxyXG4gICAgICAgICAgICAgICAgZGF0YUF0dHIgPSAnZGF0YS0nICsga2V5LnJlcGxhY2UoL1tBLVpdL2csICctJCYnKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0KGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsLmRhdGEgJiYgZWwuZGF0YVtrZXldKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGVsLmdldEF0dHJpYnV0ZShkYXRhQXR0cilcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09ICd0cnVlJykgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSAnZmFsc2UnKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSArZGF0YSArICcnKSByZXR1cm4gK2RhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNKU09OLnRlc3QoZGF0YSkpIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmRhdGFba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy8gRVZFTlRTXHJcbiAgICBXcmFwLmV4dGVuZCh7XHJcbiAgICAgICAgdHJpZ2dlcjogZnVuY3Rpb24odHlwZSkge1xyXG4gICAgICAgICAgICB0eXBlID0gdHlwZS5zcGxpdCgnLicpWzBdOyAvLyBpZ25vcmUgbmFtZXNwYWNlXHJcbiAgICAgICAgICAgIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XHJcbiAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudCh0eXBlLCB0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJsdXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmlnZ2VyKCdibHVyJylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvY3VzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJpZ2dlcignZm9jdXMnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGZ1bmN0aW9uKGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5ldmVudHMpIGl0ZW0uZXZlbnRzID0gbmV3IEV2ZW50SGFuZGxlcigpO1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKGV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5ldmVudHMuYmluZChldiwgY2FsbGJhY2ssIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9mZjogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5ldmVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmV2ZW50cy51bmJpbmQoZXZlbnQsIGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLmV2ZW50cztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy8gQ0xBU1NFU1xyXG4gICAgV3JhcC5leHRlbmQoe1xyXG4gICAgICAgIHRvZ2dsZUNsYXNzOiBmdW5jdGlvbihjbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsYXNzZXMoJ3RvZ2dsZScsIGNsYXNzbmFtZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhZGRDbGFzczogZnVuY3Rpb24oY2xhc3NuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGFzc2VzKCdhZGQnLCBjbGFzc25hbWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGNsYXNzbmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xhc3NlcygncmVtb3ZlJywgY2xhc3NuYW1lKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhhc0NsYXNzOiBmdW5jdGlvbihjbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsYXNzZXMoJ2NvbnRhaW5zJywgY2xhc3NuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNvbWUgYmFzaWMgZmVhdHVyZXMgaW4gdGhpcyB0ZW1wbGF0ZSByZWxpZXMgb24gQm9vdHN0cmFwXHJcbiAgICAgKiBwbHVnaW5zLCBsaWtlIENvbGxhcHNlLCBEcm9wZG93biBhbmQgVGFiLlxyXG4gICAgICogQmVsb3cgY29kZSBlbXVsYXRlcyBwbHVnaW5zIGJlaGF2aW9yIGJ5IHRvZ2dsaW5nIGNsYXNzZXNcclxuICAgICAqIGZyb20gZWxlbWVudHMgdG8gYWxsb3cgYSBtaW5pbXVtIGludGVyYWN0aW9uIHdpdGhvdXQgYW5pbWF0aW9uLlxyXG4gICAgICogLSBPbmx5IENvbGxhcHNlIGlzIHJlcXVpcmVkIHdoaWNoIGlzIHVzZWQgYnkgdGhlIHNpZGViYXIuXHJcbiAgICAgKiAtIFRhYiBhbmQgRHJvcGRvd24gYXJlIG9wdGlvbmFsIGZlYXR1cmVzLlxyXG4gICAgICovXHJcblxyXG4gICAgLy8gRW11bGF0ZSBqUXVlcnkgc3ltYm9sIHRvIHNpbXBsaWZ5IHVzYWdlXHJcbiAgICB2YXIgJCA9IFdyYXAuQ29uc3RydWN0b3I7XHJcblxyXG4gICAgLy8gRW11bGF0ZXMgQ29sbGFwc2UgcGx1Z2luXHJcbiAgICBXcmFwLmV4dGVuZCh7XHJcbiAgICAgICAgY29sbGFwc2U6IGZ1bmN0aW9uKGFjdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGksIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciAkaXRlbSA9ICQoaXRlbSkudHJpZ2dlcihhY3Rpb24gKyAnLmJzLmNvbGxhcHNlJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAndG9nZ2xlJykgJGl0ZW0uY29sbGFwc2UoJGl0ZW0uaGFzQ2xhc3MoJ3Nob3cnKSA/ICdoaWRlJyA6ICdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBlbHNlICRpdGVtW2FjdGlvbiA9PT0gJ3Nob3cnID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8vIEluaXRpYWxpemF0aW9uc1xyXG4gICAgJCgnW2RhdGEtdG9nZ2xlXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgIGlmICh0YXJnZXQuaXMoJ2EnKSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHN3aXRjaCAodGFyZ2V0LmRhdGEoJ3RvZ2dsZScpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NvbGxhcHNlJzpcclxuICAgICAgICAgICAgICAgICQodGFyZ2V0LmF0dHIoJ2hyZWYnKSkuY29sbGFwc2UoJ3RvZ2dsZScpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3RhYic6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFiUGFuZSA9ICQodGFyZ2V0LmF0dHIoJ2hyZWYnKSk7XHJcbiAgICAgICAgICAgICAgICB0YWJQYW5lLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZSBzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICB0YWJQYW5lLmFkZENsYXNzKCdhY3RpdmUgc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Ryb3Bkb3duJzpcclxuICAgICAgICAgICAgICAgIHZhciBkZCA9IHRhcmdldC5wYXJlbnQoKS50b2dnbGVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgZGQuZmluZCgnLmRyb3Bkb3duLW1lbnUnKS50b2dnbGVDbGFzcygnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICByZXR1cm4gV3JhcC5Db25zdHJ1Y3RvclxyXG5cclxufSkpOyIsIi8qIVxyXG4gKlxyXG4gKiBBbmdsZSAtIEJvb3RzdHJhcCBBZG1pbiBUZW1wbGF0ZVxyXG4gKlxyXG4gKiBWZXJzaW9uOiBAdmVyc2lvbkBcclxuICogQXV0aG9yOiBAYXV0aG9yQFxyXG4gKiBXZWJzaXRlOiBAdXJsQFxyXG4gKiBMaWNlbnNlOiBAbGljZW5zZUBcclxuICpcclxuICovXHJcblxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vIFJlc3RvcmUgYm9keSBjbGFzc2VzXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICB2YXIgJGJvZHkgPSAkKCdib2R5Jyk7XHJcbiAgICAgICAgbmV3IFN0YXRlVG9nZ2xlcigpLnJlc3RvcmVTdGF0ZSgkYm9keSk7XHJcblxyXG4gICAgICAgIC8vIGVuYWJsZSBzZXR0aW5ncyB0b2dnbGUgYWZ0ZXIgcmVzdG9yZVxyXG4gICAgICAgICQoJyNjaGstZml4ZWQnKS5wcm9wKCdjaGVja2VkJywgJGJvZHkuaGFzQ2xhc3MoJ2xheW91dC1maXhlZCcpKTtcclxuICAgICAgICAkKCcjY2hrLWNvbGxhcHNlZCcpLnByb3AoJ2NoZWNrZWQnLCAkYm9keS5oYXNDbGFzcygnYXNpZGUtY29sbGFwc2VkJykpO1xyXG4gICAgICAgICQoJyNjaGstY29sbGFwc2VkLXRleHQnKS5wcm9wKCdjaGVja2VkJywgJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLWNvbGxhcHNlZC10ZXh0JykpO1xyXG4gICAgICAgICQoJyNjaGstYm94ZWQnKS5wcm9wKCdjaGVja2VkJywgJGJvZHkuaGFzQ2xhc3MoJ2xheW91dC1ib3hlZCcpKTtcclxuICAgICAgICAkKCcjY2hrLWZsb2F0JykucHJvcCgnY2hlY2tlZCcsICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1mbG9hdCcpKTtcclxuICAgICAgICAkKCcjY2hrLWhvdmVyJykucHJvcCgnY2hlY2tlZCcsICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1ob3ZlcicpKTtcclxuXHJcbiAgICAgICAgLy8gV2hlbiByZWFkeSBkaXNwbGF5IHRoZSBvZmZzaWRlYmFyXHJcbiAgICAgICAgJCgnLm9mZnNpZGViYXIuZC1ub25lJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpO1xyXG5cclxuICAgIH0pOyAvLyBkb2MgcmVhZHlcclxuXHJcbn0pKCk7IiwiLy8gS25vYiBjaGFydFxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdEtub2IpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRLbm9iKCkge1xyXG5cclxuICAgICAgICBpZiAoISQuZm4ua25vYikgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIga25vYkxvYWRlck9wdGlvbnMxID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogJzUwJScsIC8vIHJlc3BvbnNpdmVcclxuICAgICAgICAgICAgZGlzcGxheUlucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICBmZ0NvbG9yOiBBUFBfQ09MT1JTWydpbmZvJ11cclxuICAgICAgICB9O1xyXG4gICAgICAgICQoJyNrbm9iLWNoYXJ0MScpLmtub2Ioa25vYkxvYWRlck9wdGlvbnMxKTtcclxuXHJcbiAgICAgICAgdmFyIGtub2JMb2FkZXJPcHRpb25zMiA9IHtcclxuICAgICAgICAgICAgd2lkdGg6ICc1MCUnLCAvLyByZXNwb25zaXZlXHJcbiAgICAgICAgICAgIGRpc3BsYXlJbnB1dDogdHJ1ZSxcclxuICAgICAgICAgICAgZmdDb2xvcjogQVBQX0NPTE9SU1sncHVycGxlJ10sXHJcbiAgICAgICAgICAgIHJlYWRPbmx5OiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcja25vYi1jaGFydDInKS5rbm9iKGtub2JMb2FkZXJPcHRpb25zMik7XHJcblxyXG4gICAgICAgIHZhciBrbm9iTG9hZGVyT3B0aW9uczMgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiAnNTAlJywgLy8gcmVzcG9uc2l2ZVxyXG4gICAgICAgICAgICBkaXNwbGF5SW5wdXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGZnQ29sb3I6IEFQUF9DT0xPUlNbJ2luZm8nXSxcclxuICAgICAgICAgICAgYmdDb2xvcjogQVBQX0NPTE9SU1snZ3JheSddLFxyXG4gICAgICAgICAgICBhbmdsZU9mZnNldDogLTEyNSxcclxuICAgICAgICAgICAgYW5nbGVBcmM6IDI1MFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCgnI2tub2ItY2hhcnQzJykua25vYihrbm9iTG9hZGVyT3B0aW9uczMpO1xyXG5cclxuICAgICAgICB2YXIga25vYkxvYWRlck9wdGlvbnM0ID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogJzUwJScsIC8vIHJlc3BvbnNpdmVcclxuICAgICAgICAgICAgZGlzcGxheUlucHV0OiB0cnVlLFxyXG4gICAgICAgICAgICBmZ0NvbG9yOiBBUFBfQ09MT1JTWydwaW5rJ10sXHJcbiAgICAgICAgICAgIGRpc3BsYXlQcmV2aW91czogdHJ1ZSxcclxuICAgICAgICAgICAgdGhpY2tuZXNzOiAwLjEsXHJcbiAgICAgICAgICAgIGxpbmVDYXA6ICdyb3VuZCdcclxuICAgICAgICB9O1xyXG4gICAgICAgICQoJyNrbm9iLWNoYXJ0NCcpLmtub2Ioa25vYkxvYWRlck9wdGlvbnM0KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIENoYXJ0IEpTXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0Q2hhcnRKUyk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdENoYXJ0SlMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgQ2hhcnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIHJhbmRvbSB2YWx1ZXMgZm9yIGRlbW9cclxuICAgICAgICB2YXIgckZhY3RvciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBMaW5lIGNoYXJ0XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgdmFyIGxpbmVEYXRhID0ge1xyXG4gICAgICAgICAgICBsYWJlbHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5J10sXHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdNeSBGaXJzdCBkYXRhc2V0JyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMTE0LDEwMiwxODYsMC4yKScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJ3JnYmEoMTE0LDEwMiwxODYsMSknLFxyXG4gICAgICAgICAgICAgICAgcG9pbnRCb3JkZXJDb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW3JGYWN0b3IoKSwgckZhY3RvcigpLCByRmFjdG9yKCksIHJGYWN0b3IoKSwgckZhY3RvcigpLCByRmFjdG9yKCksIHJGYWN0b3IoKV1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdNeSBTZWNvbmQgZGF0YXNldCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDM1LDE4MywyMjksMC4yKScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJ3JnYmEoMzUsMTgzLDIyOSwxKScsXHJcbiAgICAgICAgICAgICAgICBwb2ludEJvcmRlckNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbckZhY3RvcigpLCByRmFjdG9yKCksIHJGYWN0b3IoKSwgckZhY3RvcigpLCByRmFjdG9yKCksIHJGYWN0b3IoKSwgckZhY3RvcigpXVxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBsaW5lT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgbGluZWN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFydGpzLWxpbmVjaGFydCcpLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdmFyIGxpbmVDaGFydCA9IG5ldyBDaGFydChsaW5lY3R4LCB7XHJcbiAgICAgICAgICAgIGRhdGE6IGxpbmVEYXRhLFxyXG4gICAgICAgICAgICB0eXBlOiAnbGluZScsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IGxpbmVPcHRpb25zXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEJhciBjaGFydFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIHZhciBiYXJEYXRhID0ge1xyXG4gICAgICAgICAgICBsYWJlbHM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5J10sXHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzIzYjdlNScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJyMyM2I3ZTUnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW3JGYWN0b3IoKSwgckZhY3RvcigpLCByRmFjdG9yKCksIHJGYWN0b3IoKSwgckZhY3RvcigpLCByRmFjdG9yKCksIHJGYWN0b3IoKV1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzVkOWNlYycsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogJyM1ZDljZWMnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW3JGYWN0b3IoKSwgckZhY3RvcigpLCByRmFjdG9yKCksIHJGYWN0b3IoKSwgckZhY3RvcigpLCByRmFjdG9yKCksIHJGYWN0b3IoKV1cclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgYmFyT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgYmFyY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJ0anMtYmFyY2hhcnQnKS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHZhciBiYXJDaGFydCA9IG5ldyBDaGFydChiYXJjdHgsIHtcclxuICAgICAgICAgICAgZGF0YTogYmFyRGF0YSxcclxuICAgICAgICAgICAgdHlwZTogJ2JhcicsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IGJhck9wdGlvbnNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gIERvdWdobnV0IGNoYXJ0XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgdmFyIGRvdWdobnV0RGF0YSA9IHtcclxuICAgICAgICAgICAgbGFiZWxzOiBbXHJcbiAgICAgICAgICAgICAgICAnUHVycGxlJyxcclxuICAgICAgICAgICAgICAgICdZZWxsb3cnLFxyXG4gICAgICAgICAgICAgICAgJ0JsdWUnXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogWzMwMCwgNTAsIDEwMF0sXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFtcclxuICAgICAgICAgICAgICAgICAgICAnIzcyNjZiYScsXHJcbiAgICAgICAgICAgICAgICAgICAgJyNmYWQ3MzInLFxyXG4gICAgICAgICAgICAgICAgICAgICcjMjNiN2U1J1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGhvdmVyQmFja2dyb3VuZENvbG9yOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgJyM3MjY2YmEnLFxyXG4gICAgICAgICAgICAgICAgICAgICcjZmFkNzMyJyxcclxuICAgICAgICAgICAgICAgICAgICAnIzIzYjdlNSdcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZG91Z2hudXRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBkb3VnaG51dGN0eCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFydGpzLWRvdWdobnV0Y2hhcnQnKS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHZhciBkb3VnaG51dENoYXJ0ID0gbmV3IENoYXJ0KGRvdWdobnV0Y3R4LCB7XHJcbiAgICAgICAgICAgIGRhdGE6IGRvdWdobnV0RGF0YSxcclxuICAgICAgICAgICAgdHlwZTogJ2RvdWdobnV0JyxcclxuICAgICAgICAgICAgb3B0aW9uczogZG91Z2hudXRPcHRpb25zXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFBpZSBjaGFydFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIHZhciBwaWVEYXRhID0ge1xyXG4gICAgICAgICAgICBsYWJlbHM6IFtcclxuICAgICAgICAgICAgICAgICdQdXJwbGUnLFxyXG4gICAgICAgICAgICAgICAgJ1llbGxvdycsXHJcbiAgICAgICAgICAgICAgICAnQmx1ZSdcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgZGF0YXNldHM6IFt7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbMzAwLCA1MCwgMTAwXSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogW1xyXG4gICAgICAgICAgICAgICAgICAgICcjNzI2NmJhJyxcclxuICAgICAgICAgICAgICAgICAgICAnI2ZhZDczMicsXHJcbiAgICAgICAgICAgICAgICAgICAgJyMyM2I3ZTUnXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgaG92ZXJCYWNrZ3JvdW5kQ29sb3I6IFtcclxuICAgICAgICAgICAgICAgICAgICAnIzcyNjZiYScsXHJcbiAgICAgICAgICAgICAgICAgICAgJyNmYWQ3MzInLFxyXG4gICAgICAgICAgICAgICAgICAgICcjMjNiN2U1J1xyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBwaWVPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBwaWVjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcnRqcy1waWVjaGFydCcpLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdmFyIHBpZUNoYXJ0ID0gbmV3IENoYXJ0KHBpZWN0eCwge1xyXG4gICAgICAgICAgICBkYXRhOiBwaWVEYXRhLFxyXG4gICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgb3B0aW9uczogcGllT3B0aW9uc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBQb2xhciBjaGFydFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIHZhciBwb2xhckRhdGEgPSB7XHJcbiAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW1xyXG4gICAgICAgICAgICAgICAgICAgIDExLFxyXG4gICAgICAgICAgICAgICAgICAgIDE2LFxyXG4gICAgICAgICAgICAgICAgICAgIDcsXHJcbiAgICAgICAgICAgICAgICAgICAgM1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogW1xyXG4gICAgICAgICAgICAgICAgICAgICcjZjUzMmU1JyxcclxuICAgICAgICAgICAgICAgICAgICAnIzcyNjZiYScsXHJcbiAgICAgICAgICAgICAgICAgICAgJyNmNTMyZTUnLFxyXG4gICAgICAgICAgICAgICAgICAgICcjNzI2NmJhJ1xyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTXkgZGF0YXNldCcgLy8gZm9yIGxlZ2VuZFxyXG4gICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgbGFiZWxzOiBbXHJcbiAgICAgICAgICAgICAgICAnTGFiZWwgMScsXHJcbiAgICAgICAgICAgICAgICAnTGFiZWwgMicsXHJcbiAgICAgICAgICAgICAgICAnTGFiZWwgMycsXHJcbiAgICAgICAgICAgICAgICAnTGFiZWwgNCdcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBwb2xhck9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHBvbGFyY3R4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYXJ0anMtcG9sYXJjaGFydCcpLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdmFyIHBvbGFyQ2hhcnQgPSBuZXcgQ2hhcnQocG9sYXJjdHgsIHtcclxuICAgICAgICAgICAgZGF0YTogcG9sYXJEYXRhLFxyXG4gICAgICAgICAgICB0eXBlOiAncG9sYXJBcmVhJyxcclxuICAgICAgICAgICAgb3B0aW9uczogcG9sYXJPcHRpb25zXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFJhZGFyIGNoYXJ0XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgdmFyIHJhZGFyRGF0YSA9IHtcclxuICAgICAgICAgICAgbGFiZWxzOiBbJ0VhdGluZycsICdEcmlua2luZycsICdTbGVlcGluZycsICdEZXNpZ25pbmcnLCAnQ29kaW5nJywgJ0N5Y2xpbmcnLCAnUnVubmluZyddLFxyXG4gICAgICAgICAgICBkYXRhc2V0czogW3tcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnTXkgRmlyc3QgZGF0YXNldCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDExNCwxMDIsMTg2LDAuMiknLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICdyZ2JhKDExNCwxMDIsMTg2LDEpJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFs2NSwgNTksIDkwLCA4MSwgNTYsIDU1LCA0MF1cclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdNeSBTZWNvbmQgZGF0YXNldCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDE1MSwxODcsMjA1LDAuMiknLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICdyZ2JhKDE1MSwxODcsMjA1LDEpJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFsyOCwgNDgsIDQwLCAxOSwgOTYsIDI3LCAxMDBdXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHJhZGFyT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgcmFkYXJjdHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhcnRqcy1yYWRhcmNoYXJ0JykuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB2YXIgcmFkYXJDaGFydCA9IG5ldyBDaGFydChyYWRhcmN0eCwge1xyXG4gICAgICAgICAgICBkYXRhOiByYWRhckRhdGEsXHJcbiAgICAgICAgICAgIHR5cGU6ICdyYWRhcicsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHJhZGFyT3B0aW9uc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gQ2hhcnRpc3RcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRDaGFydGlzdHMpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRDaGFydGlzdHMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgQ2hhcnRpc3QgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIEJhciBiaXBvbGFyXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICB2YXIgZGF0YTEgPSB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWydXMScsICdXMicsICdXMycsICdXNCcsICdXNScsICdXNicsICdXNycsICdXOCcsICdXOScsICdXMTAnXSxcclxuICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICBbMSwgMiwgNCwgOCwgNiwgLTIsIC0xLCAtNCwgLTYsIC0yXVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG9wdGlvbnMxID0ge1xyXG4gICAgICAgICAgICBoaWdoOiAxMCxcclxuICAgICAgICAgICAgbG93OiAtMTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjgwLFxyXG4gICAgICAgICAgICBheGlzWDoge1xyXG4gICAgICAgICAgICAgICAgbGFiZWxJbnRlcnBvbGF0aW9uRm5jOiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXggJSAyID09PSAwID8gdmFsdWUgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbmV3IENoYXJ0aXN0LkJhcignI2N0LWJhcjEnLCBkYXRhMSwgb3B0aW9uczEpO1xyXG5cclxuICAgICAgICAvLyBCYXIgSG9yaXpvbnRhbFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgbmV3IENoYXJ0aXN0LkJhcignI2N0LWJhcjInLCB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWydNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5JywgJ1N1bmRheSddLFxyXG4gICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIFs1LCA0LCAzLCA3LCA1LCAxMCwgM10sXHJcbiAgICAgICAgICAgICAgICBbMywgMiwgOSwgNSwgNCwgNiwgNF1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgc2VyaWVzQmFyRGlzdGFuY2U6IDEwLFxyXG4gICAgICAgICAgICByZXZlcnNlRGF0YTogdHJ1ZSxcclxuICAgICAgICAgICAgaG9yaXpvbnRhbEJhcnM6IHRydWUsXHJcbiAgICAgICAgICAgIGhlaWdodDogMjgwLFxyXG4gICAgICAgICAgICBheGlzWToge1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiA3MFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIExpbmVcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIG5ldyBDaGFydGlzdC5MaW5lKCcjY3QtbGluZTEnLCB7XHJcbiAgICAgICAgICAgIGxhYmVsczogWydNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5J10sXHJcbiAgICAgICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAgICAgICAgWzEyLCA5LCA3LCA4LCA1XSxcclxuICAgICAgICAgICAgICAgIFsyLCAxLCAzLjUsIDcsIDNdLFxyXG4gICAgICAgICAgICAgICAgWzEsIDMsIDQsIDUsIDZdXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGZ1bGxXaWR0aDogdHJ1ZSxcclxuICAgICAgICAgICAgaGVpZ2h0OiAyODAsXHJcbiAgICAgICAgICAgIGNoYXJ0UGFkZGluZzoge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDQwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIFNWRyBBbmltYXRpb25cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICB2YXIgY2hhcnQxID0gbmV3IENoYXJ0aXN0LkxpbmUoJyNjdC1saW5lMycsIHtcclxuICAgICAgICAgICAgbGFiZWxzOiBbJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0J10sXHJcbiAgICAgICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAgICAgICAgWzEsIDUsIDIsIDUsIDQsIDNdLFxyXG4gICAgICAgICAgICAgICAgWzIsIDMsIDQsIDgsIDEsIDJdLFxyXG4gICAgICAgICAgICAgICAgWzUsIDQsIDMsIDIsIDEsIDAuNV1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgbG93OiAwLFxyXG4gICAgICAgICAgICBzaG93QXJlYTogdHJ1ZSxcclxuICAgICAgICAgICAgc2hvd1BvaW50OiBmYWxzZSxcclxuICAgICAgICAgICAgZnVsbFdpZHRoOiB0cnVlLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDMwMFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjaGFydDEub24oJ2RyYXcnLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgPT09ICdsaW5lJyB8fCBkYXRhLnR5cGUgPT09ICdhcmVhJykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5lbGVtZW50LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW46IDIwMDAgKiBkYXRhLmluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXI6IDIwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IGRhdGEucGF0aC5jbG9uZSgpLnNjYWxlKDEsIDApLnRyYW5zbGF0ZSgwLCBkYXRhLmNoYXJ0UmVjdC5oZWlnaHQoKSkuc3RyaW5naWZ5KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBkYXRhLnBhdGguY2xvbmUoKS5zdHJpbmdpZnkoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiBDaGFydGlzdC5TdmcuRWFzaW5nLmVhc2VPdXRRdWludFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyBTbGltIGFuaW1hdGlvblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuICAgICAgICB2YXIgY2hhcnQgPSBuZXcgQ2hhcnRpc3QuTGluZSgnI2N0LWxpbmUyJywge1xyXG4gICAgICAgICAgICBsYWJlbHM6IFsnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknLCAnMTAnLCAnMTEnLCAnMTInXSxcclxuICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICBbMTIsIDksIDcsIDgsIDUsIDQsIDYsIDIsIDMsIDMsIDQsIDZdLFxyXG4gICAgICAgICAgICAgICAgWzQsIDUsIDMsIDcsIDMsIDUsIDUsIDMsIDQsIDQsIDUsIDVdLFxyXG4gICAgICAgICAgICAgICAgWzUsIDMsIDQsIDUsIDYsIDMsIDMsIDQsIDUsIDYsIDMsIDRdLFxyXG4gICAgICAgICAgICAgICAgWzMsIDQsIDUsIDYsIDcsIDYsIDQsIDUsIDYsIDcsIDYsIDNdXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGxvdzogMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiAzMDBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gTGV0J3MgcHV0IGEgc2VxdWVuY2UgbnVtYmVyIGFzaWRlIHNvIHdlIGNhbiB1c2UgaXQgaW4gdGhlIGV2ZW50IGNhbGxiYWNrc1xyXG4gICAgICAgIHZhciBzZXEgPSAwLFxyXG4gICAgICAgICAgICBkZWxheXMgPSA4MCxcclxuICAgICAgICAgICAgZHVyYXRpb25zID0gNTAwO1xyXG5cclxuICAgICAgICAvLyBPbmNlIHRoZSBjaGFydCBpcyBmdWxseSBjcmVhdGVkIHdlIHJlc2V0IHRoZSBzZXF1ZW5jZVxyXG4gICAgICAgIGNoYXJ0Lm9uKCdjcmVhdGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNlcSA9IDA7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIE9uIGVhY2ggZHJhd24gZWxlbWVudCBieSBDaGFydGlzdCB3ZSB1c2UgdGhlIENoYXJ0aXN0LlN2ZyBBUEkgdG8gdHJpZ2dlciBTTUlMIGFuaW1hdGlvbnNcclxuICAgICAgICBjaGFydC5vbignZHJhdycsIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgc2VxKys7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YS50eXBlID09PSAnbGluZScpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBkcmF3biBlbGVtZW50IGlzIGEgbGluZSB3ZSBkbyBhIHNpbXBsZSBvcGFjaXR5IGZhZGUgaW4uIFRoaXMgY291bGQgYWxzbyBiZSBhY2hpZXZlZCB1c2luZyBDU1MzIGFuaW1hdGlvbnMuXHJcbiAgICAgICAgICAgICAgICBkYXRhLmVsZW1lbnQuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZGVsYXkgd2hlbiB3ZSBsaWtlIHRvIHN0YXJ0IHRoZSBhbmltYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW46IHNlcSAqIGRlbGF5cyArIDEwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIER1cmF0aW9uIG9mIHRoZSBhbmltYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyOiBkdXJhdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSB2YWx1ZSB3aGVyZSB0aGUgYW5pbWF0aW9uIHNob3VsZCBzdGFydFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgdmFsdWUgd2hlcmUgaXQgc2hvdWxkIGVuZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEudHlwZSA9PT0gJ2xhYmVsJyAmJiBkYXRhLmF4aXMgPT09ICd4Jykge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5lbGVtZW50LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW46IHNlcSAqIGRlbGF5cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyOiBkdXJhdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IGRhdGEueSArIDEwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG86IGRhdGEueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgY2FuIHNwZWNpZnkgYW4gZWFzaW5nIGZ1bmN0aW9uIGZyb20gQ2hhcnRpc3QuU3ZnLkVhc2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlID09PSAnbGFiZWwnICYmIGRhdGEuYXhpcyA9PT0gJ3knKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmVsZW1lbnQuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgeDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWdpbjogc2VxICogZGVsYXlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXI6IGR1cmF0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogZGF0YS54IC0gMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogZGF0YS54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlID09PSAncG9pbnQnKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmVsZW1lbnQuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgeDE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW46IHNlcSAqIGRlbGF5cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyOiBkdXJhdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IGRhdGEueCAtIDEwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0bzogZGF0YS54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB4Mjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWdpbjogc2VxICogZGVsYXlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXI6IGR1cmF0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogZGF0YS54IC0gMTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBkYXRhLngsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZzogJ2Vhc2VPdXRRdWFydCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmVnaW46IHNlcSAqIGRlbGF5cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyOiBkdXJhdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb206IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlID09PSAnZ3JpZCcpIHtcclxuICAgICAgICAgICAgICAgIC8vIFVzaW5nIGRhdGEuYXhpcyB3ZSBnZXQgeCBvciB5IHdoaWNoIHdlIGNhbiB1c2UgdG8gY29uc3RydWN0IG91ciBhbmltYXRpb24gZGVmaW5pdGlvbiBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zMUFuaW1hdGlvbiA9IHtcclxuICAgICAgICAgICAgICAgICAgICBiZWdpbjogc2VxICogZGVsYXlzLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cjogZHVyYXRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyb206IGRhdGFbZGF0YS5heGlzLnVuaXRzLnBvcyArICcxJ10gLSAzMCxcclxuICAgICAgICAgICAgICAgICAgICB0bzogZGF0YVtkYXRhLmF4aXMudW5pdHMucG9zICsgJzEnXSxcclxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwb3MyQW5pbWF0aW9uID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luOiBzZXEgKiBkZWxheXMsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyOiBkdXJhdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogZGF0YVtkYXRhLmF4aXMudW5pdHMucG9zICsgJzInXSAtIDEwMCxcclxuICAgICAgICAgICAgICAgICAgICB0bzogZGF0YVtkYXRhLmF4aXMudW5pdHMucG9zICsgJzInXSxcclxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBhbmltYXRpb25zID0ge307XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb25zW2RhdGEuYXhpcy51bml0cy5wb3MgKyAnMSddID0gcG9zMUFuaW1hdGlvbjtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbnNbZGF0YS5heGlzLnVuaXRzLnBvcyArICcyJ10gPSBwb3MyQW5pbWF0aW9uO1xyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uc1snb3BhY2l0eSddID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luOiBzZXEgKiBkZWxheXMsXHJcbiAgICAgICAgICAgICAgICAgICAgZHVyOiBkdXJhdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogMCxcclxuICAgICAgICAgICAgICAgICAgICB0bzogMSxcclxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdlYXNlT3V0UXVhcnQnXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGRhdGEuZWxlbWVudC5hbmltYXRlKGFuaW1hdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEZvciB0aGUgc2FrZSBvZiB0aGUgZXhhbXBsZSB3ZSB1cGRhdGUgdGhlIGNoYXJ0IGV2ZXJ5IHRpbWUgaXQncyBjcmVhdGVkIHdpdGggYSBkZWxheSBvZiAxMCBzZWNvbmRzXHJcbiAgICAgICAgY2hhcnQub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5fX2V4YW1wbGVBbmltYXRlVGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHdpbmRvdy5fX2V4YW1wbGVBbmltYXRlVGltZW91dCk7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuX19leGFtcGxlQW5pbWF0ZVRpbWVvdXQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpbmRvdy5fX2V4YW1wbGVBbmltYXRlVGltZW91dCA9IHNldFRpbWVvdXQoY2hhcnQudXBkYXRlLmJpbmQoY2hhcnQpLCAxMjAwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBFYXN5cGllIGNoYXJ0IExvYWRlclxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdEVhc3lQaWVDaGFydCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEVhc3lQaWVDaGFydCgpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmZuLmVhc3lQaWVDaGFydCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBVc2FnZSB2aWEgZGF0YSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgLy8gPGRpdiBjbGFzcz1cImVhc3lwaWUtY2hhcnRcIiBkYXRhLWVhc3lwaWVjaGFydCBkYXRhLXBlcmNlbnQ9XCJYXCIgZGF0YS1vcHRpb25OYW1lPVwidmFsdWVcIj48L2Rpdj5cclxuICAgICAgICAkKCdbZGF0YS1lYXN5cGllY2hhcnRdJykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyICRlbGVtID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSAkZWxlbS5kYXRhKCk7XHJcbiAgICAgICAgICAgICRlbGVtLmVhc3lQaWVDaGFydChvcHRpb25zIHx8IHt9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcHJvZ3JhbW1hdGljIHVzYWdlXHJcbiAgICAgICAgdmFyIHBpZU9wdGlvbnMxID0ge1xyXG4gICAgICAgICAgICBhbmltYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogODAwLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiYXJDb2xvcjogQVBQX0NPTE9SU1snc3VjY2VzcyddLFxyXG4gICAgICAgICAgICB0cmFja0NvbG9yOiBmYWxzZSxcclxuICAgICAgICAgICAgc2NhbGVDb2xvcjogZmFsc2UsXHJcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMTAsXHJcbiAgICAgICAgICAgIGxpbmVDYXA6ICdjaXJjbGUnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcjZWFzeXBpZTEnKS5lYXN5UGllQ2hhcnQocGllT3B0aW9uczEpO1xyXG5cclxuICAgICAgICB2YXIgcGllT3B0aW9uczIgPSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGU6IHtcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA4MDAsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJhckNvbG9yOiBBUFBfQ09MT1JTWyd3YXJuaW5nJ10sXHJcbiAgICAgICAgICAgIHRyYWNrQ29sb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY2FsZUNvbG9yOiBmYWxzZSxcclxuICAgICAgICAgICAgbGluZVdpZHRoOiA0LFxyXG4gICAgICAgICAgICBsaW5lQ2FwOiAnY2lyY2xlJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCgnI2Vhc3lwaWUyJykuZWFzeVBpZUNoYXJ0KHBpZU9wdGlvbnMyKTtcclxuXHJcbiAgICAgICAgdmFyIHBpZU9wdGlvbnMzID0ge1xyXG4gICAgICAgICAgICBhbmltYXRlOiB7XHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogODAwLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiYXJDb2xvcjogQVBQX0NPTE9SU1snZGFuZ2VyJ10sXHJcbiAgICAgICAgICAgIHRyYWNrQ29sb3I6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY2FsZUNvbG9yOiBBUFBfQ09MT1JTWydncmF5J10sXHJcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMTUsXHJcbiAgICAgICAgICAgIGxpbmVDYXA6ICdjaXJjbGUnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKCcjZWFzeXBpZTMnKS5lYXN5UGllQ2hhcnQocGllT3B0aW9uczMpO1xyXG5cclxuICAgICAgICB2YXIgcGllT3B0aW9uczQgPSB7XHJcbiAgICAgICAgICAgIGFuaW1hdGU6IHtcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA4MDAsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJhckNvbG9yOiBBUFBfQ09MT1JTWydkYW5nZXInXSxcclxuICAgICAgICAgICAgdHJhY2tDb2xvcjogQVBQX0NPTE9SU1sneWVsbG93J10sXHJcbiAgICAgICAgICAgIHNjYWxlQ29sb3I6IEFQUF9DT0xPUlNbJ2dyYXktZGFyayddLFxyXG4gICAgICAgICAgICBsaW5lV2lkdGg6IDE1LFxyXG4gICAgICAgICAgICBsaW5lQ2FwOiAnY2lyY2xlJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCgnI2Vhc3lwaWU0JykuZWFzeVBpZUNoYXJ0KHBpZU9wdGlvbnM0KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIENIQVJUIFNQTElORVxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0RmxvdFNwbGluZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEZsb3RTcGxpbmUoKSB7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gW3tcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlVuaXF1ZXNcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM3NjgyOTRcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IFtcclxuICAgICAgICAgICAgICAgIFtcIk1hclwiLCA3MF0sXHJcbiAgICAgICAgICAgICAgICBbXCJBcHJcIiwgODVdLFxyXG4gICAgICAgICAgICAgICAgW1wiTWF5XCIsIDU5XSxcclxuICAgICAgICAgICAgICAgIFtcIkp1blwiLCA5M10sXHJcbiAgICAgICAgICAgICAgICBbXCJKdWxcIiwgNjZdLFxyXG4gICAgICAgICAgICAgICAgW1wiQXVnXCIsIDg2XSxcclxuICAgICAgICAgICAgICAgIFtcIlNlcFwiLCA2MF1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlJlY3VycmVudFwiLFxyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiIzFmOTJmZVwiLFxyXG4gICAgICAgICAgICBcImRhdGFcIjogW1xyXG4gICAgICAgICAgICAgICAgW1wiTWFyXCIsIDIxXSxcclxuICAgICAgICAgICAgICAgIFtcIkFwclwiLCAxMl0sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXlcIiwgMjddLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVuXCIsIDI0XSxcclxuICAgICAgICAgICAgICAgIFtcIkp1bFwiLCAxNl0sXHJcbiAgICAgICAgICAgICAgICBbXCJBdWdcIiwgMzldLFxyXG4gICAgICAgICAgICAgICAgW1wiU2VwXCIsIDE1XVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfV07XHJcblxyXG4gICAgICAgIHZhciBkYXRhdjIgPSBbe1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiSG91cnNcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMyM2I3ZTVcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IFtcclxuICAgICAgICAgICAgICAgIFtcIkphblwiLCA3MF0sXHJcbiAgICAgICAgICAgICAgICBbXCJGZWJcIiwgMjBdLFxyXG4gICAgICAgICAgICAgICAgW1wiTWFyXCIsIDcwXSxcclxuICAgICAgICAgICAgICAgIFtcIkFwclwiLCA4NV0sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXlcIiwgNTldLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVuXCIsIDkzXSxcclxuICAgICAgICAgICAgICAgIFtcIkp1bFwiLCA2Nl0sXHJcbiAgICAgICAgICAgICAgICBbXCJBdWdcIiwgODZdLFxyXG4gICAgICAgICAgICAgICAgW1wiU2VwXCIsIDYwXSxcclxuICAgICAgICAgICAgICAgIFtcIk9jdFwiLCA2MF0sXHJcbiAgICAgICAgICAgICAgICBbXCJOb3ZcIiwgMTJdLFxyXG4gICAgICAgICAgICAgICAgW1wiRGVjXCIsIDUwXVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiQ29tbWl0c1wiLFxyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiIzcyNjZiYVwiLFxyXG4gICAgICAgICAgICBcImRhdGFcIjogW1xyXG4gICAgICAgICAgICAgICAgW1wiSmFuXCIsIDIwXSxcclxuICAgICAgICAgICAgICAgIFtcIkZlYlwiLCA3MF0sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXJcIiwgMzBdLFxyXG4gICAgICAgICAgICAgICAgW1wiQXByXCIsIDUwXSxcclxuICAgICAgICAgICAgICAgIFtcIk1heVwiLCA4NV0sXHJcbiAgICAgICAgICAgICAgICBbXCJKdW5cIiwgNDNdLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVsXCIsIDk2XSxcclxuICAgICAgICAgICAgICAgIFtcIkF1Z1wiLCAzNl0sXHJcbiAgICAgICAgICAgICAgICBbXCJTZXBcIiwgODBdLFxyXG4gICAgICAgICAgICAgICAgW1wiT2N0XCIsIDEwXSxcclxuICAgICAgICAgICAgICAgIFtcIk5vdlwiLCA3Ml0sXHJcbiAgICAgICAgICAgICAgICBbXCJEZWNcIiwgMzFdXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGF2MyA9IFt7XHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogXCJIb21lXCIsXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjMWJhM2NkXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiBbXHJcbiAgICAgICAgICAgICAgICBbXCIxXCIsIDM4XSxcclxuICAgICAgICAgICAgICAgIFtcIjJcIiwgNDBdLFxyXG4gICAgICAgICAgICAgICAgW1wiM1wiLCA0Ml0sXHJcbiAgICAgICAgICAgICAgICBbXCI0XCIsIDQ4XSxcclxuICAgICAgICAgICAgICAgIFtcIjVcIiwgNTBdLFxyXG4gICAgICAgICAgICAgICAgW1wiNlwiLCA3MF0sXHJcbiAgICAgICAgICAgICAgICBbXCI3XCIsIDE0NV0sXHJcbiAgICAgICAgICAgICAgICBbXCI4XCIsIDcwXSxcclxuICAgICAgICAgICAgICAgIFtcIjlcIiwgNTldLFxyXG4gICAgICAgICAgICAgICAgW1wiMTBcIiwgNDhdLFxyXG4gICAgICAgICAgICAgICAgW1wiMTFcIiwgMzhdLFxyXG4gICAgICAgICAgICAgICAgW1wiMTJcIiwgMjldLFxyXG4gICAgICAgICAgICAgICAgW1wiMTNcIiwgMzBdLFxyXG4gICAgICAgICAgICAgICAgW1wiMTRcIiwgMjJdLFxyXG4gICAgICAgICAgICAgICAgW1wiMTVcIiwgMjhdXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogXCJPdmVyYWxsXCIsXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjM2EzZjUxXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiBbXHJcbiAgICAgICAgICAgICAgICBbXCIxXCIsIDE2XSxcclxuICAgICAgICAgICAgICAgIFtcIjJcIiwgMThdLFxyXG4gICAgICAgICAgICAgICAgW1wiM1wiLCAxN10sXHJcbiAgICAgICAgICAgICAgICBbXCI0XCIsIDE2XSxcclxuICAgICAgICAgICAgICAgIFtcIjVcIiwgMzBdLFxyXG4gICAgICAgICAgICAgICAgW1wiNlwiLCAxMTBdLFxyXG4gICAgICAgICAgICAgICAgW1wiN1wiLCAxOV0sXHJcbiAgICAgICAgICAgICAgICBbXCI4XCIsIDE4XSxcclxuICAgICAgICAgICAgICAgIFtcIjlcIiwgMTEwXSxcclxuICAgICAgICAgICAgICAgIFtcIjEwXCIsIDE5XSxcclxuICAgICAgICAgICAgICAgIFtcIjExXCIsIDE2XSxcclxuICAgICAgICAgICAgICAgIFtcIjEyXCIsIDEwXSxcclxuICAgICAgICAgICAgICAgIFtcIjEzXCIsIDIwXSxcclxuICAgICAgICAgICAgICAgIFtcIjE0XCIsIDEwXSxcclxuICAgICAgICAgICAgICAgIFtcIjE1XCIsIDIwXVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfV07XHJcblxyXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBzZXJpZXM6IHtcclxuICAgICAgICAgICAgICAgIGxpbmVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwb2ludHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1czogNFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNwbGluZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb246IDAuNCxcclxuICAgICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogMC41XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2VlZScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMSxcclxuICAgICAgICAgICAgICAgIGhvdmVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmY2ZjZmMnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHRydWUsXHJcbiAgICAgICAgICAgIHRvb2x0aXBPcHRzOiB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbihsYWJlbCwgeCwgeSkgeyByZXR1cm4geCArICcgOiAnICsgeTsgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4YXhpczoge1xyXG4gICAgICAgICAgICAgICAgdGlja0NvbG9yOiAnI2ZjZmNmYycsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAnY2F0ZWdvcmllcydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWF4aXM6IHtcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTUwLCAvLyBvcHRpb25hbDogdXNlIGl0IGZvciBhIGNsZWFyIHJlcHJlc2V0YXRpb25cclxuICAgICAgICAgICAgICAgIHRpY2tDb2xvcjogJyNlZWUnLFxyXG4gICAgICAgICAgICAgICAgLy9wb3NpdGlvbjogJ3JpZ2h0JyBvciAnbGVmdCcsXHJcbiAgICAgICAgICAgICAgICB0aWNrRm9ybWF0dGVyOiBmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHYgLyogKyAnIHZpc2l0b3JzJyovIDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2hhZG93U2l6ZTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjaGFydCA9ICQoJy5jaGFydC1zcGxpbmUnKTtcclxuICAgICAgICBpZiAoY2hhcnQubGVuZ3RoKVxyXG4gICAgICAgICAgICAkLnBsb3QoY2hhcnQsIGRhdGEsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgY2hhcnR2MiA9ICQoJy5jaGFydC1zcGxpbmV2MicpO1xyXG4gICAgICAgIGlmIChjaGFydHYyLmxlbmd0aClcclxuICAgICAgICAgICAgJC5wbG90KGNoYXJ0djIsIGRhdGF2Miwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBjaGFydHYzID0gJCgnLmNoYXJ0LXNwbGluZXYzJyk7XHJcbiAgICAgICAgaWYgKGNoYXJ0djMubGVuZ3RoKVxyXG4gICAgICAgICAgICAkLnBsb3QoY2hhcnR2MywgZGF0YXYzLCBvcHRpb25zKTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG5cclxuLy8gQ0hBUlQgQVJFQVxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG5cclxuICAgICQoaW5pdEZsb3RBcmVhKVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRGbG90QXJlYSgpIHtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSBbe1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiVW5pcXVlc1wiLFxyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiI2FhZDg3NFwiLFxyXG4gICAgICAgICAgICBcImRhdGFcIjogW1xyXG4gICAgICAgICAgICAgICAgW1wiTWFyXCIsIDUwXSxcclxuICAgICAgICAgICAgICAgIFtcIkFwclwiLCA4NF0sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXlcIiwgNTJdLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVuXCIsIDg4XSxcclxuICAgICAgICAgICAgICAgIFtcIkp1bFwiLCA2OV0sXHJcbiAgICAgICAgICAgICAgICBbXCJBdWdcIiwgOTJdLFxyXG4gICAgICAgICAgICAgICAgW1wiU2VwXCIsIDU4XVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiUmVjdXJyZW50XCIsXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjN2RjN2RmXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiBbXHJcbiAgICAgICAgICAgICAgICBbXCJNYXJcIiwgMTNdLFxyXG4gICAgICAgICAgICAgICAgW1wiQXByXCIsIDQ0XSxcclxuICAgICAgICAgICAgICAgIFtcIk1heVwiLCA0NF0sXHJcbiAgICAgICAgICAgICAgICBbXCJKdW5cIiwgMjddLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVsXCIsIDM4XSxcclxuICAgICAgICAgICAgICAgIFtcIkF1Z1wiLCAxMV0sXHJcbiAgICAgICAgICAgICAgICBbXCJTZXBcIiwgMzldXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XTtcclxuXHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgbGluZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGw6IDAuOFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBvaW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2VlZScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMSxcclxuICAgICAgICAgICAgICAgIGhvdmVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmY2ZjZmMnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHRydWUsXHJcbiAgICAgICAgICAgIHRvb2x0aXBPcHRzOiB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbihsYWJlbCwgeCwgeSkgeyByZXR1cm4geCArICcgOiAnICsgeTsgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4YXhpczoge1xyXG4gICAgICAgICAgICAgICAgdGlja0NvbG9yOiAnI2ZjZmNmYycsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAnY2F0ZWdvcmllcydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWF4aXM6IHtcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIHRpY2tDb2xvcjogJyNlZWUnLFxyXG4gICAgICAgICAgICAgICAgLy8gcG9zaXRpb246ICdyaWdodCcgb3IgJ2xlZnQnXHJcbiAgICAgICAgICAgICAgICB0aWNrRm9ybWF0dGVyOiBmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHYgKyAnIHZpc2l0b3JzJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2hhZG93U2l6ZTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjaGFydCA9ICQoJy5jaGFydC1hcmVhJyk7XHJcbiAgICAgICAgaWYgKGNoYXJ0Lmxlbmd0aClcclxuICAgICAgICAgICAgJC5wbG90KGNoYXJ0LCBkYXRhLCBvcHRpb25zKTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG5cclxuLy8gQ0hBUlQgQkFSXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4gICAgJChpbml0RmxvdEJhcilcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0RmxvdEJhcigpIHtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSBbe1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiU2FsZXNcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM5Y2QxNTlcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IFtcclxuICAgICAgICAgICAgICAgIFtcIkphblwiLCAyN10sXHJcbiAgICAgICAgICAgICAgICBbXCJGZWJcIiwgODJdLFxyXG4gICAgICAgICAgICAgICAgW1wiTWFyXCIsIDU2XSxcclxuICAgICAgICAgICAgICAgIFtcIkFwclwiLCAxNF0sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXlcIiwgMjhdLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVuXCIsIDc3XSxcclxuICAgICAgICAgICAgICAgIFtcIkp1bFwiLCAyM10sXHJcbiAgICAgICAgICAgICAgICBbXCJBdWdcIiwgNDldLFxyXG4gICAgICAgICAgICAgICAgW1wiU2VwXCIsIDgxXSxcclxuICAgICAgICAgICAgICAgIFtcIk9jdFwiLCAyMF1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1dO1xyXG5cclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgc2VyaWVzOiB7XHJcbiAgICAgICAgICAgICAgICBiYXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcclxuICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhcldpZHRoOiAwLjYsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogMC45XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2VlZScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMSxcclxuICAgICAgICAgICAgICAgIGhvdmVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmY2ZjZmMnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHRydWUsXHJcbiAgICAgICAgICAgIHRvb2x0aXBPcHRzOiB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbihsYWJlbCwgeCwgeSkgeyByZXR1cm4geCArICcgOiAnICsgeTsgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4YXhpczoge1xyXG4gICAgICAgICAgICAgICAgdGlja0NvbG9yOiAnI2ZjZmNmYycsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAnY2F0ZWdvcmllcydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWF4aXM6IHtcclxuICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uOiAncmlnaHQnIG9yICdsZWZ0J1xyXG4gICAgICAgICAgICAgICAgdGlja0NvbG9yOiAnI2VlZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2hhZG93U2l6ZTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjaGFydCA9ICQoJy5jaGFydC1iYXInKTtcclxuICAgICAgICBpZiAoY2hhcnQubGVuZ3RoKVxyXG4gICAgICAgICAgICAkLnBsb3QoY2hhcnQsIGRhdGEsIG9wdGlvbnMpO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblxyXG5cclxuLy8gQ0hBUlQgQkFSIFNUQUNLRURcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbiAgICAkKGluaXRGbG90QmFyU3RhY2tlZCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEZsb3RCYXJTdGFja2VkKCkge1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IFt7XHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogXCJUd2VldHNcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM1MWJmZjJcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IFtcclxuICAgICAgICAgICAgICAgIFtcIkphblwiLCA1Nl0sXHJcbiAgICAgICAgICAgICAgICBbXCJGZWJcIiwgODFdLFxyXG4gICAgICAgICAgICAgICAgW1wiTWFyXCIsIDk3XSxcclxuICAgICAgICAgICAgICAgIFtcIkFwclwiLCA0NF0sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXlcIiwgMjRdLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVuXCIsIDg1XSxcclxuICAgICAgICAgICAgICAgIFtcIkp1bFwiLCA5NF0sXHJcbiAgICAgICAgICAgICAgICBbXCJBdWdcIiwgNzhdLFxyXG4gICAgICAgICAgICAgICAgW1wiU2VwXCIsIDUyXSxcclxuICAgICAgICAgICAgICAgIFtcIk9jdFwiLCAxN10sXHJcbiAgICAgICAgICAgICAgICBbXCJOb3ZcIiwgOTBdLFxyXG4gICAgICAgICAgICAgICAgW1wiRGVjXCIsIDYyXVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiTGlrZXNcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM0YThlZjFcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IFtcclxuICAgICAgICAgICAgICAgIFtcIkphblwiLCA2OV0sXHJcbiAgICAgICAgICAgICAgICBbXCJGZWJcIiwgMTM1XSxcclxuICAgICAgICAgICAgICAgIFtcIk1hclwiLCAxNF0sXHJcbiAgICAgICAgICAgICAgICBbXCJBcHJcIiwgMTAwXSxcclxuICAgICAgICAgICAgICAgIFtcIk1heVwiLCAxMDBdLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVuXCIsIDYyXSxcclxuICAgICAgICAgICAgICAgIFtcIkp1bFwiLCAxMTVdLFxyXG4gICAgICAgICAgICAgICAgW1wiQXVnXCIsIDIyXSxcclxuICAgICAgICAgICAgICAgIFtcIlNlcFwiLCAxMDRdLFxyXG4gICAgICAgICAgICAgICAgW1wiT2N0XCIsIDEzMl0sXHJcbiAgICAgICAgICAgICAgICBbXCJOb3ZcIiwgNzJdLFxyXG4gICAgICAgICAgICAgICAgW1wiRGVjXCIsIDYxXVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiKzFcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNmMDY5M2FcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IFtcclxuICAgICAgICAgICAgICAgIFtcIkphblwiLCAyOV0sXHJcbiAgICAgICAgICAgICAgICBbXCJGZWJcIiwgMzZdLFxyXG4gICAgICAgICAgICAgICAgW1wiTWFyXCIsIDQ3XSxcclxuICAgICAgICAgICAgICAgIFtcIkFwclwiLCAyMV0sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXlcIiwgNV0sXHJcbiAgICAgICAgICAgICAgICBbXCJKdW5cIiwgNDldLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVsXCIsIDM3XSxcclxuICAgICAgICAgICAgICAgIFtcIkF1Z1wiLCA0NF0sXHJcbiAgICAgICAgICAgICAgICBbXCJTZXBcIiwgMjhdLFxyXG4gICAgICAgICAgICAgICAgW1wiT2N0XCIsIDldLFxyXG4gICAgICAgICAgICAgICAgW1wiTm92XCIsIDEyXSxcclxuICAgICAgICAgICAgICAgIFtcIkRlY1wiLCAzNV1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1dO1xyXG5cclxuICAgICAgICB2YXIgZGF0YXYyID0gW3tcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlBlbmRpbmdcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM5Mjg5Y2FcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IFtcclxuICAgICAgICAgICAgICAgIFtcIlBqMVwiLCA4Nl0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajJcIiwgMTM2XSxcclxuICAgICAgICAgICAgICAgIFtcIlBqM1wiLCA5N10sXHJcbiAgICAgICAgICAgICAgICBbXCJQajRcIiwgMTEwXSxcclxuICAgICAgICAgICAgICAgIFtcIlBqNVwiLCA2Ml0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajZcIiwgODVdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGo3XCIsIDExNV0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajhcIiwgNzhdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGo5XCIsIDEwNF0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajEwXCIsIDgyXSxcclxuICAgICAgICAgICAgICAgIFtcIlBqMTFcIiwgOTddLFxyXG4gICAgICAgICAgICAgICAgW1wiUGoxMlwiLCAxMTBdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGoxM1wiLCA2Ml1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBcIkFzc2lnbmVkXCIsXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjNzI2NmJhXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiBbXHJcbiAgICAgICAgICAgICAgICBbXCJQajFcIiwgNDldLFxyXG4gICAgICAgICAgICAgICAgW1wiUGoyXCIsIDgxXSxcclxuICAgICAgICAgICAgICAgIFtcIlBqM1wiLCA0N10sXHJcbiAgICAgICAgICAgICAgICBbXCJQajRcIiwgNDRdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGo1XCIsIDEwMF0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajZcIiwgNDldLFxyXG4gICAgICAgICAgICAgICAgW1wiUGo3XCIsIDk0XSxcclxuICAgICAgICAgICAgICAgIFtcIlBqOFwiLCA0NF0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajlcIiwgNTJdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGoxMFwiLCAxN10sXHJcbiAgICAgICAgICAgICAgICBbXCJQajExXCIsIDQ3XSxcclxuICAgICAgICAgICAgICAgIFtcIlBqMTJcIiwgNDRdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGoxM1wiLCAxMDBdXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogXCJDb21wbGV0ZWRcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM1NjRhYTNcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IFtcclxuICAgICAgICAgICAgICAgIFtcIlBqMVwiLCAyOV0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajJcIiwgNTZdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGozXCIsIDE0XSxcclxuICAgICAgICAgICAgICAgIFtcIlBqNFwiLCAyMV0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajVcIiwgNV0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajZcIiwgMjRdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGo3XCIsIDM3XSxcclxuICAgICAgICAgICAgICAgIFtcIlBqOFwiLCAyMl0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajlcIiwgMjhdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGoxMFwiLCA5XSxcclxuICAgICAgICAgICAgICAgIFtcIlBqMTFcIiwgMTRdLFxyXG4gICAgICAgICAgICAgICAgW1wiUGoxMlwiLCAyMV0sXHJcbiAgICAgICAgICAgICAgICBbXCJQajEzXCIsIDVdXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9XTtcclxuXHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgc3RhY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBiYXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMCxcclxuICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhcldpZHRoOiAwLjYsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogMC45XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2VlZScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMSxcclxuICAgICAgICAgICAgICAgIGhvdmVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmY2ZjZmMnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHRydWUsXHJcbiAgICAgICAgICAgIHRvb2x0aXBPcHRzOiB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbihsYWJlbCwgeCwgeSkgeyByZXR1cm4geCArICcgOiAnICsgeTsgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4YXhpczoge1xyXG4gICAgICAgICAgICAgICAgdGlja0NvbG9yOiAnI2ZjZmNmYycsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAnY2F0ZWdvcmllcydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWF4aXM6IHtcclxuICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uOiAncmlnaHQnIG9yICdsZWZ0J1xyXG4gICAgICAgICAgICAgICAgdGlja0NvbG9yOiAnI2VlZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2hhZG93U2l6ZTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjaGFydCA9ICQoJy5jaGFydC1iYXItc3RhY2tlZCcpO1xyXG4gICAgICAgIGlmIChjaGFydC5sZW5ndGgpXHJcbiAgICAgICAgICAgICQucGxvdChjaGFydCwgZGF0YSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBjaGFydHYyID0gJCgnLmNoYXJ0LWJhci1zdGFja2VkdjInKTtcclxuICAgICAgICBpZiAoY2hhcnR2Mi5sZW5ndGgpXHJcbiAgICAgICAgICAgICQucGxvdChjaGFydHYyLCBkYXRhdjIsIG9wdGlvbnMpO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblxyXG4vLyBDSEFSVCBET05VVFxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG5cclxuICAgICQoaW5pdEZsb3REb251dCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEZsb3REb251dCgpIHtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSBbe1xyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiIzM5QzU1OFwiLFxyXG4gICAgICAgICAgICBcImRhdGFcIjogNjAsXHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogXCJDb2ZmZWVcIlxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiMwMGI0ZmZcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IDkwLFxyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiQ1NTXCJcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjRkZCRTQxXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiA1MCxcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBcIkxFU1NcIlxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNmZjNlNDNcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IDgwLFxyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiSmFkZVwiXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiIzkzN2ZjN1wiLFxyXG4gICAgICAgICAgICBcImRhdGFcIjogMTE2LFxyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiQW5ndWxhckpTXCJcclxuICAgICAgICB9XTtcclxuXHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgcGllOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpbm5lclJhZGl1czogMC41IC8vIFRoaXMgbWFrZXMgdGhlIGRvbnV0IHNoYXBlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgY2hhcnQgPSAkKCcuY2hhcnQtZG9udXQnKTtcclxuICAgICAgICBpZiAoY2hhcnQubGVuZ3RoKVxyXG4gICAgICAgICAgICAkLnBsb3QoY2hhcnQsIGRhdGEsIG9wdGlvbnMpO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblxyXG4vLyBDSEFSVCBMSU5FXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcblxyXG4gICAgJChpbml0RmxvdExpbmUpXHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEZsb3RMaW5lKCkge1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IFt7XHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogXCJDb21wbGV0ZVwiLFxyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiIzVhYjFlZlwiLFxyXG4gICAgICAgICAgICBcImRhdGFcIjogW1xyXG4gICAgICAgICAgICAgICAgW1wiSmFuXCIsIDE4OF0sXHJcbiAgICAgICAgICAgICAgICBbXCJGZWJcIiwgMTgzXSxcclxuICAgICAgICAgICAgICAgIFtcIk1hclwiLCAxODVdLFxyXG4gICAgICAgICAgICAgICAgW1wiQXByXCIsIDE5OV0sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXlcIiwgMTkwXSxcclxuICAgICAgICAgICAgICAgIFtcIkp1blwiLCAxOTRdLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVsXCIsIDE5NF0sXHJcbiAgICAgICAgICAgICAgICBbXCJBdWdcIiwgMTg0XSxcclxuICAgICAgICAgICAgICAgIFtcIlNlcFwiLCA3NF1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBcIkluIFByb2dyZXNzXCIsXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZjU5OTRlXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiBbXHJcbiAgICAgICAgICAgICAgICBbXCJKYW5cIiwgMTUzXSxcclxuICAgICAgICAgICAgICAgIFtcIkZlYlwiLCAxMTZdLFxyXG4gICAgICAgICAgICAgICAgW1wiTWFyXCIsIDEzNl0sXHJcbiAgICAgICAgICAgICAgICBbXCJBcHJcIiwgMTE5XSxcclxuICAgICAgICAgICAgICAgIFtcIk1heVwiLCAxNDhdLFxyXG4gICAgICAgICAgICAgICAgW1wiSnVuXCIsIDEzM10sXHJcbiAgICAgICAgICAgICAgICBbXCJKdWxcIiwgMTE4XSxcclxuICAgICAgICAgICAgICAgIFtcIkF1Z1wiLCAxNjFdLFxyXG4gICAgICAgICAgICAgICAgW1wiU2VwXCIsIDU5XVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiQ2FuY2VsbGVkXCIsXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZDg3YTgwXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiBbXHJcbiAgICAgICAgICAgICAgICBbXCJKYW5cIiwgMTExXSxcclxuICAgICAgICAgICAgICAgIFtcIkZlYlwiLCA5N10sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXJcIiwgOTNdLFxyXG4gICAgICAgICAgICAgICAgW1wiQXByXCIsIDExMF0sXHJcbiAgICAgICAgICAgICAgICBbXCJNYXlcIiwgMTAyXSxcclxuICAgICAgICAgICAgICAgIFtcIkp1blwiLCA5M10sXHJcbiAgICAgICAgICAgICAgICBbXCJKdWxcIiwgOTJdLFxyXG4gICAgICAgICAgICAgICAgW1wiQXVnXCIsIDkyXSxcclxuICAgICAgICAgICAgICAgIFtcIlNlcFwiLCA0NF1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1dO1xyXG5cclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgc2VyaWVzOiB7XHJcbiAgICAgICAgICAgICAgICBsaW5lczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogMC4wMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBvaW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA0XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2VlZScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMSxcclxuICAgICAgICAgICAgICAgIGhvdmVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmY2ZjZmMnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHRydWUsXHJcbiAgICAgICAgICAgIHRvb2x0aXBPcHRzOiB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBmdW5jdGlvbihsYWJlbCwgeCwgeSkgeyByZXR1cm4geCArICcgOiAnICsgeTsgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4YXhpczoge1xyXG4gICAgICAgICAgICAgICAgdGlja0NvbG9yOiAnI2VlZScsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiAnY2F0ZWdvcmllcydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeWF4aXM6IHtcclxuICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uOiAncmlnaHQnIG9yICdsZWZ0J1xyXG4gICAgICAgICAgICAgICAgdGlja0NvbG9yOiAnI2VlZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2hhZG93U2l6ZTogMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBjaGFydCA9ICQoJy5jaGFydC1saW5lJyk7XHJcbiAgICAgICAgaWYgKGNoYXJ0Lmxlbmd0aClcclxuICAgICAgICAgICAgJC5wbG90KGNoYXJ0LCBkYXRhLCBvcHRpb25zKTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpO1xyXG5cclxuXHJcbi8vIENIQVJUIFBJRVxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG5cclxuICAgICQoaW5pdEZsb3RQaWUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRGbG90UGllKCkge1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IFt7XHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogXCJqUXVlcnlcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiM0YWNhYjRcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IDMwXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiQ1NTXCIsXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZmZlYTg4XCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiA0MFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgXCJsYWJlbFwiOiBcIkxFU1NcIixcclxuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNmZjgxNTNcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IDkwXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBcImxhYmVsXCI6IFwiU0FTU1wiLFxyXG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiIzg3OGJiNlwiLFxyXG4gICAgICAgICAgICBcImRhdGFcIjogNzVcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIFwibGFiZWxcIjogXCJKYWRlXCIsXHJcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjYjJkNzY3XCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiAxMjBcclxuICAgICAgICB9XTtcclxuXHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgcGllOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpbm5lclJhZGl1czogMCxcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDAuOCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihsYWJlbCwgc2VyaWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJmbG90LXBpZS1sYWJlbFwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbGFiZWwgKyAnIDogJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChzZXJpZXMucGVyY2VudCkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICclPC9kaXY+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC44LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMjIyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGNoYXJ0ID0gJCgnLmNoYXJ0LXBpZScpO1xyXG4gICAgICAgIGlmIChjaGFydC5sZW5ndGgpXHJcbiAgICAgICAgICAgICQucGxvdChjaGFydCwgZGF0YSwgb3B0aW9ucyk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBNb3JyaXNcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRNb3JyaXMpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRNb3JyaXMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgTW9ycmlzID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgY2hhcnRkYXRhID0gW1xyXG4gICAgICAgICAgICB7IHk6IFwiMjAwNlwiLCBhOiAxMDAsIGI6IDkwIH0sXHJcbiAgICAgICAgICAgIHsgeTogXCIyMDA3XCIsIGE6IDc1LCBiOiA2NSB9LFxyXG4gICAgICAgICAgICB7IHk6IFwiMjAwOFwiLCBhOiA1MCwgYjogNDAgfSxcclxuICAgICAgICAgICAgeyB5OiBcIjIwMDlcIiwgYTogNzUsIGI6IDY1IH0sXHJcbiAgICAgICAgICAgIHsgeTogXCIyMDEwXCIsIGE6IDUwLCBiOiA0MCB9LFxyXG4gICAgICAgICAgICB7IHk6IFwiMjAxMVwiLCBhOiA3NSwgYjogNjUgfSxcclxuICAgICAgICAgICAgeyB5OiBcIjIwMTJcIiwgYTogMTAwLCBiOiA5MCB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdmFyIGRvbnV0ZGF0YSA9IFtcclxuICAgICAgICAgICAgeyBsYWJlbDogXCJEb3dubG9hZCBTYWxlc1wiLCB2YWx1ZTogMTIgfSxcclxuICAgICAgICAgICAgeyBsYWJlbDogXCJJbi1TdG9yZSBTYWxlc1wiLCB2YWx1ZTogMzAgfSxcclxuICAgICAgICAgICAgeyBsYWJlbDogXCJNYWlsLU9yZGVyIFNhbGVzXCIsIHZhbHVlOiAyMCB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gTGluZSBDaGFydFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIG5ldyBNb3JyaXMuTGluZSh7XHJcbiAgICAgICAgICAgIGVsZW1lbnQ6ICdtb3JyaXMtbGluZScsXHJcbiAgICAgICAgICAgIGRhdGE6IGNoYXJ0ZGF0YSxcclxuICAgICAgICAgICAgeGtleTogJ3knLFxyXG4gICAgICAgICAgICB5a2V5czogW1wiYVwiLCBcImJcIl0sXHJcbiAgICAgICAgICAgIGxhYmVsczogW1wiU2VyaWUgQVwiLCBcIlNlcmllIEJcIl0sXHJcbiAgICAgICAgICAgIGxpbmVDb2xvcnM6IFtcIiMzMUMwQkVcIiwgXCIjN2E5MmEzXCJdLFxyXG4gICAgICAgICAgICByZXNpemU6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gRG9udXQgQ2hhcnRcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIG5ldyBNb3JyaXMuRG9udXQoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnbW9ycmlzLWRvbnV0JyxcclxuICAgICAgICAgICAgZGF0YTogZG9udXRkYXRhLFxyXG4gICAgICAgICAgICBjb2xvcnM6IFsnI2YwNTA1MCcsICcjZmFkNzMyJywgJyNmZjkwMmInXSxcclxuICAgICAgICAgICAgcmVzaXplOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEJhciBDaGFydFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgbmV3IE1vcnJpcy5CYXIoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnbW9ycmlzLWJhcicsXHJcbiAgICAgICAgICAgIGRhdGE6IGNoYXJ0ZGF0YSxcclxuICAgICAgICAgICAgeGtleTogJ3knLFxyXG4gICAgICAgICAgICB5a2V5czogW1wiYVwiLCBcImJcIl0sXHJcbiAgICAgICAgICAgIGxhYmVsczogW1wiU2VyaWVzIEFcIiwgXCJTZXJpZXMgQlwiXSxcclxuICAgICAgICAgICAgeExhYmVsTWFyZ2luOiAyLFxyXG4gICAgICAgICAgICBiYXJDb2xvcnM6IFsnIzIzYjdlNScsICcjZjA1MDUwJ10sXHJcbiAgICAgICAgICAgIHJlc2l6ZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBcmVhIENoYXJ0XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICBuZXcgTW9ycmlzLkFyZWEoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiAnbW9ycmlzLWFyZWEnLFxyXG4gICAgICAgICAgICBkYXRhOiBjaGFydGRhdGEsXHJcbiAgICAgICAgICAgIHhrZXk6ICd5JyxcclxuICAgICAgICAgICAgeWtleXM6IFtcImFcIiwgXCJiXCJdLFxyXG4gICAgICAgICAgICBsYWJlbHM6IFtcIlNlcmllIEFcIiwgXCJTZXJpZSBCXCJdLFxyXG4gICAgICAgICAgICBsaW5lQ29sb3JzOiBbJyM3MjY2YmEnLCAnIzIzYjdlNSddLFxyXG4gICAgICAgICAgICByZXNpemU6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIFJpY2tzaGF3XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0TW9ycmlzKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0TW9ycmlzKCkge1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIFJpY2tzaGF3ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgc2VyaWVzRGF0YSA9IFtcclxuICAgICAgICAgICAgW10sXHJcbiAgICAgICAgICAgIFtdLFxyXG4gICAgICAgICAgICBbXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgdmFyIHJhbmRvbSA9IG5ldyBSaWNrc2hhdy5GaXh0dXJlcy5SYW5kb21EYXRhKDE1MCk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTUwOyBpKyspIHtcclxuICAgICAgICAgICAgcmFuZG9tLmFkZERhdGEoc2VyaWVzRGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2VyaWVzMSA9IFt7XHJcbiAgICAgICAgICAgIGNvbG9yOiBcIiNjMDUwMjBcIixcclxuICAgICAgICAgICAgZGF0YTogc2VyaWVzRGF0YVswXSxcclxuICAgICAgICAgICAgbmFtZTogJ05ldyBZb3JrJ1xyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgY29sb3I6IFwiIzMwYzAyMFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBzZXJpZXNEYXRhWzFdLFxyXG4gICAgICAgICAgICBuYW1lOiAnTG9uZG9uJ1xyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgY29sb3I6IFwiIzYwNjBjMFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBzZXJpZXNEYXRhWzJdLFxyXG4gICAgICAgICAgICBuYW1lOiAnVG9reW8nXHJcbiAgICAgICAgfV07XHJcblxyXG4gICAgICAgIHZhciBncmFwaDEgPSBuZXcgUmlja3NoYXcuR3JhcGgoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JpY2tzaGF3MVwiKSxcclxuICAgICAgICAgICAgc2VyaWVzOiBzZXJpZXMxLFxyXG4gICAgICAgICAgICByZW5kZXJlcjogJ2FyZWEnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdyYXBoMS5yZW5kZXIoKTtcclxuXHJcblxyXG4gICAgICAgIC8vIEdyYXBoIDJcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICB2YXIgZ3JhcGgyID0gbmV3IFJpY2tzaGF3LkdyYXBoKHtcclxuICAgICAgICAgICAgZWxlbWVudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyaWNrc2hhdzJcIiksXHJcbiAgICAgICAgICAgIHJlbmRlcmVyOiAnYXJlYScsXHJcbiAgICAgICAgICAgIHN0cm9rZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2VyaWVzOiBbe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW3sgeDogMCwgeTogNDAgfSwgeyB4OiAxLCB5OiA0OSB9LCB7IHg6IDIsIHk6IDM4IH0sIHsgeDogMywgeTogMzAgfSwgeyB4OiA0LCB5OiAzMiB9XSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnI2YwNTA1MCdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW3sgeDogMCwgeTogNDAgfSwgeyB4OiAxLCB5OiA0OSB9LCB7IHg6IDIsIHk6IDM4IH0sIHsgeDogMywgeTogMzAgfSwgeyB4OiA0LCB5OiAzMiB9XSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZhZDczMidcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ3JhcGgyLnJlbmRlcigpO1xyXG5cclxuICAgICAgICAvLyBHcmFwaCAzXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4gICAgICAgIHZhciBncmFwaDMgPSBuZXcgUmlja3NoYXcuR3JhcGgoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JpY2tzaGF3M1wiKSxcclxuICAgICAgICAgICAgcmVuZGVyZXI6ICdsaW5lJyxcclxuICAgICAgICAgICAgc2VyaWVzOiBbe1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW3sgeDogMCwgeTogNDAgfSwgeyB4OiAxLCB5OiA0OSB9LCB7IHg6IDIsIHk6IDM4IH0sIHsgeDogMywgeTogMzAgfSwgeyB4OiA0LCB5OiAzMiB9XSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzcyNjZiYSdcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgZGF0YTogW3sgeDogMCwgeTogMjAgfSwgeyB4OiAxLCB5OiAyNCB9LCB7IHg6IDIsIHk6IDE5IH0sIHsgeDogMywgeTogMTUgfSwgeyB4OiA0LCB5OiAxNiB9XSxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzIzYjdlNSdcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuICAgICAgICBncmFwaDMucmVuZGVyKCk7XHJcblxyXG5cclxuICAgICAgICAvLyBHcmFwaCA0XHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4gICAgICAgIHZhciBncmFwaDQgPSBuZXcgUmlja3NoYXcuR3JhcGgoe1xyXG4gICAgICAgICAgICBlbGVtZW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JpY2tzaGF3NFwiKSxcclxuICAgICAgICAgICAgcmVuZGVyZXI6ICdiYXInLFxyXG4gICAgICAgICAgICBzZXJpZXM6IFt7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbeyB4OiAwLCB5OiA0MCB9LCB7IHg6IDEsIHk6IDQ5IH0sIHsgeDogMiwgeTogMzggfSwgeyB4OiAzLCB5OiAzMCB9LCB7IHg6IDQsIHk6IDMyIH1dLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjZmFkNzMyJ1xyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbeyB4OiAwLCB5OiAyMCB9LCB7IHg6IDEsIHk6IDI0IH0sIHsgeDogMiwgeTogMTkgfSwgeyB4OiAzLCB5OiAxNSB9LCB7IHg6IDQsIHk6IDE2IH1dLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjZmY5MDJiJ1xyXG5cclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9KTtcclxuICAgICAgICBncmFwaDQucmVuZGVyKCk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBTUEFSS0xJTkVcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRTcGFya2xpbmUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRTcGFya2xpbmUoKSB7XHJcblxyXG4gICAgICAgICQoJ1tkYXRhLXNwYXJrbGluZV0nKS5lYWNoKGluaXRTcGFya0xpbmUpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0U3BhcmtMaW5lKCkge1xyXG4gICAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9ICRlbGVtZW50LmRhdGEoKSxcclxuICAgICAgICAgICAgICAgIHZhbHVlcyA9IG9wdGlvbnMudmFsdWVzICYmIG9wdGlvbnMudmFsdWVzLnNwbGl0KCcsJyk7XHJcblxyXG4gICAgICAgICAgICBvcHRpb25zLnR5cGUgPSBvcHRpb25zLnR5cGUgfHwgJ2Jhcic7IC8vIGRlZmF1bHQgY2hhcnQgaXMgYmFyXHJcbiAgICAgICAgICAgIG9wdGlvbnMuZGlzYWJsZUhpZGRlbkNoZWNrID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICRlbGVtZW50LnNwYXJrbGluZSh2YWx1ZXMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucmVzaXplKSB7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LnNwYXJrbGluZSh2YWx1ZXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIFN0YXJ0IEJvb3RzdHJhcCBKU1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdEJvb3RzdHJhcCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEJvb3RzdHJhcCgpIHtcclxuXHJcbiAgICAgICAgLy8gbmVjZXNzYXJ5IGNoZWNrIGF0IGxlYXN0IHRpbCBCUyBkb2Vzbid0IHJlcXVpcmUgalF1ZXJ5XHJcbiAgICAgICAgaWYgKCEkLmZuIHx8ICEkLmZuLnRvb2x0aXAgfHwgISQuZm4ucG9wb3ZlcikgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBQT1BPVkVSXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwicG9wb3ZlclwiXScpLnBvcG92ZXIoKTtcclxuXHJcbiAgICAgICAgLy8gVE9PTFRJUFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKHtcclxuICAgICAgICAgICAgY29udGFpbmVyOiAnYm9keSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gRFJPUERPV04gSU5QVVRTXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAkKCcuZHJvcGRvd24gaW5wdXQnKS5vbignY2xpY2sgZm9jdXMnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIE1vZHVsZTogY2FyZC10b29sc1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdENhcmREaXNtaXNzKTtcclxuICAgICQoaW5pdENhcmRDb2xsYXBzZSk7XHJcbiAgICAkKGluaXRDYXJkUmVmcmVzaCk7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGZpbmQgdGhlIGNsb3Nlc3RcclxuICAgICAqIGFzY2VuZGluZyAuY2FyZCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldENhcmRQYXJlbnQoaXRlbSkge1xyXG4gICAgICAgIHZhciBlbCA9IGl0ZW0ucGFyZW50RWxlbWVudDtcclxuICAgICAgICB3aGlsZSAoZWwgJiYgIWVsLmNsYXNzTGlzdC5jb250YWlucygnY2FyZCcpKVxyXG4gICAgICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnRcclxuICAgICAgICByZXR1cm4gZWxcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIHRvIHRyaWdnZXIgY3VzdG9tIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHRyaWdnZXJFdmVudCh0eXBlLCBpdGVtLCBkYXRhKSB7XHJcbiAgICAgICAgdmFyIGV2O1xyXG4gICAgICAgIGlmICh0eXBlb2YgQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgZXYgPSBuZXcgQ3VzdG9tRXZlbnQodHlwZSwgeyBkZXRhaWw6IGRhdGEgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcclxuICAgICAgICAgICAgZXYuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIHRydWUsIGZhbHNlLCBkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXRlbS5kaXNwYXRjaEV2ZW50KGV2KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc21pc3MgY2FyZHNcclxuICAgICAqIFtkYXRhLXRvb2w9XCJjYXJkLWRpc21pc3NcIl1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5pdENhcmREaXNtaXNzKCkge1xyXG4gICAgICAgIHZhciBjYXJkdG9vbFNlbGVjdG9yID0gJ1tkYXRhLXRvb2w9XCJjYXJkLWRpc21pc3NcIl0nXHJcblxyXG4gICAgICAgIHZhciBjYXJkTGlzdCA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjYXJkdG9vbFNlbGVjdG9yKSlcclxuXHJcbiAgICAgICAgY2FyZExpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIG5ldyBDYXJkRGlzbWlzcyhpdGVtKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBDYXJkRGlzbWlzcyhpdGVtKSB7XHJcbiAgICAgICAgICAgIHZhciBFVkVOVF9SRU1PVkUgPSAnY2FyZC5yZW1vdmUnO1xyXG4gICAgICAgICAgICB2YXIgRVZFTlRfUkVNT1ZFRCA9ICdjYXJkLnJlbW92ZWQnO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkUGFyZW50ID0gZ2V0Q2FyZFBhcmVudCh0aGlzLml0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92aW5nID0gZmFsc2U7IC8vIHByZXZlbnRzIGRvdWJsZSBleGVjdXRpb25cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmVtb3ZpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy8gcGFzcyBjYWxsYmFja3MgdmlhIGV2ZW50LmRldGFpbCB0byBjb25maXJtL2NhbmNlbCB0aGUgcmVtb3ZhbFxyXG4gICAgICAgICAgICAgICAgdHJpZ2dlckV2ZW50KEVWRU5UX1JFTU9WRSwgdGhpcy5jYXJkUGFyZW50LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybTogdGhpcy5jb25maXJtLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsOiB0aGlzLmNhbmNlbC5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNvbmZpcm0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSh0aGlzLmNhcmRQYXJlbnQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJFdmVudChFVkVOVF9SRU1PVkVELCB0aGlzLmNhcmRQYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKHRoaXMuY2FyZFBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hbmltYXRlID0gZnVuY3Rpb24oaXRlbSwgY2IpIHtcclxuICAgICAgICAgICAgICAgIGlmICgnb25hbmltYXRpb25lbmQnIGluIHdpbmRvdykgeyAvLyBhbmltYXRpb24gc3VwcG9ydGVkXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBjYi5iaW5kKHRoaXMpKVxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NOYW1lICs9ICcgYW5pbWF0ZWQgYm91bmNlT3V0JzsgLy8gcmVxdWlyZXMgYW5pbWF0ZS5jc3NcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBjYi5jYWxsKHRoaXMpIC8vIG5vIGFuaW1hdGlvbiwganVzdCByZW1vdmVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBhdHRhY2ggbGlzdGVuZXJcclxuICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xpY2tIYW5kbGVyLmJpbmQodGhpcyksIGZhbHNlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb2xsYXBzZWQgY2FyZHNcclxuICAgICAqIFtkYXRhLXRvb2w9XCJjYXJkLWNvbGxhcHNlXCJdXHJcbiAgICAgKiBbZGF0YS1zdGFydC1jb2xsYXBzZWRdXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluaXRDYXJkQ29sbGFwc2UoKSB7XHJcbiAgICAgICAgdmFyIGNhcmR0b29sU2VsZWN0b3IgPSAnW2RhdGEtdG9vbD1cImNhcmQtY29sbGFwc2VcIl0nO1xyXG4gICAgICAgIHZhciBjYXJkTGlzdCA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjYXJkdG9vbFNlbGVjdG9yKSlcclxuXHJcbiAgICAgICAgY2FyZExpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcbiAgICAgICAgICAgIHZhciBpbml0aWFsU3RhdGUgPSBpdGVtLmhhc0F0dHJpYnV0ZSgnZGF0YS1zdGFydC1jb2xsYXBzZWQnKVxyXG4gICAgICAgICAgICBuZXcgQ2FyZENvbGxhcHNlKGl0ZW0sIGluaXRpYWxTdGF0ZSk7XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gQ2FyZENvbGxhcHNlKGl0ZW0sIHN0YXJ0Q29sbGFwc2VkKSB7XHJcbiAgICAgICAgICAgIHZhciBFVkVOVF9TSE9XID0gJ2NhcmQuY29sbGFwc2Uuc2hvdyc7XHJcbiAgICAgICAgICAgIHZhciBFVkVOVF9ISURFID0gJ2NhcmQuY29sbGFwc2UuaGlkZSc7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gdHJ1ZTsgLy8gdHJ1ZSAtPiBzaG93IC8gZmFsc2UgLT4gaGlkZVxyXG4gICAgICAgICAgICB0aGlzLml0ZW0gPSBpdGVtO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRQYXJlbnQgPSBnZXRDYXJkUGFyZW50KHRoaXMuaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMud3JhcHBlciA9IHRoaXMuY2FyZFBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY2FyZC13cmFwcGVyJyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUNvbGxhcHNlID0gZnVuY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyRXZlbnQoYWN0aW9uID8gRVZFTlRfU0hPVyA6IEVWRU5UX0hJREUsIHRoaXMuY2FyZFBhcmVudClcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcHBlci5zdHlsZS5tYXhIZWlnaHQgPSAoYWN0aW9uID8gdGhpcy53cmFwcGVyLnNjcm9sbEhlaWdodCA6IDApICsgJ3B4J1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IGFjdGlvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSWNvbihhY3Rpb24pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVJY29uID0gZnVuY3Rpb24oYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW0uZmlyc3RFbGVtZW50Q2hpbGQuY2xhc3NOYW1lID0gYWN0aW9uID8gJ2ZhIGZhLW1pbnVzJyA6ICdmYSBmYS1wbHVzJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUNvbGxhcHNlKCF0aGlzLnN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmluaXRTdHlsZXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcHBlci5zdHlsZS5tYXhIZWlnaHQgPSB0aGlzLndyYXBwZXIuc2Nyb2xsSGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcHBlci5zdHlsZS50cmFuc2l0aW9uID0gJ21heC1oZWlnaHQgMC41cyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gcHJlcGFyZSBzdHlsZXMgZm9yIGNvbGxhcHNlIGFuaW1hdGlvblxyXG4gICAgICAgICAgICB0aGlzLmluaXRTdHlsZXMoKVxyXG4gICAgICAgICAgICAvLyBzZXQgaW5pdGlhbCBzdGF0ZSBpZiBwcm92aWRlZFxyXG4gICAgICAgICAgICBpZiAoc3RhcnRDb2xsYXBzZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlQ29sbGFwc2UoZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gYXR0YWNoIGxpc3RlbmVyXHJcbiAgICAgICAgICAgIHRoaXMuaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xpY2tIYW5kbGVyLmJpbmQodGhpcyksIGZhbHNlKVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVmcmVzaCBjYXJkc1xyXG4gICAgICogW2RhdGEtdG9vbD1cImNhcmQtcmVmcmVzaFwiXVxyXG4gICAgICogW2RhdGEtc3Bpbm5lcj1cInN0YW5kYXJkXCJdXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluaXRDYXJkUmVmcmVzaCgpIHtcclxuXHJcbiAgICAgICAgdmFyIGNhcmR0b29sU2VsZWN0b3IgPSAnW2RhdGEtdG9vbD1cImNhcmQtcmVmcmVzaFwiXSc7XHJcbiAgICAgICAgdmFyIGNhcmRMaXN0ID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNhcmR0b29sU2VsZWN0b3IpKVxyXG5cclxuICAgICAgICBjYXJkTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgbmV3IENhcmRSZWZyZXNoKGl0ZW0pO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIENhcmRSZWZyZXNoKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIEVWRU5UX1JFRlJFU0ggPSAnY2FyZC5yZWZyZXNoJztcclxuICAgICAgICAgICAgdmFyIFdISVJMX0NMQVNTID0gJ3doaXJsJztcclxuICAgICAgICAgICAgdmFyIERFRkFVTFRfU1BJTk5FUiA9ICdzdGFuZGFyZCdcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaXRlbSA9IGl0ZW07XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZFBhcmVudCA9IGdldENhcmRQYXJlbnQodGhpcy5pdGVtKVxyXG4gICAgICAgICAgICB0aGlzLnNwaW5uZXIgPSAoKHRoaXMuaXRlbS5kYXRhc2V0IHx8IHt9KS5zcGlubmVyIHx8IERFRkFVTFRfU1BJTk5FUikuc3BsaXQoJyAnKTsgLy8gc3VwcG9ydCBzcGFjZSBzZXBhcmF0ZWQgY2xhc3Nlc1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhcmQgPSB0aGlzLmNhcmRQYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBzaG93aW5nIHRoZSBzcGlubmVyXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTcGlubmVyKGNhcmQsIHRoaXMuc3Bpbm5lcilcclxuICAgICAgICAgICAgICAgIC8vIGF0dGFjaCBhcyBwdWJsaWMgbWV0aG9kXHJcbiAgICAgICAgICAgICAgICBjYXJkLnJlbW92ZVNwaW5uZXIgPSB0aGlzLnJlbW92ZVNwaW5uZXIuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgdGhlIGV2ZW50IGFuZCBzZW5kIHRoZSBjYXJkXHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyRXZlbnQoRVZFTlRfUkVGUkVTSCwgY2FyZCwgeyBjYXJkOiBjYXJkIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1NwaW5uZXIgPSBmdW5jdGlvbihjYXJkLCBzcGlubmVyKSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoV0hJUkxfQ0xBU1MpO1xyXG4gICAgICAgICAgICAgICAgc3Bpbm5lci5mb3JFYWNoKGZ1bmN0aW9uKHMpIHsgY2FyZC5jbGFzc0xpc3QuYWRkKHMpIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVTcGlubmVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRQYXJlbnQuY2xhc3NMaXN0LnJlbW92ZShXSElSTF9DTEFTUyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGF0dGFjaCBsaXN0ZW5lclxyXG4gICAgICAgICAgICB0aGlzLml0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSwgZmFsc2UpXHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gR0xPQkFMIENPTlNUQU5UU1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHdpbmRvdy5BUFBfQ09MT1JTID0ge1xyXG4gICAgICAgICdwcmltYXJ5JzogICAgICAgICAgICAgICAgJyM1ZDljZWMnLFxyXG4gICAgICAgICdzdWNjZXNzJzogICAgICAgICAgICAgICAgJyMyN2MyNGMnLFxyXG4gICAgICAgICdpbmZvJzogICAgICAgICAgICAgICAgICAgJyMyM2I3ZTUnLFxyXG4gICAgICAgICd3YXJuaW5nJzogICAgICAgICAgICAgICAgJyNmZjkwMmInLFxyXG4gICAgICAgICdkYW5nZXInOiAgICAgICAgICAgICAgICAgJyNmMDUwNTAnLFxyXG4gICAgICAgICdpbnZlcnNlJzogICAgICAgICAgICAgICAgJyMxMzFlMjYnLFxyXG4gICAgICAgICdncmVlbic6ICAgICAgICAgICAgICAgICAgJyMzN2JjOWInLFxyXG4gICAgICAgICdwaW5rJzogICAgICAgICAgICAgICAgICAgJyNmNTMyZTUnLFxyXG4gICAgICAgICdwdXJwbGUnOiAgICAgICAgICAgICAgICAgJyM3MjY2YmEnLFxyXG4gICAgICAgICdkYXJrJzogICAgICAgICAgICAgICAgICAgJyMzYTNmNTEnLFxyXG4gICAgICAgICd5ZWxsb3cnOiAgICAgICAgICAgICAgICAgJyNmYWQ3MzInLFxyXG4gICAgICAgICdncmF5LWRhcmtlcic6ICAgICAgICAgICAgJyMyMzI3MzUnLFxyXG4gICAgICAgICdncmF5LWRhcmsnOiAgICAgICAgICAgICAgJyMzYTNmNTEnLFxyXG4gICAgICAgICdncmF5JzogICAgICAgICAgICAgICAgICAgJyNkZGU2ZTknLFxyXG4gICAgICAgICdncmF5LWxpZ2h0JzogICAgICAgICAgICAgJyNlNGVhZWMnLFxyXG4gICAgICAgICdncmF5LWxpZ2h0ZXInOiAgICAgICAgICAgJyNlZGYxZjInXHJcbiAgICB9O1xyXG5cclxuICAgIHdpbmRvdy5BUFBfTUVESUFRVUVSWSA9IHtcclxuICAgICAgICAnZGVza3RvcExHJzogICAgICAgICAgICAgMTIwMCxcclxuICAgICAgICAnZGVza3RvcCc6ICAgICAgICAgICAgICAgIDk5MixcclxuICAgICAgICAndGFibGV0JzogICAgICAgICAgICAgICAgIDc2OCxcclxuICAgICAgICAnbW9iaWxlJzogICAgICAgICAgICAgICAgIDQ4MFxyXG4gICAgfTtcclxuXHJcbn0pKCk7IiwiLy8gRlVMTFNDUkVFTlxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdFNjcmVlbkZ1bGwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRTY3JlZW5GdWxsKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2NyZWVuZnVsbCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyICRkb2MgPSAkKGRvY3VtZW50KTtcclxuICAgICAgICB2YXIgJGZzVG9nZ2xlciA9ICQoJ1tkYXRhLXRvZ2dsZS1mdWxsc2NyZWVuXScpO1xyXG5cclxuICAgICAgICAvLyBOb3Qgc3VwcG9ydGVkIHVuZGVyIElFXHJcbiAgICAgICAgdmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcbiAgICAgICAgaWYgKHVhLmluZGV4T2YoXCJNU0lFIFwiKSA+IDAgfHwgISF1YS5tYXRjaCgvVHJpZGVudC4qcnZcXDoxMVxcLi8pKSB7XHJcbiAgICAgICAgICAgICRmc1RvZ2dsZXIuYWRkQ2xhc3MoJ2Qtbm9uZScpOyAvLyBoaWRlIGVsZW1lbnRcclxuICAgICAgICAgICAgcmV0dXJuOyAvLyBhbmQgYWJvcnRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRmc1RvZ2dsZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2NyZWVuZnVsbC5lbmFibGVkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NyZWVuZnVsbC50b2dnbGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTd2l0Y2ggaWNvbiBpbmRpY2F0b3JcclxuICAgICAgICAgICAgICAgIHRvZ2dsZUZTSWNvbigkZnNUb2dnbGVyKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRnVsbHNjcmVlbiBub3QgZW5hYmxlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChzY3JlZW5mdWxsLnJhdyAmJiBzY3JlZW5mdWxsLnJhdy5mdWxsc2NyZWVuY2hhbmdlKVxyXG4gICAgICAgICAgICAkZG9jLm9uKHNjcmVlbmZ1bGwucmF3LmZ1bGxzY3JlZW5jaGFuZ2UsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdG9nZ2xlRlNJY29uKCRmc1RvZ2dsZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlRlNJY29uKCRlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChzY3JlZW5mdWxsLmlzRnVsbHNjcmVlbilcclxuICAgICAgICAgICAgICAgICRlbGVtZW50LmNoaWxkcmVuKCdlbScpLnJlbW92ZUNsYXNzKCdmYS1leHBhbmQnKS5hZGRDbGFzcygnZmEtY29tcHJlc3MnKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuY2hpbGRyZW4oJ2VtJykucmVtb3ZlQ2xhc3MoJ2ZhLWNvbXByZXNzJykuYWRkQ2xhc3MoJ2ZhLWV4cGFuZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIExPQUQgQ1VTVE9NIENTU1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdExvYWRDU1MpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRMb2FkQ1NTKCkge1xyXG5cclxuICAgICAgICAkKCdbZGF0YS1sb2FkLWNzc10nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5pcygnYScpKVxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHVyaSA9IGVsZW1lbnQuZGF0YSgnbG9hZENzcycpLFxyXG4gICAgICAgICAgICAgICAgbGluaztcclxuXHJcbiAgICAgICAgICAgIGlmICh1cmkpIHtcclxuICAgICAgICAgICAgICAgIGxpbmsgPSBjcmVhdGVMaW5rKHVyaSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWxpbmspIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmVycm9yKCdFcnJvciBjcmVhdGluZyBzdHlsZXNoZWV0IGxpbmsgZWxlbWVudC4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQuZXJyb3IoJ05vIHN0eWxlc2hlZXQgbG9jYXRpb24gZGVmaW5lZC4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVMaW5rKHVyaSkge1xyXG4gICAgICAgIHZhciBsaW5rSWQgPSAnYXV0b2xvYWRlZC1zdHlsZXNoZWV0JyxcclxuICAgICAgICAgICAgb2xkTGluayA9ICQoJyMnICsgbGlua0lkKS5hdHRyKCdpZCcsIGxpbmtJZCArICctb2xkJyk7XHJcblxyXG4gICAgICAgICQoJ2hlYWQnKS5hcHBlbmQoJCgnPGxpbmsvPicpLmF0dHIoe1xyXG4gICAgICAgICAgICAnaWQnOiBsaW5rSWQsXHJcbiAgICAgICAgICAgICdyZWwnOiAnc3R5bGVzaGVldCcsXHJcbiAgICAgICAgICAgICdocmVmJzogdXJpXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICBpZiAob2xkTGluay5sZW5ndGgpIHtcclxuICAgICAgICAgICAgb2xkTGluay5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAkKCcjJyArIGxpbmtJZCk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIFRSQU5TTEFUSU9OXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0VHJhbnNsYXRpb24pO1xyXG5cclxuXHJcbiAgICB2YXIgcGF0aFByZWZpeCA9ICcvQ29udGVudC9pMThuJzsgLy8gZm9sZGVyIG9mIGpzb24gZmlsZXNcclxuICAgIHZhciBTVE9SQUdFS0VZID0gJ2pxLWFwcExhbmcnO1xyXG4gICAgdmFyIHNhdmVkTGFuZ3VhZ2UgPSBTdG9yYWdlcy5sb2NhbFN0b3JhZ2UuZ2V0KFNUT1JBR0VLRVkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRUcmFuc2xhdGlvbigpIHtcclxuICAgICAgICBpMThuZXh0XHJcbiAgICAgICAgICAgIC51c2UoaTE4bmV4dFhIUkJhY2tlbmQpXHJcbiAgICAgICAgICAgIC8vIC51c2UoTGFuZ3VhZ2VEZXRlY3RvcilcclxuICAgICAgICAgICAgLmluaXQoe1xyXG4gICAgICAgICAgICAgICAgZmFsbGJhY2tMbmc6IHNhdmVkTGFuZ3VhZ2UgfHwgJ2VuJyxcclxuICAgICAgICAgICAgICAgIGJhY2tlbmQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBsb2FkUGF0aDogcGF0aFByZWZpeCArICcve3tuc319LXt7bG5nfX0uanNvbicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbnM6IFsnc2l0ZSddLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdE5TOiAnc2l0ZScsXHJcbiAgICAgICAgICAgICAgICBkZWJ1ZzogZmFsc2VcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyLCB0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbml0aWFsaXplIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICAgICBhcHBseVRyYW5sYXRpb25zKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBsaXN0ZW4gdG8gbGFuZ3VhZ2UgY2hhbmdlc1xyXG4gICAgICAgICAgICAgICAgYXR0YWNoQ2hhbmdlTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXBwbHlUcmFubGF0aW9ucygpIHtcclxuICAgICAgICAgICAgdmFyIGxpc3QgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWxvY2FsaXplXScpKVxyXG4gICAgICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWxvY2FsaXplJylcclxuICAgICAgICAgICAgICAgIGlmIChpMThuZXh0LmV4aXN0cyhrZXkpKSBpdGVtLmlubmVySFRNTCA9IGkxOG5leHQudChrZXkpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoQ2hhbmdlTGlzdGVuZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1zZXQtbGFuZ10nKSlcclxuICAgICAgICAgICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC50YWdOYW1lID09PSAnQScpIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFuZyA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXNldC1sYW5nJylcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFuZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpMThuZXh0LmNoYW5nZUxhbmd1YWdlKGxhbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikgY29uc29sZS5sb2coZXJyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlUcmFubGF0aW9ucygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0b3JhZ2VzLmxvY2FsU3RvcmFnZS5zZXQoU1RPUkFHRUtFWSwgbGFuZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmF0ZURyb3Bkb3duKGl0ZW0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZURyb3Bkb3duKGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wZG93bi1pdGVtJykpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ucGFyZW50RWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmlubmVySFRNTCA9IGl0ZW0uaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG59KSgpOyIsIi8vIE5BVkJBUiBTRUFSQ0hcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXROYXZiYXJTZWFyY2gpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXROYXZiYXJTZWFyY2goKSB7XHJcblxyXG4gICAgICAgIHZhciBuYXZTZWFyY2ggPSBuZXcgbmF2YmFyU2VhcmNoSW5wdXQoKTtcclxuXHJcbiAgICAgICAgLy8gT3BlbiBzZWFyY2ggaW5wdXRcclxuICAgICAgICB2YXIgJHNlYXJjaE9wZW4gPSAkKCdbZGF0YS1zZWFyY2gtb3Blbl0nKTtcclxuXHJcbiAgICAgICAgJHNlYXJjaE9wZW5cclxuICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfSlcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsIG5hdlNlYXJjaC50b2dnbGUpO1xyXG5cclxuICAgICAgICAvLyBDbG9zZSBzZWFyY2ggaW5wdXRcclxuICAgICAgICB2YXIgJHNlYXJjaERpc21pc3MgPSAkKCdbZGF0YS1zZWFyY2gtZGlzbWlzc10nKTtcclxuICAgICAgICB2YXIgaW5wdXRTZWxlY3RvciA9ICcubmF2YmFyLWZvcm0gaW5wdXRbdHlwZT1cInRleHRcIl0nO1xyXG5cclxuICAgICAgICAkKGlucHV0U2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH0pXHJcbiAgICAgICAgICAgIC5vbigna2V5dXAnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDI3KSAvLyBFU0NcclxuICAgICAgICAgICAgICAgICAgICBuYXZTZWFyY2guZGlzbWlzcygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY2xpY2sgYW55d2hlcmUgY2xvc2VzIHRoZSBzZWFyY2hcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBuYXZTZWFyY2guZGlzbWlzcyk7XHJcbiAgICAgICAgLy8gZGlzbWlzc2FibGUgb3B0aW9uc1xyXG4gICAgICAgICRzZWFyY2hEaXNtaXNzXHJcbiAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH0pXHJcbiAgICAgICAgICAgIC5vbignY2xpY2snLCBuYXZTZWFyY2guZGlzbWlzcyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHZhciBuYXZiYXJTZWFyY2hJbnB1dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBuYXZiYXJGb3JtU2VsZWN0b3IgPSAnZm9ybS5uYXZiYXItZm9ybSc7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgbmF2YmFyRm9ybSA9ICQobmF2YmFyRm9ybVNlbGVjdG9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuYXZiYXJGb3JtLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGlzT3BlbiA9IG5hdmJhckZvcm0uaGFzQ2xhc3MoJ29wZW4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuYXZiYXJGb3JtLmZpbmQoJ2lucHV0JylbaXNPcGVuID8gJ2ZvY3VzJyA6ICdibHVyJ10oKTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBkaXNtaXNzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICQobmF2YmFyRm9ybVNlbGVjdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpIC8vIENsb3NlIGNvbnRyb2xcclxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbdHlwZT1cInRleHRcIl0nKS5ibHVyKCkgLy8gcmVtb3ZlIGZvY3VzXHJcbiAgICAgICAgICAgICAgICAvLyAudmFsKCcnKSAgICAgICAgICAgICAgICAgICAgLy8gRW1wdHkgaW5wdXRcclxuICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBOT1cgVElNRVJcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXROb3dUaW1lcik7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdE5vd1RpbWVyKCkge1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIG1vbWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcclxuXHJcbiAgICAgICAgJCgnW2RhdGEtbm93XScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGVsZW1lbnQuZGF0YSgnZm9ybWF0Jyk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVUaW1lKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGR0ID0gbW9tZW50KG5ldyBEYXRlKCkpLmZvcm1hdChmb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC50ZXh0KGR0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXBkYXRlVGltZSgpO1xyXG4gICAgICAgICAgICBzZXRJbnRlcnZhbCh1cGRhdGVUaW1lLCAxMDAwKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIFRvZ2dsZSBSVEwgbW9kZSBmb3IgZGVtb1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRSVEwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRSVEwoKSB7XHJcbiAgICAgICAgdmFyIG1haW5jc3MgPSAkKCcjbWFpbmNzcycpO1xyXG4gICAgICAgIHZhciBic2NzcyA9ICQoJyNic2NzcycpO1xyXG4gICAgICAgICQoJyNjaGstcnRsJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBhcHAgcnRsIGNoZWNrXHJcbiAgICAgICAgICAgIG1haW5jc3MuYXR0cignaHJlZicsIHRoaXMuY2hlY2tlZCA/ICcvQ29udGVudC9jc3MvYXBwLXJ0bC5jc3MnIDogJy9Db250ZW50L2Nzcy9hcHAuY3NzJyk7XHJcbiAgICAgICAgICAgIC8vIGJvb3RzdHJhcCBydGwgY2hlY2tcclxuICAgICAgICAgICAgYnNjc3MuYXR0cignaHJlZicsIHRoaXMuY2hlY2tlZCA/ICcvQ29udGVudC9jc3MvYm9vdHN0cmFwLXJ0bC5jc3MnIDogJy9Db250ZW50L2Nzcy9ib290c3RyYXAuY3NzJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIFNJREVCQVJcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0U2lkZWJhcik7XHJcblxyXG4gICAgdmFyICRodG1sO1xyXG4gICAgdmFyICRib2R5O1xyXG4gICAgdmFyICRzaWRlYmFyO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRTaWRlYmFyKCkge1xyXG5cclxuICAgICAgICAkaHRtbCA9ICQoJ2h0bWwnKTtcclxuICAgICAgICAkYm9keSA9ICQoJ2JvZHknKTtcclxuICAgICAgICAkc2lkZWJhciA9ICQoJy5zaWRlYmFyJyk7XHJcblxyXG4gICAgICAgIC8vIEFVVE9DT0xMQVBTRSBJVEVNU1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgIHZhciBzaWRlYmFyQ29sbGFwc2UgPSAkc2lkZWJhci5maW5kKCcuY29sbGFwc2UnKTtcclxuICAgICAgICBzaWRlYmFyQ29sbGFwc2Uub24oJ3Nob3cuYnMuY29sbGFwc2UnLCBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLnBhcmVudHMoJy5jb2xsYXBzZScpLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgICAgIHNpZGViYXJDb2xsYXBzZS5maWx0ZXIoJy5zaG93JykuY29sbGFwc2UoJ2hpZGUnKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFNJREVCQVIgQUNUSVZFIFNUQVRFXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgLy8gRmluZCBjdXJyZW50IGFjdGl2ZSBpdGVtXHJcbiAgICAgICAgdmFyIGN1cnJlbnRJdGVtID0gJCgnLnNpZGViYXIgLmFjdGl2ZScpLnBhcmVudHMoJ2xpJyk7XHJcblxyXG4gICAgICAgIC8vIGhvdmVyIG1vZGUgZG9uJ3QgdHJ5IHRvIGV4cGFuZCBhY3RpdmUgY29sbGFwc2VcclxuICAgICAgICBpZiAoIXVzZUFzaWRlSG92ZXIoKSlcclxuICAgICAgICAgICAgY3VycmVudEl0ZW1cclxuICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKSAvLyBhY3RpdmF0ZSB0aGUgcGFyZW50XHJcbiAgICAgICAgICAgIC5jaGlsZHJlbignLmNvbGxhcHNlJykgLy8gZmluZCB0aGUgY29sbGFwc2VcclxuICAgICAgICAgICAgLmNvbGxhcHNlKCdzaG93Jyk7IC8vIGFuZCBzaG93IGl0XHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIGlmIHlvdSB1c2Ugb25seSBjb2xsYXBzaWJsZSBzaWRlYmFyIGl0ZW1zXHJcbiAgICAgICAgJHNpZGViYXIuZmluZCgnbGkgPiBhICsgdWwnKS5vbignc2hvdy5icy5jb2xsYXBzZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgaWYgKHVzZUFzaWRlSG92ZXIoKSkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTSURFQkFSIENPTExBUFNFRCBJVEVNIEhBTkRMRVJcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGlzVG91Y2goKSA/ICdjbGljaycgOiAnbW91c2VlbnRlcic7XHJcbiAgICAgICAgdmFyIHN1Yk5hdiA9ICQoKTtcclxuICAgICAgICAkc2lkZWJhci5maW5kKCcuc2lkZWJhci1uYXYgPiBsaScpLm9uKGV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzU2lkZWJhckNvbGxhcHNlZCgpIHx8IHVzZUFzaWRlSG92ZXIoKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHN1Yk5hdi50cmlnZ2VyKCdtb3VzZWxlYXZlJyk7XHJcbiAgICAgICAgICAgICAgICBzdWJOYXYgPSB0b2dnbGVNZW51SXRlbSgkKHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBVc2VkIHRvIGRldGVjdCBjbGljayBhbmQgdG91Y2ggZXZlbnRzIG91dHNpZGUgdGhlIHNpZGViYXJcclxuICAgICAgICAgICAgICAgIHNpZGViYXJBZGRCYWNrZHJvcCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgc2lkZWJhckFueWNsaWNrQ2xvc2UgPSAkc2lkZWJhci5kYXRhKCdzaWRlYmFyQW55Y2xpY2tDbG9zZScpO1xyXG5cclxuICAgICAgICAvLyBBbGxvd3MgdG8gY2xvc2VcclxuICAgICAgICBpZiAodHlwZW9mIHNpZGViYXJBbnljbGlja0Nsb3NlICE9PSAndW5kZWZpbmVkJykge1xyXG5cclxuICAgICAgICAgICAgJCgnLndyYXBwZXInKS5vbignY2xpY2suc2lkZWJhcicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGNoZWNrIGlmIHNpZGViYXIgbm90IHZpc2libGVcclxuICAgICAgICAgICAgICAgIGlmICghJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLXRvZ2dsZWQnKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoISR0YXJnZXQucGFyZW50cygnLmFzaWRlLWNvbnRhaW5lcicpLmxlbmd0aCAmJiAvLyBpZiBub3QgY2hpbGQgb2Ygc2lkZWJhclxyXG4gICAgICAgICAgICAgICAgICAgICEkdGFyZ2V0LmlzKCcjdXNlci1ibG9jay10b2dnbGUnKSAmJiAvLyB1c2VyIGJsb2NrIHRvZ2dsZSBhbmNob3JcclxuICAgICAgICAgICAgICAgICAgICAhJHRhcmdldC5wYXJlbnQoKS5pcygnI3VzZXItYmxvY2stdG9nZ2xlJykgLy8gdXNlciBibG9jayB0b2dnbGUgaWNvblxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkucmVtb3ZlQ2xhc3MoJ2FzaWRlLXRvZ2dsZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaWRlYmFyQWRkQmFja2Ryb3AoKSB7XHJcbiAgICAgICAgdmFyICRiYWNrZHJvcCA9ICQoJzxkaXYvPicsIHsgJ2NsYXNzJzogJ3NpZGVhYnItYmFja2Ryb3AnIH0pO1xyXG4gICAgICAgICRiYWNrZHJvcC5pbnNlcnRBZnRlcignLmFzaWRlLWNvbnRhaW5lcicpLm9uKFwiY2xpY2sgbW91c2VlbnRlclwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmVtb3ZlRmxvYXRpbmdOYXYoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPcGVuIHRoZSBjb2xsYXBzZSBzaWRlYmFyIHN1Ym1lbnUgaXRlbXMgd2hlbiBvbiB0b3VjaCBkZXZpY2VzXHJcbiAgICAvLyAtIGRlc2t0b3Agb25seSBvcGVucyBvbiBob3ZlclxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlVG91Y2hJdGVtKCRlbGVtZW50KSB7XHJcbiAgICAgICAgJGVsZW1lbnRcclxuICAgICAgICAgICAgLnNpYmxpbmdzKCdsaScpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXHJcbiAgICAgICAgJGVsZW1lbnRcclxuICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlcyBob3ZlciB0byBvcGVuIGl0ZW1zIHVuZGVyIGNvbGxhcHNlZCBtZW51XHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlTWVudUl0ZW0oJGxpc3RJdGVtKSB7XHJcblxyXG4gICAgICAgIHJlbW92ZUZsb2F0aW5nTmF2KCk7XHJcblxyXG4gICAgICAgIHZhciB1bCA9ICRsaXN0SXRlbS5jaGlsZHJlbigndWwnKTtcclxuXHJcbiAgICAgICAgaWYgKCF1bC5sZW5ndGgpIHJldHVybiAkKCk7XHJcbiAgICAgICAgaWYgKCRsaXN0SXRlbS5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgICAgIHRvZ2dsZVRvdWNoSXRlbSgkbGlzdEl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gJCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyICRhc2lkZSA9ICQoJy5hc2lkZS1jb250YWluZXInKTtcclxuICAgICAgICB2YXIgJGFzaWRlSW5uZXIgPSAkKCcuYXNpZGUtaW5uZXInKTsgLy8gZm9yIHRvcCBvZmZzZXQgY2FsY3VsYXRpb25cclxuICAgICAgICAvLyBmbG9hdCBhc2lkZSB1c2VzIGV4dHJhIHBhZGRpbmcgb24gYXNpZGVcclxuICAgICAgICB2YXIgbWFyID0gcGFyc2VJbnQoJGFzaWRlSW5uZXIuY3NzKCdwYWRkaW5nLXRvcCcpLCAwKSArIHBhcnNlSW50KCRhc2lkZS5jc3MoJ3BhZGRpbmctdG9wJyksIDApO1xyXG5cclxuICAgICAgICB2YXIgc3ViTmF2ID0gdWwuY2xvbmUoKS5hcHBlbmRUbygkYXNpZGUpO1xyXG5cclxuICAgICAgICB0b2dnbGVUb3VjaEl0ZW0oJGxpc3RJdGVtKTtcclxuXHJcbiAgICAgICAgdmFyIGl0ZW1Ub3AgPSAoJGxpc3RJdGVtLnBvc2l0aW9uKCkudG9wICsgbWFyKSAtICRzaWRlYmFyLnNjcm9sbFRvcCgpO1xyXG4gICAgICAgIHZhciB2d0hlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICBzdWJOYXZcclxuICAgICAgICAgICAgLmFkZENsYXNzKCduYXYtZmxvYXRpbmcnKVxyXG4gICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBpc0ZpeGVkKCkgPyAnZml4ZWQnIDogJ2Fic29sdXRlJyxcclxuICAgICAgICAgICAgICAgIHRvcDogaXRlbVRvcCxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogKHN1Yk5hdi5vdXRlckhlaWdodCh0cnVlKSArIGl0ZW1Ub3AgPiB2d0hlaWdodCkgPyAwIDogJ2F1dG8nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdWJOYXYub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdG9nZ2xlVG91Y2hJdGVtKCRsaXN0SXRlbSk7XHJcbiAgICAgICAgICAgIHN1Yk5hdi5yZW1vdmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1Yk5hdjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW1vdmVGbG9hdGluZ05hdigpIHtcclxuICAgICAgICAkKCcuc2lkZWJhci1zdWJuYXYubmF2LWZsb2F0aW5nJykucmVtb3ZlKCk7XHJcbiAgICAgICAgJCgnLnNpZGVhYnItYmFja2Ryb3AnKS5yZW1vdmUoKTtcclxuICAgICAgICAkKCcuc2lkZWJhciBsaS5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc1RvdWNoKCkge1xyXG4gICAgICAgIHJldHVybiAkaHRtbC5oYXNDbGFzcygndG91Y2gnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc1NpZGViYXJDb2xsYXBzZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1jb2xsYXBzZWQnKSB8fCAkYm9keS5oYXNDbGFzcygnYXNpZGUtY29sbGFwc2VkLXRleHQnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc1NpZGViYXJUb2dnbGVkKCkge1xyXG4gICAgICAgIHJldHVybiAkYm9keS5oYXNDbGFzcygnYXNpZGUtdG9nZ2xlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzTW9iaWxlKCkge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIDwgQVBQX01FRElBUVVFUlkudGFibGV0O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzRml4ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuICRib2R5Lmhhc0NsYXNzKCdsYXlvdXQtZml4ZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1c2VBc2lkZUhvdmVyKCkge1xyXG4gICAgICAgIHJldHVybiAkYm9keS5oYXNDbGFzcygnYXNpZGUtaG92ZXInKTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gU0xJTVNDUk9MTFxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdFNsaW1zU3JvbGwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRTbGltc1Nyb2xsKCkge1xyXG5cclxuICAgICAgICBpZiAoISQuZm4gfHwgISQuZm4uc2xpbVNjcm9sbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAkKCdbZGF0YS1zY3JvbGxhYmxlXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0SGVpZ2h0ID0gMjUwO1xyXG5cclxuICAgICAgICAgICAgZWxlbWVudC5zbGltU2Nyb2xsKHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogKGVsZW1lbnQuZGF0YSgnaGVpZ2h0JykgfHwgZGVmYXVsdEhlaWdodClcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBUYWJsZSBDaGVjayBBbGxcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRUYWJsZUNoZWNrQWxsKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0VGFibGVDaGVja0FsbCgpIHtcclxuXHJcbiAgICAgICAgJCgnW2RhdGEtY2hlY2stYWxsXScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gJHRoaXMuaW5kZXgoKSArIDEsXHJcbiAgICAgICAgICAgICAgICBjaGVja2JveCA9ICR0aGlzLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpLFxyXG4gICAgICAgICAgICAgICAgdGFibGUgPSAkdGhpcy5wYXJlbnRzKCd0YWJsZScpO1xyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdG8gYWZmZWN0IG9ubHkgdGhlIGNvcnJlY3QgY2hlY2tib3ggY29sdW1uXHJcbiAgICAgICAgICAgIHRhYmxlLmZpbmQoJ3Rib2R5ID4gdHIgPiB0ZDpudGgtY2hpbGQoJyArIGluZGV4ICsgJykgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJylcclxuICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgY2hlY2tib3hbMF0uY2hlY2tlZCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gVE9HR0xFIFNUQVRFXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0VG9nZ2xlU3RhdGUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRUb2dnbGVTdGF0ZSgpIHtcclxuXHJcbiAgICAgICAgdmFyICRib2R5ID0gJCgnYm9keScpO1xyXG4gICAgICAgIHZhciB0b2dnbGUgPSBuZXcgU3RhdGVUb2dnbGVyKCk7XHJcblxyXG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZS1zdGF0ZV0nKVxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc25hbWUgPSBlbGVtZW50LmRhdGEoJ3RvZ2dsZVN0YXRlJyksXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gZWxlbWVudC5kYXRhKCd0YXJnZXQnKSxcclxuICAgICAgICAgICAgICAgICAgICBub1BlcnNpc3QgPSAoZWxlbWVudC5hdHRyKCdkYXRhLW5vLXBlcnNpc3QnKSAhPT0gdW5kZWZpbmVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTcGVjaWZ5IGEgdGFyZ2V0IHNlbGVjdG9yIHRvIHRvZ2dsZSBjbGFzc25hbWVcclxuICAgICAgICAgICAgICAgIC8vIHVzZSBib2R5IGJ5IGRlZmF1bHRcclxuICAgICAgICAgICAgICAgIHZhciAkdGFyZ2V0ID0gdGFyZ2V0ID8gJCh0YXJnZXQpIDogJGJvZHk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNsYXNzbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGFyZ2V0Lmhhc0NsYXNzKGNsYXNzbmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRhcmdldC5yZW1vdmVDbGFzcyhjbGFzc25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW5vUGVyc2lzdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZS5yZW1vdmVTdGF0ZShjbGFzc25hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0YXJnZXQuYWRkQ2xhc3MoY2xhc3NuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFub1BlcnNpc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGUuYWRkU3RhdGUoY2xhc3NuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNvbWUgZWxlbWVudHMgbWF5IG5lZWQgdGhpcyB3aGVuIHRvZ2dsZWQgY2xhc3MgY2hhbmdlIHRoZSBjb250ZW50IHNpemVcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoRXZlbnQpID09PSAnZnVuY3Rpb24nKSB7IC8vIG1vZGVybiBicm93c2Vyc1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVzaXplJykpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gb2xkIGJyb3dzZXJzIGFuZCBJRVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNpemVFdmVudCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFdmVudCgnVUlFdmVudHMnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNpemVFdmVudC5pbml0VUlFdmVudCgncmVzaXplJywgdHJ1ZSwgZmFsc2UsIHdpbmRvdywgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQocmVzaXplRXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFuZGxlIHN0YXRlcyB0by9mcm9tIGxvY2Fsc3RvcmFnZVxyXG4gICAgdmFyIFN0YXRlVG9nZ2xlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgU1RPUkFHRV9LRVlfTkFNRSA9ICdqcS10b2dnbGVTdGF0ZSc7XHJcblxyXG4gICAgICAgIC8qKiBBZGQgYSBzdGF0ZSB0byB0aGUgYnJvd3NlciBzdG9yYWdlIHRvIGJlIHJlc3RvcmVkIGxhdGVyICovXHJcbiAgICAgICAgdGhpcy5hZGRTdGF0ZSA9IGZ1bmN0aW9uKGNsYXNzbmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IFN0b3JhZ2VzLmxvY2FsU3RvcmFnZS5nZXQoU1RPUkFHRV9LRVlfTkFNRSk7XHJcbiAgICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIGRhdGEucHVzaChjbGFzc25hbWUpO1xyXG4gICAgICAgICAgICBlbHNlIGRhdGEgPSBbY2xhc3NuYW1lXTtcclxuICAgICAgICAgICAgU3RvcmFnZXMubG9jYWxTdG9yYWdlLnNldChTVE9SQUdFX0tFWV9OQU1FLCBkYXRhKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qKiBSZW1vdmUgYSBzdGF0ZSBmcm9tIHRoZSBicm93c2VyIHN0b3JhZ2UgKi9cclxuICAgICAgICB0aGlzLnJlbW92ZVN0YXRlID0gZnVuY3Rpb24oY2xhc3NuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gU3RvcmFnZXMubG9jYWxTdG9yYWdlLmdldChTVE9SQUdFX0tFWV9OQU1FKTtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGRhdGEuaW5kZXhPZihjbGFzc25hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgU3RvcmFnZXMubG9jYWxTdG9yYWdlLnNldChTVE9SQUdFX0tFWV9OQU1FLCBkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqIExvYWQgdGhlIHN0YXRlIHN0cmluZyBhbmQgcmVzdG9yZSB0aGUgY2xhc3NsaXN0ICovXHJcbiAgICAgICAgdGhpcy5yZXN0b3JlU3RhdGUgPSBmdW5jdGlvbigkZWxlbSkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IFN0b3JhZ2VzLmxvY2FsU3RvcmFnZS5nZXQoU1RPUkFHRV9LRVlfTkFNRSk7XHJcbiAgICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgICAgICAkZWxlbS5hZGRDbGFzcyhkYXRhLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgd2luZG93LlN0YXRlVG9nZ2xlciA9IFN0YXRlVG9nZ2xlcjtcclxuXHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogdHJpZ2dlci1yZXNpemUuanNcclxuICogVHJpZ2dlcnMgYSB3aW5kb3cgcmVzaXplIGV2ZW50IGZyb20gYW55IGVsZW1lbnRcclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0VHJpZ2dlclJlc2l6ZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFRyaWdnZXJSZXNpemUoKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSAkKCdbZGF0YS10cmlnZ2VyLXJlc2l6ZV0nKTtcclxuICAgICAgICB2YXIgdmFsdWUgPSBlbGVtZW50LmRhdGEoJ3RyaWdnZXJSZXNpemUnKVxyXG4gICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhbGwgSUUgZnJpZW5kbHkgZGlzcGF0Y2hFdmVudFxyXG4gICAgICAgICAgICAgICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdVSUV2ZW50cycpO1xyXG4gICAgICAgICAgICAgICAgZXZ0LmluaXRVSUV2ZW50KCdyZXNpemUnLCB0cnVlLCBmYWxzZSwgd2luZG93LCAwKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2dCk7XHJcbiAgICAgICAgICAgICAgICAvLyBtb2Rlcm4gZGlzcGF0Y2hFdmVudCB3YXlcclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVzaXplJykpO1xyXG4gICAgICAgICAgICB9LCB2YWx1ZSB8fCAzMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBEZW1vIENhcmRzXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0Q2FyZERlbW8pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRDYXJkRGVtbygpIHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhpcyBmdW5jdGlvbnMgc2hvdyBhIGRlbW9uc3RyYXRpb24gb2YgaG93IHRvIHVzZVxyXG4gICAgICAgICAqIHRoZSBjYXJkIHRvb2xzIHN5c3RlbSB2aWEgY3VzdG9tIGV2ZW50LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBjYXJkTGlzdCA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNhcmQuY2FyZC1kZW1vJykpO1xyXG4gICAgICAgIGNhcmRMaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cclxuICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjYXJkLnJlZnJlc2gnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBjYXJkIGVsZW1lbnQgdGhhdCBpcyByZWZyZXNoaW5nXHJcbiAgICAgICAgICAgICAgICB2YXIgY2FyZCA9IGV2ZW50LmRldGFpbC5jYXJkO1xyXG4gICAgICAgICAgICAgICAgLy8gcGVyZm9ybSBhbnkgYWN0aW9uIGhlcmUsIHdoZW4gaXQgaXMgZG9uZSxcclxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgc3Bpbm5lciBjYWxsaW5nIFwicmVtb3ZlU3Bpbm5lclwiXHJcbiAgICAgICAgICAgICAgICAvLyBzZXRUaW1lb3V0IHVzZWQgdG8gc2ltdWxhdGUgYXN5bmMgb3BlcmF0aW9uXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGNhcmQucmVtb3ZlU3Bpbm5lciwgMzAwMCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2FyZC5jb2xsYXBzZS5oaWRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FyZCBDb2xsYXBzZSBIaWRlJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2FyZC5jb2xsYXBzZS5zaG93JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ2FyZCBDb2xsYXBzZSBTaG93Jyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2FyZC5yZW1vdmUnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSBldmVudC5kZXRhaWwuY29uZmlybTtcclxuICAgICAgICAgICAgICAgIHZhciBjYW5jZWwgPSBldmVudC5kZXRhaWwuY2FuY2VsO1xyXG4gICAgICAgICAgICAgICAgLy8gcGVyZm9ybSBhbnkgYWN0aW9uICBoZXJlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVtb3ZpbmcgQ2FyZCcpO1xyXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCBjb25maXJtKCkgdG8gY29udGludWUgcmVtb3ZpbmcgY2FyZFxyXG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGNhbGwgY2FuY2VsKClcclxuICAgICAgICAgICAgICAgIGNvbmZpcm0oKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjYXJkLnJlbW92ZWQnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlbW92ZWQgQ2FyZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIE5lc3RhYmxlIGRlbW9cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXROZXN0YWJsZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdE5lc3RhYmxlKCkge1xyXG5cclxuICAgICAgICBpZiAoISQuZm4ubmVzdGFibGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIHVwZGF0ZU91dHB1dCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIGxpc3QgPSBlLmxlbmd0aCA/IGUgOiAkKGUudGFyZ2V0KSxcclxuICAgICAgICAgICAgICAgIG91dHB1dCA9IGxpc3QuZGF0YSgnb3V0cHV0Jyk7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuSlNPTikge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnZhbCh3aW5kb3cuSlNPTi5zdHJpbmdpZnkobGlzdC5uZXN0YWJsZSgnc2VyaWFsaXplJykpKTsgLy8sIG51bGwsIDIpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG91dHB1dC52YWwoJ0pTT04gYnJvd3NlciBzdXBwb3J0IHJlcXVpcmVkIGZvciB0aGlzIGRlbW8uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBhY3RpdmF0ZSBOZXN0YWJsZSBmb3IgbGlzdCAxXHJcbiAgICAgICAgJCgnI25lc3RhYmxlJykubmVzdGFibGUoe1xyXG4gICAgICAgICAgICAgICAgZ3JvdXA6IDFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCB1cGRhdGVPdXRwdXQpO1xyXG5cclxuICAgICAgICAvLyBhY3RpdmF0ZSBOZXN0YWJsZSBmb3IgbGlzdCAyXHJcbiAgICAgICAgJCgnI25lc3RhYmxlMicpLm5lc3RhYmxlKHtcclxuICAgICAgICAgICAgICAgIGdyb3VwOiAxXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywgdXBkYXRlT3V0cHV0KTtcclxuXHJcbiAgICAgICAgLy8gb3V0cHV0IGluaXRpYWwgc2VyaWFsaXNlZCBkYXRhXHJcbiAgICAgICAgdXBkYXRlT3V0cHV0KCQoJyNuZXN0YWJsZScpLmRhdGEoJ291dHB1dCcsICQoJyNuZXN0YWJsZS1vdXRwdXQnKSkpO1xyXG4gICAgICAgIHVwZGF0ZU91dHB1dCgkKCcjbmVzdGFibGUyJykuZGF0YSgnb3V0cHV0JywgJCgnI25lc3RhYmxlMi1vdXRwdXQnKSkpO1xyXG5cclxuICAgICAgICAkKCcuanMtbmVzdGFibGUtYWN0aW9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJChlLnRhcmdldCksXHJcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSB0YXJnZXQuZGF0YSgnYWN0aW9uJyk7XHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdleHBhbmQtYWxsJykge1xyXG4gICAgICAgICAgICAgICAgJCgnLmRkJykubmVzdGFibGUoJ2V4cGFuZEFsbCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdjb2xsYXBzZS1hbGwnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcuZGQnKS5uZXN0YWJsZSgnY29sbGFwc2VBbGwnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIE1vZHVsZTogbm90aWZ5LmpzXHJcbiAqIENyZWF0ZSB0b2dnbGVhYmxlIG5vdGlmaWNhdGlvbnMgdGhhdCBmYWRlIG91dCBhdXRvbWF0aWNhbGx5LlxyXG4gKiBCYXNlZCBvbiBOb3RpZnkgYWRkb24gZnJvbSBVSUtpdCAoaHR0cDovL2dldHVpa2l0LmNvbS9kb2NzL2FkZG9uc19ub3RpZnkuaHRtbClcclxuICogW2RhdGEtdG9nZ2xlPVwibm90aWZ5XCJdXHJcbiAqIFtkYXRhLW9wdGlvbnM9XCJvcHRpb25zIGluIGpzb24gZm9ybWF0XCIgXVxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXROb3RpZnkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXROb3RpZnkoKSB7XHJcblxyXG4gICAgICAgIHZhciBTZWxlY3RvciA9ICdbZGF0YS1ub3RpZnldJyxcclxuICAgICAgICAgICAgYXV0b2xvYWRTZWxlY3RvciA9ICdbZGF0YS1vbmxvYWRdJyxcclxuICAgICAgICAgICAgZG9jID0gJChkb2N1bWVudCk7XHJcblxyXG4gICAgICAgICQoU2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgb25sb2FkID0gJHRoaXMuZGF0YSgnb25sb2FkJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAob25sb2FkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm90aWZ5Tm93KCR0aGlzKTtcclxuICAgICAgICAgICAgICAgIH0sIDgwMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIG5vdGlmeU5vdygkdGhpcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbm90aWZ5Tm93KCRlbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAkZWxlbWVudC5kYXRhKCdtZXNzYWdlJyksXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkZWxlbWVudC5kYXRhKCdvcHRpb25zJyk7XHJcblxyXG4gICAgICAgIGlmICghbWVzc2FnZSlcclxuICAgICAgICAgICAgJC5lcnJvcignTm90aWZ5OiBObyBtZXNzYWdlIHNwZWNpZmllZCcpO1xyXG5cclxuICAgICAgICAkLm5vdGlmeShtZXNzYWdlLCBvcHRpb25zIHx8IHt9KTtcclxuICAgIH1cclxuXHJcblxyXG59KSgpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBOb3RpZnkgQWRkb24gZGVmaW5pdGlvbiBhcyBqUXVlcnkgcGx1Z2luXHJcbiAqIEFkYXB0ZWQgdmVyc2lvbiB0byB3b3JrIHdpdGggQm9vdHN0cmFwIGNsYXNzZXNcclxuICogTW9yZSBpbmZvcm1hdGlvbiBodHRwOi8vZ2V0dWlraXQuY29tL2RvY3MvYWRkb25zX25vdGlmeS5odG1sXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciBjb250YWluZXJzID0ge30sXHJcbiAgICAgICAgbWVzc2FnZXMgPSB7fSxcclxuXHJcbiAgICAgICAgbm90aWZ5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgaWYgKCQudHlwZShvcHRpb25zKSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHsgbWVzc2FnZTogb3B0aW9ucyB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzWzFdKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQob3B0aW9ucywgJC50eXBlKGFyZ3VtZW50c1sxXSkgPT0gJ3N0cmluZycgPyB7IHN0YXR1czogYXJndW1lbnRzWzFdIH0gOiBhcmd1bWVudHNbMV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKG5ldyBNZXNzYWdlKG9wdGlvbnMpKS5zaG93KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbG9zZUFsbCA9IGZ1bmN0aW9uKGdyb3VwLCBpbnN0YW50bHkpIHtcclxuICAgICAgICAgICAgaWYgKGdyb3VwKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpZCBpbiBtZXNzYWdlcykgeyBpZiAoZ3JvdXAgPT09IG1lc3NhZ2VzW2lkXS5ncm91cCkgbWVzc2FnZXNbaWRdLmNsb3NlKGluc3RhbnRseSk7IH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGlkIGluIG1lc3NhZ2VzKSB7IG1lc3NhZ2VzW2lkXS5jbG9zZShpbnN0YW50bHkpOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIHZhciBNZXNzYWdlID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgTWVzc2FnZS5kZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHRoaXMudXVpZCA9IFwiSURcIiArIChuZXcgRGF0ZSgpLmdldFRpbWUoKSkgKyBcIlJBTkRcIiArIChNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDEwMDAwMCkpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoW1xyXG4gICAgICAgICAgICAvLyBhbGVydC1kaXNtaXNzYWJsZSBlbmFibGVzIGJzIGNsb3NlIGljb25cclxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ1ay1ub3RpZnktbWVzc2FnZSBhbGVydC1kaXNtaXNzYWJsZVwiPicsXHJcbiAgICAgICAgICAgICc8YSBjbGFzcz1cImNsb3NlXCI+JnRpbWVzOzwvYT4nLFxyXG4gICAgICAgICAgICAnPGRpdj4nICsgdGhpcy5vcHRpb25zLm1lc3NhZ2UgKyAnPC9kaXY+JyxcclxuICAgICAgICAgICAgJzwvZGl2PidcclxuXHJcbiAgICAgICAgXS5qb2luKCcnKSkuZGF0YShcIm5vdGlmeU1lc3NhZ2VcIiwgdGhpcyk7XHJcblxyXG4gICAgICAgIC8vIHN0YXR1c1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcygnYWxlcnQgYWxlcnQtJyArIHRoaXMub3B0aW9ucy5zdGF0dXMpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRzdGF0dXMgPSB0aGlzLm9wdGlvbnMuc3RhdHVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5ncm91cCA9IHRoaXMub3B0aW9ucy5ncm91cDtcclxuXHJcbiAgICAgICAgbWVzc2FnZXNbdGhpcy51dWlkXSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICghY29udGFpbmVyc1t0aGlzLm9wdGlvbnMucG9zXSkge1xyXG4gICAgICAgICAgICBjb250YWluZXJzW3RoaXMub3B0aW9ucy5wb3NdID0gJCgnPGRpdiBjbGFzcz1cInVrLW5vdGlmeSB1ay1ub3RpZnktJyArIHRoaXMub3B0aW9ucy5wb3MgKyAnXCI+PC9kaXY+JykuYXBwZW5kVG8oJ2JvZHknKS5vbihcImNsaWNrXCIsIFwiLnVrLW5vdGlmeS1tZXNzYWdlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5kYXRhKFwibm90aWZ5TWVzc2FnZVwiKS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAkLmV4dGVuZChNZXNzYWdlLnByb3RvdHlwZSwge1xyXG5cclxuICAgICAgICB1dWlkOiBmYWxzZSxcclxuICAgICAgICBlbGVtZW50OiBmYWxzZSxcclxuICAgICAgICB0aW1vdXQ6IGZhbHNlLFxyXG4gICAgICAgIGN1cnJlbnRzdGF0dXM6IFwiXCIsXHJcbiAgICAgICAgZ3JvdXA6IGZhbHNlLFxyXG5cclxuICAgICAgICBzaG93OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuaXMoXCI6dmlzaWJsZVwiKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGNvbnRhaW5lcnNbdGhpcy5vcHRpb25zLnBvc10uc2hvdygpLnByZXBlbmQodGhpcy5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXJnaW5ib3R0b20gPSBwYXJzZUludCh0aGlzLmVsZW1lbnQuY3NzKFwibWFyZ2luLWJvdHRvbVwiKSwgMTApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7IFwib3BhY2l0eVwiOiAwLCBcIm1hcmdpbi10b3BcIjogLTEgKiB0aGlzLmVsZW1lbnQub3V0ZXJIZWlnaHQoKSwgXCJtYXJnaW4tYm90dG9tXCI6IDAgfSkuYW5pbWF0ZSh7IFwib3BhY2l0eVwiOiAxLCBcIm1hcmdpbi10b3BcIjogMCwgXCJtYXJnaW4tYm90dG9tXCI6IG1hcmdpbmJvdHRvbSB9LCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMub3B0aW9ucy50aW1lb3V0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9zZWZuID0gZnVuY3Rpb24oKSB7ICR0aGlzLmNsb3NlKCk7IH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsb3NlZm4sICR0aGlzLm9wdGlvbnMudGltZW91dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVsZW1lbnQuaG92ZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyBjbGVhclRpbWVvdXQoJHRoaXMudGltZW91dCk7IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyAkdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChjbG9zZWZuLCAkdGhpcy5vcHRpb25zLnRpbWVvdXQpOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKGluc3RhbnRseSkge1xyXG5cclxuICAgICAgICAgICAgdmFyICR0aGlzID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIGZpbmFsaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250YWluZXJzWyR0aGlzLm9wdGlvbnMucG9zXS5jaGlsZHJlbigpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJzWyR0aGlzLm9wdGlvbnMucG9zXS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWVzc2FnZXNbJHRoaXMudXVpZF07XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZW91dCkgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5zdGFudGx5KSB7XHJcbiAgICAgICAgICAgICAgICBmaW5hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFuaW1hdGUoeyBcIm9wYWNpdHlcIjogMCwgXCJtYXJnaW4tdG9wXCI6IC0xICogdGhpcy5lbGVtZW50Lm91dGVySGVpZ2h0KCksIFwibWFyZ2luLWJvdHRvbVwiOiAwIH0sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNvbnRlbnQ6IGZ1bmN0aW9uKGh0bWwpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmVsZW1lbnQuZmluZChcIj5kaXZcIik7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaHRtbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250YWluZXIuaHRtbChodG1sKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHN0YXR1czogZnVuY3Rpb24oc3RhdHVzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudHN0YXR1cztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCdhbGVydCBhbGVydC0nICsgdGhpcy5jdXJyZW50c3RhdHVzKS5hZGRDbGFzcygnYWxlcnQgYWxlcnQtJyArIHN0YXR1cyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRzdGF0dXMgPSBzdGF0dXM7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXNzYWdlLmRlZmF1bHRzID0ge1xyXG4gICAgICAgIG1lc3NhZ2U6IFwiXCIsXHJcbiAgICAgICAgc3RhdHVzOiBcIm5vcm1hbFwiLFxyXG4gICAgICAgIHRpbWVvdXQ6IDUwMDAsXHJcbiAgICAgICAgZ3JvdXA6IG51bGwsXHJcbiAgICAgICAgcG9zOiAndG9wLWNlbnRlcidcclxuICAgIH07XHJcblxyXG5cclxuICAgICRbXCJub3RpZnlcIl0gPSBub3RpZnk7XHJcbiAgICAkW1wibm90aWZ5XCJdLm1lc3NhZ2UgPSBNZXNzYWdlO1xyXG4gICAgJFtcIm5vdGlmeVwiXS5jbG9zZUFsbCA9IGNsb3NlQWxsO1xyXG5cclxuICAgIHJldHVybiBub3RpZnk7XHJcblxyXG59KCkpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IHBvcnRsZXQuanNcclxuICogRHJhZyBhbmQgZHJvcCBhbnkgY2FyZCB0byBjaGFuZ2UgaXRzIHBvc2l0aW9uXHJcbiAqIFRoZSBTZWxlY3RvciBzaG91bGQgY291bGQgYmUgYXBwbGllZCB0byBhbnkgb2JqZWN0IHRoYXQgY29udGFpbnNcclxuICogY2FyZCwgc28gLmNvbC0qIGVsZW1lbnQgYXJlIGlkZWFsLlxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgU1RPUkFHRV9LRVlfTkFNRSA9ICdqcS1wb3J0bGV0U3RhdGUnO1xyXG5cclxuICAgICQoaW5pdFBvcnRsZXRzKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0UG9ydGxldHMoKSB7XHJcblxyXG4gICAgICAgIC8vIENvbXBvbmVudCBpcyBOT1Qgb3B0aW9uYWxcclxuICAgICAgICBpZiAoISQuZm4uc29ydGFibGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIFNlbGVjdG9yID0gJ1tkYXRhLXRvZ2dsZT1cInBvcnRsZXRcIl0nO1xyXG5cclxuICAgICAgICAkKFNlbGVjdG9yKS5zb3J0YWJsZSh7XHJcbiAgICAgICAgICAgIGNvbm5lY3RXaXRoOiAgICAgICAgICBTZWxlY3RvcixcclxuICAgICAgICAgICAgaXRlbXM6ICAgICAgICAgICAgICAgICdkaXYuY2FyZCcsXHJcbiAgICAgICAgICAgIGhhbmRsZTogICAgICAgICAgICAgICAnLnBvcnRsZXQtaGFuZGxlcicsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6ICAgICAgICAgICAgICAwLjcsXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAgICAgICAgICAncG9ydGxldCBib3gtcGxhY2Vob2xkZXInLFxyXG4gICAgICAgICAgICBjYW5jZWw6ICAgICAgICAgICAgICAgJy5wb3J0bGV0LWNhbmNlbCcsXHJcbiAgICAgICAgICAgIGZvcmNlUGxhY2Vob2xkZXJTaXplOiB0cnVlLFxyXG4gICAgICAgICAgICBpZnJhbWVGaXg6ICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgIHRvbGVyYW5jZTogICAgICAgICAgICAncG9pbnRlcicsXHJcbiAgICAgICAgICAgIGhlbHBlcjogICAgICAgICAgICAgICAnb3JpZ2luYWwnLFxyXG4gICAgICAgICAgICByZXZlcnQ6ICAgICAgICAgICAgICAgMjAwLFxyXG4gICAgICAgICAgICBmb3JjZUhlbHBlclNpemU6ICAgICAgdHJ1ZSxcclxuICAgICAgICAgICAgdXBkYXRlOiAgICAgICAgICAgICAgIHNhdmVQb3J0bGV0T3JkZXIsXHJcbiAgICAgICAgICAgIGNyZWF0ZTogICAgICAgICAgICAgICBsb2FkUG9ydGxldE9yZGVyXHJcbiAgICAgICAgfSlcclxuICAgICAgICAvLyBvcHRpb25hbGx5IGRpc2FibGVzIG1vdXNlIHNlbGVjdGlvblxyXG4gICAgICAgIC8vLmRpc2FibGVTZWxlY3Rpb24oKVxyXG4gICAgICAgIDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2F2ZVBvcnRsZXRPcmRlcihldmVudCwgdWkpIHtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSBTdG9yYWdlcy5sb2NhbFN0b3JhZ2UuZ2V0KFNUT1JBR0VfS0VZX05BTUUpO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGEpIHsgZGF0YSA9IHt9OyB9XHJcblxyXG4gICAgICAgIGRhdGFbdGhpcy5pZF0gPSAkKHRoaXMpLnNvcnRhYmxlKCd0b0FycmF5Jyk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIFN0b3JhZ2VzLmxvY2FsU3RvcmFnZS5zZXQoU1RPUkFHRV9LRVlfTkFNRSwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkUG9ydGxldE9yZGVyKCkge1xyXG5cclxuICAgICAgICB2YXIgZGF0YSA9IFN0b3JhZ2VzLmxvY2FsU3RvcmFnZS5nZXQoU1RPUkFHRV9LRVlfTkFNRSk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgcG9ybGV0SWQgPSB0aGlzLmlkLFxyXG4gICAgICAgICAgICAgICAgY2FyZHMgPSBkYXRhW3BvcmxldElkXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYXJkcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcnRsZXQgPSAkKCcjJyArIHBvcmxldElkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goY2FyZHMsIGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyMnICsgdmFsdWUpLmFwcGVuZFRvKHBvcnRsZXQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXNldCBwb3JsZXQgc2F2ZSBzdGF0ZVxyXG4gICAgd2luZG93LnJlc2V0UG9ybGV0cyA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBTdG9yYWdlcy5sb2NhbFN0b3JhZ2UucmVtb3ZlKFNUT1JBR0VfS0VZX05BTUUpO1xyXG4gICAgICAgIC8vIHJlbG9hZCB0aGUgcGFnZVxyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gSFRNTDUgU29ydGFibGUgZGVtb1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdFNvcnRhYmxlKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0U29ydGFibGUoKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygc29ydGFibGUgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XHJcblxyXG4gICAgICAgIHNvcnRhYmxlKCcuc29ydGFibGUnLCB7XHJcbiAgICAgICAgICAgIGZvcmNlUGxhY2Vob2xkZXJTaXplOiB0cnVlLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJzxkaXYgY2xhc3M9XCJib3gtcGxhY2Vob2xkZXIgcDAgbTBcIj48ZGl2PjwvZGl2PjwvZGl2PidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIFN3ZWV0IEFsZXJ0XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0U3dlZXRBbGVydCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFN3ZWV0QWxlcnQoKSB7XHJcblxyXG4gICAgICAgICQoJyNzd2FsLWRlbW8xJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHN3YWwoXCJIZXJlJ3MgYSBtZXNzYWdlIVwiKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcjc3dhbC1kZW1vMicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBzd2FsKFwiSGVyZSdzIGEgbWVzc2FnZSFcIiwgXCJJdCdzIHByZXR0eSwgaXNuJ3QgaXQ/XCIpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJyNzd2FsLWRlbW8zJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHN3YWwoXCJHb29kIGpvYiFcIiwgXCJZb3UgY2xpY2tlZCB0aGUgYnV0dG9uIVwiLCBcInN1Y2Nlc3NcIilcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnI3N3YWwtZGVtbzQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0FyZSB5b3Ugc3VyZT8nLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogJ1lvdXIgd2lsbCBub3QgYmUgYWJsZSB0byByZWNvdmVyIHRoaXMgaW1hZ2luYXJ5IGZpbGUhJyxcclxuICAgICAgICAgICAgICAgIGljb246ICd3YXJuaW5nJyxcclxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBjYW5jZWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29uZmlybToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnWWVzLCBkZWxldGUgaXQhJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJiZy1kYW5nZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VNb2RhbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHN3YWwoJ0Jvb3lhaCEnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcjc3dhbC1kZW1vNScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQXJlIHlvdSBzdXJlPycsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAnWW91ciB3aWxsIG5vdCBiZSBhYmxlIHRvIHJlY292ZXIgdGhpcyBpbWFnaW5hcnkgZmlsZSEnLFxyXG4gICAgICAgICAgICAgICAgaWNvbjogJ3dhcm5pbmcnLFxyXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnTm8sIGNhbmNlbCBwbHghJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VNb2RhbDogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpcm06IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ1llcywgZGVsZXRlIGl0IScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYmctZGFuZ2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlTW9kYWw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKGlzQ29uZmlybSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzQ29uZmlybSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwoJ0RlbGV0ZWQhJywgJ1lvdXIgaW1hZ2luYXJ5IGZpbGUgaGFzIGJlZW4gZGVsZXRlZC4nLCAnc3VjY2VzcycpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzd2FsKCdDYW5jZWxsZWQnLCAnWW91ciBpbWFnaW5hcnkgZmlsZSBpcyBzYWZlIDopJywgJ2Vycm9yJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIEZ1bGwgQ2FsZW5kYXJcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgLy8gV2hlbiBkb20gcmVhZHksIGluaXQgY2FsZW5kYXIgYW5kIGV2ZW50c1xyXG4gICAgJChpbml0RnVsbENhbGVuZGFyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0RnVsbENhbGVuZGFyKCkge1xyXG5cclxuICAgICAgICBpZiAoISQuZm4uZnVsbENhbGVuZGFyKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIFRoZSBlbGVtZW50IHRoYXQgd2lsbCBkaXNwbGF5IHRoZSBjYWxlbmRhclxyXG4gICAgICAgIHZhciBjYWxlbmRhciA9ICQoJyNjYWxlbmRhcicpO1xyXG5cclxuICAgICAgICB2YXIgZGVtb0V2ZW50cyA9IGNyZWF0ZURlbW9FdmVudHMoKTtcclxuXHJcbiAgICAgICAgaW5pdEV4dGVybmFsRXZlbnRzKGNhbGVuZGFyKTtcclxuXHJcbiAgICAgICAgaW5pdENhbGVuZGFyKGNhbGVuZGFyLCBkZW1vRXZlbnRzKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIGdsb2JhbCBzaGFyZWQgdmFyIHRvIGtub3cgd2hhdCB3ZSBhcmUgZHJhZ2dpbmdcclxuICAgIHZhciBkcmFnZ2luZ0V2ZW50ID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4dGVybmFsRXZlbnQgb2JqZWN0XHJcbiAgICAgKiBAcGFyYW0galF1ZXJ5IE9iamVjdCBlbGVtZW50cyBTZXQgb2YgZWxlbWVudCBhcyBqUXVlcnkgb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICB2YXIgRXh0ZXJuYWxFdmVudCA9IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudHMpIHJldHVybjtcclxuXHJcbiAgICAgICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIGFuIEV2ZW50IE9iamVjdCAoaHR0cDovL2Fyc2hhdy5jb20vZnVsbGNhbGVuZGFyL2RvY3MvZXZlbnRfZGF0YS9FdmVudF9PYmplY3QvKVxyXG4gICAgICAgICAgICAvLyBpdCBkb2Vzbid0IG5lZWQgdG8gaGF2ZSBhIHN0YXJ0IG9yIGVuZFxyXG4gICAgICAgICAgICB2YXIgY2FsZW5kYXJFdmVudE9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAkLnRyaW0oJHRoaXMudGV4dCgpKSAvLyB1c2UgdGhlIGVsZW1lbnQncyB0ZXh0IGFzIHRoZSBldmVudCB0aXRsZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gc3RvcmUgdGhlIEV2ZW50IE9iamVjdCBpbiB0aGUgRE9NIGVsZW1lbnQgc28gd2UgY2FuIGdldCB0byBpdCBsYXRlclxyXG4gICAgICAgICAgICAkdGhpcy5kYXRhKCdjYWxlbmRhckV2ZW50T2JqZWN0JywgY2FsZW5kYXJFdmVudE9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICAvLyBtYWtlIHRoZSBldmVudCBkcmFnZ2FibGUgdXNpbmcgalF1ZXJ5IFVJXHJcbiAgICAgICAgICAgICR0aGlzLmRyYWdnYWJsZSh7XHJcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwNzAsXHJcbiAgICAgICAgICAgICAgICByZXZlcnQ6IHRydWUsIC8vIHdpbGwgY2F1c2UgdGhlIGV2ZW50IHRvIGdvIGJhY2sgdG8gaXRzXHJcbiAgICAgICAgICAgICAgICByZXZlcnREdXJhdGlvbjogMCAvLyAgb3JpZ2luYWwgcG9zaXRpb24gYWZ0ZXIgdGhlIGRyYWdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEludm9rZSBmdWxsIGNhbGVuZGFyIHBsdWdpbiBhbmQgYXR0YWNoIGJlaGF2aW9yXHJcbiAgICAgKiBAcGFyYW0gIGpRdWVyeSBbY2FsRWxlbWVudF0gVGhlIGNhbGVuZGFyIGRvbSBlbGVtZW50IHdyYXBwZWQgaW50byBqUXVlcnlcclxuICAgICAqIEBwYXJhbSAgRXZlbnRPYmplY3QgW2V2ZW50c10gQW4gb2JqZWN0IHdpdGggdGhlIGV2ZW50IGxpc3QgdG8gbG9hZCB3aGVuIHRoZSBjYWxlbmRhciBkaXNwbGF5c1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0Q2FsZW5kYXIoY2FsRWxlbWVudCwgZXZlbnRzKSB7XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIHRvIHJlbW92ZSBlbGVtZW50cyBmcm9tIHRoZSBsaXN0XHJcbiAgICAgICAgdmFyIHJlbW92ZUFmdGVyRHJvcCA9ICQoJyNyZW1vdmUtYWZ0ZXItZHJvcCcpO1xyXG5cclxuICAgICAgICBjYWxFbGVtZW50LmZ1bGxDYWxlbmRhcih7XHJcbiAgICAgICAgICAgIC8vIGlzUlRMOiB0cnVlLFxyXG4gICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICdwcmV2LG5leHQgdG9kYXknLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyOiAndGl0bGUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICdtb250aCxhZ2VuZGFXZWVrLGFnZW5kYURheSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYnV0dG9uSWNvbnM6IHsgLy8gbm90ZSB0aGUgc3BhY2UgYXQgdGhlIGJlZ2lubmluZ1xyXG4gICAgICAgICAgICAgICAgcHJldjogJyBmYSBmYS1jYXJldC1sZWZ0JyxcclxuICAgICAgICAgICAgICAgIG5leHQ6ICcgZmEgZmEtY2FyZXQtcmlnaHQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJ1dHRvblRleHQ6IHtcclxuICAgICAgICAgICAgICAgIHRvZGF5OiAndG9kYXknLFxyXG4gICAgICAgICAgICAgICAgbW9udGg6ICdtb250aCcsXHJcbiAgICAgICAgICAgICAgICB3ZWVrOiAnd2VlaycsXHJcbiAgICAgICAgICAgICAgICBkYXk6ICdkYXknXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBkcm9wcGFibGU6IHRydWUsIC8vIHRoaXMgYWxsb3dzIHRoaW5ncyB0byBiZSBkcm9wcGVkIG9udG8gdGhlIGNhbGVuZGFyXHJcbiAgICAgICAgICAgIGRyb3A6IGZ1bmN0aW9uKGRhdGUsIGFsbERheSkgeyAvLyB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHNvbWV0aGluZyBpcyBkcm9wcGVkXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICAvLyByZXRyaWV2ZSB0aGUgZHJvcHBlZCBlbGVtZW50J3Mgc3RvcmVkIEV2ZW50IE9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnRPYmplY3QgPSAkdGhpcy5kYXRhKCdjYWxlbmRhckV2ZW50T2JqZWN0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgc29tZXRoaW5nIHdlbnQgd3JvbmcsIGFib3J0XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9yaWdpbmFsRXZlbnRPYmplY3QpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjbG9uZSB0aGUgb2JqZWN0IHRvIGF2b2lkIG11bHRpcGxlIGV2ZW50cyB3aXRoIHJlZmVyZW5jZSB0byB0aGUgc2FtZSBvYmplY3RcclxuICAgICAgICAgICAgICAgIHZhciBjbG9uZWRFdmVudE9iamVjdCA9ICQuZXh0ZW5kKHt9LCBvcmlnaW5hbEV2ZW50T2JqZWN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBhc3NpZ24gdGhlIHJlcG9ydGVkIGRhdGVcclxuICAgICAgICAgICAgICAgIGNsb25lZEV2ZW50T2JqZWN0LnN0YXJ0ID0gZGF0ZTtcclxuICAgICAgICAgICAgICAgIGNsb25lZEV2ZW50T2JqZWN0LmFsbERheSA9IGFsbERheTtcclxuICAgICAgICAgICAgICAgIGNsb25lZEV2ZW50T2JqZWN0LmJhY2tncm91bmRDb2xvciA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1jb2xvcicpO1xyXG4gICAgICAgICAgICAgICAgY2xvbmVkRXZlbnRPYmplY3QuYm9yZGVyQ29sb3IgPSAkdGhpcy5jc3MoJ2JvcmRlci1jb2xvcicpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHJlbmRlciB0aGUgZXZlbnQgb24gdGhlIGNhbGVuZGFyXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgbGFzdCBgdHJ1ZWAgYXJndW1lbnQgZGV0ZXJtaW5lcyBpZiB0aGUgZXZlbnQgXCJzdGlja3NcIlxyXG4gICAgICAgICAgICAgICAgLy8gKGh0dHA6Ly9hcnNoYXcuY29tL2Z1bGxjYWxlbmRhci9kb2NzL2V2ZW50X3JlbmRlcmluZy9yZW5kZXJFdmVudC8pXHJcbiAgICAgICAgICAgICAgICBjYWxFbGVtZW50LmZ1bGxDYWxlbmRhcigncmVuZGVyRXZlbnQnLCBjbG9uZWRFdmVudE9iamVjdCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgbmVjZXNzYXJ5IHJlbW92ZSB0aGUgZWxlbWVudCBmcm9tIHRoZSBsaXN0XHJcbiAgICAgICAgICAgICAgICBpZiAocmVtb3ZlQWZ0ZXJEcm9wLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGV2ZW50RHJhZ1N0YXJ0OiBmdW5jdGlvbihldmVudCwganMsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ0V2ZW50ID0gZXZlbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIFRoaXMgYXJyYXkgaXMgdGhlIGV2ZW50cyBzb3VyY2VzXHJcbiAgICAgICAgICAgIGV2ZW50czogZXZlbnRzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0cyB0aGUgZXh0ZXJuYWwgZXZlbnRzIGNhcmRcclxuICAgICAqIEBwYXJhbSAgalF1ZXJ5IFtjYWxFbGVtZW50XSBUaGUgY2FsZW5kYXIgZG9tIGVsZW1lbnQgd3JhcHBlZCBpbnRvIGpRdWVyeVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbml0RXh0ZXJuYWxFdmVudHMoY2FsRWxlbWVudCkge1xyXG4gICAgICAgIC8vIENhcmQgd2l0aCB0aGUgZXh0ZXJuYWwgZXZlbnRzIGxpc3RcclxuICAgICAgICB2YXIgZXh0ZXJuYWxFdmVudHMgPSAkKCcuZXh0ZXJuYWwtZXZlbnRzJyk7XHJcblxyXG4gICAgICAgIC8vIGluaXQgdGhlIGV4dGVybmFsIGV2ZW50cyBpbiB0aGUgY2FyZFxyXG4gICAgICAgIG5ldyBFeHRlcm5hbEV2ZW50KGV4dGVybmFsRXZlbnRzLmNoaWxkcmVuKCdkaXYnKSk7XHJcblxyXG4gICAgICAgIC8vIEV4dGVybmFsIGV2ZW50IGNvbG9yIGlzIGRhbmdlci1yZWQgYnkgZGVmYXVsdFxyXG4gICAgICAgIHZhciBjdXJyQ29sb3IgPSAnI2Y2NTA0ZCc7XHJcbiAgICAgICAgLy8gQ29sb3Igc2VsZWN0b3IgYnV0dG9uXHJcbiAgICAgICAgdmFyIGV2ZW50QWRkQnRuID0gJCgnLmV4dGVybmFsLWV2ZW50LWFkZC1idG4nKTtcclxuICAgICAgICAvLyBOZXcgZXh0ZXJuYWwgZXZlbnQgbmFtZSBpbnB1dFxyXG4gICAgICAgIHZhciBldmVudE5hbWVJbnB1dCA9ICQoJy5leHRlcm5hbC1ldmVudC1uYW1lJyk7XHJcbiAgICAgICAgLy8gQ29sb3Igc3dpdGNoZXJzXHJcbiAgICAgICAgdmFyIGV2ZW50Q29sb3JTZWxlY3RvciA9ICQoJy5leHRlcm5hbC1ldmVudC1jb2xvci1zZWxlY3RvciAuY2lyY2xlJyk7XHJcblxyXG4gICAgICAgIC8vIFRyYXNoIGV2ZW50cyBEcm9wYXJlYVxyXG4gICAgICAgICQoJy5leHRlcm5hbC1ldmVudHMtdHJhc2gnKS5kcm9wcGFibGUoe1xyXG4gICAgICAgICAgICBhY2NlcHQ6ICcuZmMtZXZlbnQnLFxyXG4gICAgICAgICAgICBhY3RpdmVDbGFzczogJ2FjdGl2ZScsXHJcbiAgICAgICAgICAgIGhvdmVyQ2xhc3M6ICdob3ZlcmVkJyxcclxuICAgICAgICAgICAgdG9sZXJhbmNlOiAndG91Y2gnLFxyXG4gICAgICAgICAgICBkcm9wOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBZb3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIHRvIHNlbmQgYW4gYWpheCByZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICAvLyB0byByZW1vdmUgdGhlIGV2ZW50IGZyb20gdGhlIHJlcG9zaXRvcnlcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZHJhZ2dpbmdFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlaWQgPSBkcmFnZ2luZ0V2ZW50LmlkIHx8IGRyYWdnaW5nRXZlbnQuX2lkO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZXZlbnRcclxuICAgICAgICAgICAgICAgICAgICBjYWxFbGVtZW50LmZ1bGxDYWxlbmRhcigncmVtb3ZlRXZlbnRzJywgZWlkKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGRvbSBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgdWkuZHJhZ2dhYmxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNsZWFyXHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dpbmdFdmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZXZlbnRDb2xvclNlbGVjdG9yLmNsaWNrKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2F2ZSBjb2xvclxyXG4gICAgICAgICAgICBjdXJyQ29sb3IgPSAkdGhpcy5jc3MoJ2JhY2tncm91bmQtY29sb3InKTtcclxuICAgICAgICAgICAgLy8gRGUtc2VsZWN0IGFsbCBhbmQgc2VsZWN0IHRoZSBjdXJyZW50IG9uZVxyXG4gICAgICAgICAgICBldmVudENvbG9yU2VsZWN0b3IucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBldmVudEFkZEJ0bi5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCBldmVudCBuYW1lIGZyb20gaW5wdXRcclxuICAgICAgICAgICAgdmFyIHZhbCA9IGV2ZW50TmFtZUlucHV0LnZhbCgpO1xyXG4gICAgICAgICAgICAvLyBEb250IGFsbG93IGVtcHR5IHZhbHVlc1xyXG4gICAgICAgICAgICBpZiAoJC50cmltKHZhbCkgPT09ICcnKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGV2ZW50IGVsZW1lbnRcclxuICAgICAgICAgICAgdmFyIG5ld0V2ZW50ID0gJCgnPGRpdi8+JykuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6IGN1cnJDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAnYm9yZGVyLWNvbG9yJzogY3VyckNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcic6ICcjZmZmJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5odG1sKHZhbCk7XHJcblxyXG4gICAgICAgICAgICAvLyBQcmVwZW5kcyB0byB0aGUgZXh0ZXJuYWwgZXZlbnRzIGxpc3RcclxuICAgICAgICAgICAgZXh0ZXJuYWxFdmVudHMucHJlcGVuZChuZXdFdmVudCk7XHJcbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgdGhlIG5ldyBldmVudCBlbGVtZW50XHJcbiAgICAgICAgICAgIG5ldyBFeHRlcm5hbEV2ZW50KG5ld0V2ZW50KTtcclxuICAgICAgICAgICAgLy8gQ2xlYXIgaW5wdXRcclxuICAgICAgICAgICAgZXZlbnROYW1lSW5wdXQudmFsKCcnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgZXZlbnRzIHRvIGRpc3BsYXkgaW4gdGhlIGZpcnN0IGxvYWQgb2YgdGhlIGNhbGVuZGFyXHJcbiAgICAgKiBXcmFwIGludG8gdGhpcyBmdW5jdGlvbiBhIHJlcXVlc3QgdG8gYSBzb3VyY2UgdG8gZ2V0IHZpYSBhamF4IHRoZSBzdG9yZWQgZXZlbnRzXHJcbiAgICAgKiBAcmV0dXJuIEFycmF5IFRoZSBhcnJheSB3aXRoIHRoZSBldmVudHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY3JlYXRlRGVtb0V2ZW50cygpIHtcclxuICAgICAgICAvLyBEYXRlIGZvciB0aGUgY2FsZW5kYXIgZXZlbnRzIChkdW1teSBkYXRhKVxyXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB2YXIgZCA9IGRhdGUuZ2V0RGF0ZSgpLFxyXG4gICAgICAgICAgICBtID0gZGF0ZS5nZXRNb250aCgpLFxyXG4gICAgICAgICAgICB5ID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG5cclxuICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgICAgdGl0bGU6ICdBbGwgRGF5IEV2ZW50JyxcclxuICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIDEpLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjU2OTU0JywgLy9yZWRcclxuICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZjU2OTU0JyAvL3JlZFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdMb25nIEV2ZW50JyxcclxuICAgICAgICAgICAgc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgLSA1KSxcclxuICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCBkIC0gMiksXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmMzljMTInLCAvL3llbGxvd1xyXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogJyNmMzljMTInIC8veWVsbG93XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICB0aXRsZTogJ01lZXRpbmcnLFxyXG4gICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCwgMTAsIDMwKSxcclxuICAgICAgICAgICAgYWxsRGF5OiBmYWxzZSxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzAwNzNiNycsIC8vQmx1ZVxyXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogJyMwMDczYjcnIC8vQmx1ZVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdMdW5jaCcsXHJcbiAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkLCAxMiwgMCksXHJcbiAgICAgICAgICAgIGVuZDogbmV3IERhdGUoeSwgbSwgZCwgMTQsIDApLFxyXG4gICAgICAgICAgICBhbGxEYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDBjMGVmJywgLy9JbmZvIChhcXVhKVxyXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogJyMwMGMwZWYnIC8vSW5mbyAoYXF1YSlcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnQmlydGhkYXkgUGFydHknLFxyXG4gICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDEsIDE5LCAwKSxcclxuICAgICAgICAgICAgZW5kOiBuZXcgRGF0ZSh5LCBtLCBkICsgMSwgMjIsIDMwKSxcclxuICAgICAgICAgICAgYWxsRGF5OiBmYWxzZSxcclxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzAwYTY1YScsIC8vU3VjY2VzcyAoZ3JlZW4pXHJcbiAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnIzAwYTY1YScgLy9TdWNjZXNzIChncmVlbilcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnT3BlbiBHb29nbGUnLFxyXG4gICAgICAgICAgICBzdGFydDogbmV3IERhdGUoeSwgbSwgMjgpLFxyXG4gICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIDI5KSxcclxuICAgICAgICAgICAgdXJsOiAnLy9nb29nbGUuY29tLycsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMzYzhkYmMnLCAvL1ByaW1hcnkgKGxpZ2h0LWJsdWUpXHJcbiAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnIzNjOGRiYycgLy9QcmltYXJ5IChsaWdodC1ibHVlKVxyXG4gICAgICAgIH1dO1xyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBKUUNsb3VkXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdFdvcmRDbG91ZCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFdvcmRDbG91ZCgpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmZuLmpRQ2xvdWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYW4gYXJyYXkgb2Ygd29yZCBvYmplY3RzLCBlYWNoIHJlcHJlc2VudGluZyBhIHdvcmQgaW4gdGhlIGNsb3VkXHJcbiAgICAgICAgdmFyIHdvcmRfYXJyYXkgPSBbXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ0xvcmVtJywgd2VpZ2h0OiAxMywgLypsaW5rOiAnaHR0cDovL3RoZW1pY29uLmNvJyovIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ0lwc3VtJywgd2VpZ2h0OiAxMC41IH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ0RvbG9yJywgd2VpZ2h0OiA5LjQgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnU2l0Jywgd2VpZ2h0OiA4IH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ0FtZXQnLCB3ZWlnaHQ6IDYuMiB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdDb25zZWN0ZXR1cicsIHdlaWdodDogNSB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdBZGlwaXNjaW5nJywgd2VpZ2h0OiA1IH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ1NpdCcsIHdlaWdodDogOCB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdBbWV0Jywgd2VpZ2h0OiA2LjIgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnQ29uc2VjdGV0dXInLCB3ZWlnaHQ6IDUgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnQWRpcGlzY2luZycsIHdlaWdodDogNSB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgJChcIiNqcWNsb3VkXCIpLmpRQ2xvdWQod29yZF9hcnJheSwge1xyXG4gICAgICAgICAgICB3aWR0aDogMjQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcclxuICAgICAgICAgICAgc3RlcHM6IDdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIFNlYXJjaCBSZXN1bHRzXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdFNlYXJjaCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFNlYXJjaCgpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmZuLnNsaWRlcikgcmV0dXJuO1xyXG4gICAgICAgIGlmICghJC5mbi5jaG9zZW4pIHJldHVybjtcclxuICAgICAgICBpZiAoISQuZm4uZGF0ZXBpY2tlcikgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBCT09UU1RSQVAgU0xJREVSIENUUkxcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAkKCdbZGF0YS11aS1zbGlkZXJdJykuc2xpZGVyKCk7XHJcblxyXG4gICAgICAgIC8vIENIT1NFTlxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICQoJy5jaG9zZW4tc2VsZWN0JykuY2hvc2VuKCk7XHJcblxyXG4gICAgICAgIC8vIERBVEVUSU1FUElDS0VSXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgJCgnI2RhdGV0aW1lcGlja2VyJykuZGF0ZXBpY2tlcih7XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgaWNvbnM6IHtcclxuICAgICAgICAgICAgICAgIHRpbWU6ICdmYSBmYS1jbG9jay1vJyxcclxuICAgICAgICAgICAgICAgIGRhdGU6ICdmYSBmYS1jYWxlbmRhcicsXHJcbiAgICAgICAgICAgICAgICB1cDogJ2ZhIGZhLWNoZXZyb24tdXAnLFxyXG4gICAgICAgICAgICAgICAgZG93bjogJ2ZhIGZhLWNoZXZyb24tZG93bicsXHJcbiAgICAgICAgICAgICAgICBwcmV2aW91czogJ2ZhIGZhLWNoZXZyb24tbGVmdCcsXHJcbiAgICAgICAgICAgICAgICBuZXh0OiAnZmEgZmEtY2hldnJvbi1yaWdodCcsXHJcbiAgICAgICAgICAgICAgICB0b2RheTogJ2ZhIGZhLWNyb3NzaGFpcnMnLFxyXG4gICAgICAgICAgICAgICAgY2xlYXI6ICdmYSBmYS10cmFzaCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gQ29sb3IgcGlja2VyXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0Q29sb3JQaWNrZXIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRDb2xvclBpY2tlcigpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmZuLmNvbG9ycGlja2VyKSByZXR1cm47XHJcblxyXG4gICAgICAgICQoJy5kZW1vLWNvbG9ycGlja2VyJykuY29sb3JwaWNrZXIoKTtcclxuXHJcbiAgICAgICAgJCgnI2RlbW9fc2VsZWN0b3JzJykuY29sb3JwaWNrZXIoe1xyXG4gICAgICAgICAgICBjb2xvclNlbGVjdG9yczoge1xyXG4gICAgICAgICAgICAgICAgJ2RlZmF1bHQnOiAnIzc3Nzc3NycsXHJcbiAgICAgICAgICAgICAgICAncHJpbWFyeSc6IEFQUF9DT0xPUlNbJ3ByaW1hcnknXSxcclxuICAgICAgICAgICAgICAgICdzdWNjZXNzJzogQVBQX0NPTE9SU1snc3VjY2VzcyddLFxyXG4gICAgICAgICAgICAgICAgJ2luZm8nOiBBUFBfQ09MT1JTWydpbmZvJ10sXHJcbiAgICAgICAgICAgICAgICAnd2FybmluZyc6IEFQUF9DT0xPUlNbJ3dhcm5pbmcnXSxcclxuICAgICAgICAgICAgICAgICdkYW5nZXInOiBBUFBfQ09MT1JTWydkYW5nZXInXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBGb3JtcyBEZW1vXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdEZvcm1zRGVtbyk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEZvcm1zRGVtbygpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmZuLnNsaWRlcikgcmV0dXJuO1xyXG4gICAgICAgIGlmICghJC5mbi5jaG9zZW4pIHJldHVybjtcclxuICAgICAgICBpZiAoISQuZm4uaW5wdXRtYXNrKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCEkLmZuLmZpbGVzdHlsZSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICghJC5mbi53eXNpd3lnKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCEkLmZuLmRhdGVwaWNrZXIpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gQk9PVFNUUkFQIFNMSURFUiBDVFJMXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgJCgnW2RhdGEtdWktc2xpZGVyXScpLnNsaWRlcigpO1xyXG5cclxuICAgICAgICAvLyBDSE9TRU5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAkKCcuY2hvc2VuLXNlbGVjdCcpLmNob3NlbigpO1xyXG5cclxuICAgICAgICAvLyBNQVNLRURcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAkKCdbZGF0YS1tYXNrZWRdJykuaW5wdXRtYXNrKCk7XHJcblxyXG4gICAgICAgIC8vIEZJTEVTVFlMRVxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICQoJy5maWxlc3R5bGUnKS5maWxlc3R5bGUoKTtcclxuXHJcbiAgICAgICAgLy8gV1lTSVdZR1xyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICQoJy53eXNpd3lnJykud3lzaXd5ZygpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gREFURVRJTUVQSUNLRVJcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAkKCcjZGF0ZXRpbWVwaWNrZXIxJykuZGF0ZXBpY2tlcih7XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgaWNvbnM6IHtcclxuICAgICAgICAgICAgICAgIHRpbWU6ICdmYSBmYS1jbG9jay1vJyxcclxuICAgICAgICAgICAgICAgIGRhdGU6ICdmYSBmYS1jYWxlbmRhcicsXHJcbiAgICAgICAgICAgICAgICB1cDogJ2ZhIGZhLWNoZXZyb24tdXAnLFxyXG4gICAgICAgICAgICAgICAgZG93bjogJ2ZhIGZhLWNoZXZyb24tZG93bicsXHJcbiAgICAgICAgICAgICAgICBwcmV2aW91czogJ2ZhIGZhLWNoZXZyb24tbGVmdCcsXHJcbiAgICAgICAgICAgICAgICBuZXh0OiAnZmEgZmEtY2hldnJvbi1yaWdodCcsXHJcbiAgICAgICAgICAgICAgICB0b2RheTogJ2ZhIGZhLWNyb3NzaGFpcnMnLFxyXG4gICAgICAgICAgICAgICAgY2xlYXI6ICdmYSBmYS10cmFzaCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIG9ubHkgdGltZVxyXG4gICAgICAgICQoJyNkYXRldGltZXBpY2tlcjInKS5kYXRlcGlja2VyKHtcclxuICAgICAgICAgICAgZm9ybWF0OiAnbW0tZGQteXl5eSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IEltYWdlIENyb3BwZXJcclxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0SW1hZ2VDcm9wcGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0SW1hZ2VDcm9wcGVyKCkge1xyXG5cclxuICAgICAgICBpZiAoISQuZm4uY3JvcHBlcikgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgJGltYWdlID0gJCgnLmltZy1jb250YWluZXIgPiBpbWcnKSxcclxuICAgICAgICAgICAgJGRhdGFYID0gJCgnI2RhdGFYJyksXHJcbiAgICAgICAgICAgICRkYXRhWSA9ICQoJyNkYXRhWScpLFxyXG4gICAgICAgICAgICAkZGF0YUhlaWdodCA9ICQoJyNkYXRhSGVpZ2h0JyksXHJcbiAgICAgICAgICAgICRkYXRhV2lkdGggPSAkKCcjZGF0YVdpZHRoJyksXHJcbiAgICAgICAgICAgICRkYXRhUm90YXRlID0gJCgnI2RhdGFSb3RhdGUnKSxcclxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIC8vIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgeDogNDIwLFxyXG4gICAgICAgICAgICAgICAgLy8gICB5OiA2MCxcclxuICAgICAgICAgICAgICAgIC8vICAgd2lkdGg6IDY0MCxcclxuICAgICAgICAgICAgICAgIC8vICAgaGVpZ2h0OiAzNjBcclxuICAgICAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBzdHJpY3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gcmVzcG9uc2l2ZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBjaGVja0ltYWdlT3JpZ2luOiBmYWxzZVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1vZGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIGd1aWRlczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gYmFja2dyb3VuZDogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gYXV0b0Nyb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gYXV0b0Nyb3BBcmVhOiAwLjUsXHJcbiAgICAgICAgICAgICAgICAvLyBkcmFnQ3JvcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBtb3ZhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIHJvdGF0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyB6b29tYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyB0b3VjaERyYWdab29tOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIG1vdXNlV2hlZWxab29tOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIGNyb3BCb3hNb3ZhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vIGNyb3BCb3hSZXNpemFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gZG91YmxlQ2xpY2tUb2dnbGU6IGZhbHNlLFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIG1pbkNhbnZhc1dpZHRoOiAzMjAsXHJcbiAgICAgICAgICAgICAgICAvLyBtaW5DYW52YXNIZWlnaHQ6IDE4MCxcclxuICAgICAgICAgICAgICAgIC8vIG1pbkNyb3BCb3hXaWR0aDogMTYwLFxyXG4gICAgICAgICAgICAgICAgLy8gbWluQ3JvcEJveEhlaWdodDogOTAsXHJcbiAgICAgICAgICAgICAgICAvLyBtaW5Db250YWluZXJXaWR0aDogMzIwLFxyXG4gICAgICAgICAgICAgICAgLy8gbWluQ29udGFpbmVySGVpZ2h0OiAxODAsXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gYnVpbGQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAvLyBidWlsdDogbnVsbCxcclxuICAgICAgICAgICAgICAgIC8vIGRyYWdzdGFydDogbnVsbCxcclxuICAgICAgICAgICAgICAgIC8vIGRyYWdtb3ZlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgLy8gZHJhZ2VuZDogbnVsbCxcclxuICAgICAgICAgICAgICAgIC8vIHpvb21pbjogbnVsbCxcclxuICAgICAgICAgICAgICAgIC8vIHpvb21vdXQ6IG51bGwsXHJcblxyXG4gICAgICAgICAgICAgICAgYXNwZWN0UmF0aW86IDE2IC8gOSxcclxuICAgICAgICAgICAgICAgIHByZXZpZXc6ICcuaW1nLXByZXZpZXcnLFxyXG4gICAgICAgICAgICAgICAgY3JvcDogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRkYXRhWC52YWwoTWF0aC5yb3VuZChkYXRhLngpKTtcclxuICAgICAgICAgICAgICAgICAgICAkZGF0YVkudmFsKE1hdGgucm91bmQoZGF0YS55KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGRhdGFIZWlnaHQudmFsKE1hdGgucm91bmQoZGF0YS5oZWlnaHQpKTtcclxuICAgICAgICAgICAgICAgICAgICAkZGF0YVdpZHRoLnZhbChNYXRoLnJvdW5kKGRhdGEud2lkdGgpKTtcclxuICAgICAgICAgICAgICAgICAgICAkZGF0YVJvdGF0ZS52YWwoTWF0aC5yb3VuZChkYXRhLnJvdGF0ZSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAkaW1hZ2Uub24oe1xyXG4gICAgICAgICAgICAnYnVpbGQuY3JvcHBlcic6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdidWlsdC5jcm9wcGVyJzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2RyYWdzdGFydC5jcm9wcGVyJzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50eXBlLCBlLmRyYWdUeXBlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2RyYWdtb3ZlLmNyb3BwZXInOiBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlLnR5cGUsIGUuZHJhZ1R5cGUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZHJhZ2VuZC5jcm9wcGVyJzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50eXBlLCBlLmRyYWdUeXBlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3pvb21pbi5jcm9wcGVyJzogZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS50eXBlKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ3pvb21vdXQuY3JvcHBlcic6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICdjaGFuZ2UuY3JvcHBlcic6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUudHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5jcm9wcGVyKG9wdGlvbnMpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gTWV0aG9kc1xyXG4gICAgICAgICQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgJ1tkYXRhLW1ldGhvZF0nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoKSxcclxuICAgICAgICAgICAgICAgICR0YXJnZXQsXHJcbiAgICAgICAgICAgICAgICByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRpbWFnZS5kYXRhKCdjcm9wcGVyJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGEubWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gJC5leHRlbmQoe30sIGRhdGEpOyAvLyBDbG9uZSBhIG5ldyBvbmVcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEudGFyZ2V0ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICR0YXJnZXQgPSAkKGRhdGEudGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLm9wdGlvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEub3B0aW9uID0gSlNPTi5wYXJzZSgkdGFyZ2V0LnZhbCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAkaW1hZ2UuY3JvcHBlcihkYXRhLm1ldGhvZCwgZGF0YS5vcHRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLm1ldGhvZCA9PT0gJ2dldENyb3BwZWRDYW52YXMnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2dldENyb3BwZWRDYW52YXNNb2RhbCcpLm1vZGFsKCkuZmluZCgnLm1vZGFsLWJvZHknKS5odG1sKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdChyZXN1bHQpICYmICR0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0LnZhbChKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLm9uKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkaW1hZ2UuZGF0YSgnY3JvcHBlcicpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoZS53aGljaCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzNzpcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGltYWdlLmNyb3BwZXIoJ21vdmUnLCAtMSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGltYWdlLmNyb3BwZXIoJ21vdmUnLCAwLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAzOTpcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJGltYWdlLmNyb3BwZXIoJ21vdmUnLCAxLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAkaW1hZ2UuY3JvcHBlcignbW92ZScsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gSW1wb3J0IGltYWdlXHJcbiAgICAgICAgdmFyICRpbnB1dEltYWdlID0gJCgnI2lucHV0SW1hZ2UnKSxcclxuICAgICAgICAgICAgVVJMID0gd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMLFxyXG4gICAgICAgICAgICBibG9iVVJMO1xyXG5cclxuICAgICAgICBpZiAoVVJMKSB7XHJcbiAgICAgICAgICAgICRpbnB1dEltYWdlLmNoYW5nZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmaWxlcyA9IHRoaXMuZmlsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoISRpbWFnZS5kYXRhKCdjcm9wcGVyJykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGVzICYmIGZpbGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGUgPSBmaWxlc1swXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eaW1hZ2VcXC9cXHcrJC8udGVzdChmaWxlLnR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2JVUkwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW1hZ2Uub25lKCdidWlsdC5jcm9wcGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGJsb2JVUkwpOyAvLyBSZXZva2Ugd2hlbiBsb2FkIGNvbXBsZXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNyb3BwZXIoJ3Jlc2V0JykuY3JvcHBlcigncmVwbGFjZScsIGJsb2JVUkwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXRJbWFnZS52YWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGVhc2UgY2hvb3NlIGFuIGltYWdlIGZpbGUuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkaW5wdXRJbWFnZS5wYXJlbnQoKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvLyBPcHRpb25zXHJcbiAgICAgICAgJCgnLmRvY3Mtb3B0aW9ucyA6Y2hlY2tib3gnKS5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRpbWFnZS5kYXRhKCdjcm9wcGVyJykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb3B0aW9uc1skdGhpcy52YWwoKV0gPSAkdGhpcy5wcm9wKCdjaGVja2VkJyk7XHJcbiAgICAgICAgICAgICRpbWFnZS5jcm9wcGVyKCdkZXN0cm95JykuY3JvcHBlcihvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vIFRvb2x0aXBzXHJcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIFNlbGVjdDJcclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRTZWxlY3QyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbml0U2VsZWN0MigpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmZuLnNlbGVjdDIpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gU2VsZWN0IDJcclxuXHJcbiAgICAgICAgJCgnI3NlbGVjdDItMScpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgICB0aGVtZTogJ2Jvb3RzdHJhcDQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnI3NlbGVjdDItMicpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgICB0aGVtZTogJ2Jvb3RzdHJhcDQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnI3NlbGVjdDItMycpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgICB0aGVtZTogJ2Jvb3RzdHJhcDQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnI3NlbGVjdDItNCcpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJ1NlbGVjdCBhIHN0YXRlJyxcclxuICAgICAgICAgICAgYWxsb3dDbGVhcjogdHJ1ZSxcclxuICAgICAgICAgICAgdGhlbWU6ICdib290c3RyYXA0J1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGlmICh0eXBlb2YgRHJvcHpvbmUgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XHJcblxyXG4gICAgLy8gUHJldmVudCBEcm9wem9uZSBmcm9tIGF1dG8gZGlzY292ZXJpbmdcclxuICAgIC8vIFRoaXMgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gY3JlYXRlIHRoZVxyXG4gICAgLy8gRHJvcHpvbmUgcHJvZ3JhbW1hdGljYWxseSBsYXRlclxyXG4gICAgRHJvcHpvbmUuYXV0b0Rpc2NvdmVyID0gZmFsc2U7XHJcblxyXG4gICAgJChpbml0RHJvcHpvbmUpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXREcm9wem9uZSgpIHtcclxuXHJcbiAgICAgICAgLy8gRHJvcHpvbmUgc2V0dGluZ3NcclxuICAgICAgICB2YXIgZHJvcHpvbmVPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiBmYWxzZSxcclxuICAgICAgICAgICAgdXBsb2FkTXVsdGlwbGU6IHRydWUsXHJcbiAgICAgICAgICAgIHBhcmFsbGVsVXBsb2FkczogMTAwLFxyXG4gICAgICAgICAgICBtYXhGaWxlczogMTAwLFxyXG4gICAgICAgICAgICBkaWN0RGVmYXVsdE1lc3NhZ2U6ICc8ZW0gY2xhc3M9XCJmYSBmYS11cGxvYWQgdGV4dC1tdXRlZFwiPjwvZW0+PGJyPkRyb3AgZmlsZXMgaGVyZSB0byB1cGxvYWQnLCAvLyBkZWZhdWx0IG1lc3NhZ2VzIGJlZm9yZSBmaXJzdCBkcm9wXHJcbiAgICAgICAgICAgIHBhcmFtTmFtZTogJ2ZpbGUnLCAvLyBUaGUgbmFtZSB0aGF0IHdpbGwgYmUgdXNlZCB0byB0cmFuc2ZlciB0aGUgZmlsZVxyXG4gICAgICAgICAgICBtYXhGaWxlc2l6ZTogMiwgLy8gTUJcclxuICAgICAgICAgICAgYWRkUmVtb3ZlTGlua3M6IHRydWUsXHJcbiAgICAgICAgICAgIGFjY2VwdDogZnVuY3Rpb24oZmlsZSwgZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZpbGUubmFtZSA9PT0gJ2p1c3RpbmJpZWJlci5qcGcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgnTmFoYSwgeW91IGRvbnQuIDopJyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZHpIYW5kbGVyID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uW3R5cGU9c3VibWl0XScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGR6SGFuZGxlci5wcm9jZXNzUXVldWUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbignYWRkZWRmaWxlJywgZnVuY3Rpb24oZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBZGRlZCBmaWxlOiAnICsgZmlsZS5uYW1lKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbigncmVtb3ZlZGZpbGUnLCBmdW5jdGlvbihmaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlbW92ZWQgZmlsZTogJyArIGZpbGUubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMub24oJ3NlbmRpbmdtdWx0aXBsZScsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbignc3VjY2Vzc211bHRpcGxlJywgZnVuY3Rpb24oIC8qZmlsZXMsIHJlc3BvbnNlKi8gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKCdlcnJvcm11bHRpcGxlJywgZnVuY3Rpb24oIC8qZmlsZXMsIHJlc3BvbnNlKi8gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGRyb3B6b25lQXJlYSA9IG5ldyBEcm9wem9uZSgnI2Ryb3B6b25lLWFyZWEnLCBkcm9wem9uZU9wdGlvbnMpO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gRm9ybXMgRGVtb1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRXaXphcmQpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRXaXphcmQoKSB7XHJcblxyXG4gICAgICAgIGlmICghJC5mbi52YWxpZGF0ZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBGT1JNIEVYQU1QTEVcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHZhciBmb3JtID0gJChcIiNleGFtcGxlLWZvcm1cIik7XHJcbiAgICAgICAgZm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgICAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbiBlcnJvclBsYWNlbWVudChlcnJvciwgZWxlbWVudCkgeyBlbGVtZW50LmJlZm9yZShlcnJvcik7IH0sXHJcbiAgICAgICAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgICAgICAgICBjb25maXJtOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXF1YWxUbzogXCIjcGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZm9ybS5jaGlsZHJlbihcImRpdlwiKS5zdGVwcyh7XHJcbiAgICAgICAgICAgIGhlYWRlclRhZzogXCJoNFwiLFxyXG4gICAgICAgICAgICBib2R5VGFnOiBcImZpZWxkc2V0XCIsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25FZmZlY3Q6IFwic2xpZGVMZWZ0XCIsXHJcbiAgICAgICAgICAgIG9uU3RlcENoYW5naW5nOiBmdW5jdGlvbihldmVudCwgY3VycmVudEluZGV4LCBuZXdJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgZm9ybS52YWxpZGF0ZSgpLnNldHRpbmdzLmlnbm9yZSA9IFwiOmRpc2FibGVkLDpoaWRkZW5cIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtLnZhbGlkKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRmluaXNoaW5nOiBmdW5jdGlvbihldmVudCwgY3VycmVudEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBmb3JtLnZhbGlkYXRlKCkuc2V0dGluZ3MuaWdub3JlID0gXCI6ZGlzYWJsZWRcIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtLnZhbGlkKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uRmluaXNoZWQ6IGZ1bmN0aW9uKGV2ZW50LCBjdXJyZW50SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiU3VibWl0dGVkIVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdWJtaXQgZm9ybVxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5zdWJtaXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBWRVJUSUNBTFxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgICAgICQoXCIjZXhhbXBsZS12ZXJ0aWNhbFwiKS5zdGVwcyh7XHJcbiAgICAgICAgICAgIGhlYWRlclRhZzogXCJoNFwiLFxyXG4gICAgICAgICAgICBib2R5VGFnOiBcInNlY3Rpb25cIixcclxuICAgICAgICAgICAgdHJhbnNpdGlvbkVmZmVjdDogXCJzbGlkZUxlZnRcIixcclxuICAgICAgICAgICAgc3RlcHNPcmllbnRhdGlvbjogXCJ2ZXJ0aWNhbFwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBYZWRpdGFibGUgRGVtb1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdFhFZGl0YWJsZSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFhFZGl0YWJsZSgpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmZuLmVkaXRhYmxlKSByZXR1cm5cclxuXHJcbiAgICAgICAgLy8gRm9udCBBd2Vzb21lIHN1cHBvcnRcclxuICAgICAgICAkLmZuLmVkaXRhYmxlZm9ybS5idXR0b25zID1cclxuICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBlZGl0YWJsZS1zdWJtaXRcIj4nICtcclxuICAgICAgICAgICAgJzxpIGNsYXNzPVwiZmEgZmEtZncgZmEtY2hlY2tcIj48L2k+JyArXHJcbiAgICAgICAgICAgICc8L2J1dHRvbj4nICtcclxuICAgICAgICAgICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSBlZGl0YWJsZS1jYW5jZWxcIj4nICtcclxuICAgICAgICAgICAgJzxpIGNsYXNzPVwiZmEgZmEtZncgZmEtdGltZXNcIj48L2k+JyArXHJcbiAgICAgICAgICAgICc8L2J1dHRvbj4nO1xyXG5cclxuICAgICAgICAvL2RlZmF1bHRzXHJcbiAgICAgICAgLy8kLmZuLmVkaXRhYmxlLmRlZmF1bHRzLnVybCA9ICd1cmwvdG8vc2VydmVyJztcclxuXHJcbiAgICAgICAgLy9lbmFibGUgLyBkaXNhYmxlXHJcbiAgICAgICAgJCgnI2VuYWJsZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcjdXNlciAuZWRpdGFibGUnKS5lZGl0YWJsZSgndG9nZ2xlRGlzYWJsZWQnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9lZGl0YWJsZXNcclxuICAgICAgICAkKCcjdXNlcm5hbWUnKS5lZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIC8vIHVybDogJ3VybC90by9zZXJ2ZXInLFxyXG4gICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgIHBrOiAxLFxyXG4gICAgICAgICAgICBuYW1lOiAndXNlcm5hbWUnLFxyXG4gICAgICAgICAgICB0aXRsZTogJ0VudGVyIHVzZXJuYW1lJyxcclxuICAgICAgICAgICAgbW9kZTogJ2lubGluZSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnI2ZpcnN0bmFtZScpLmVkaXRhYmxlKHtcclxuICAgICAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJC50cmltKHZhbHVlKSA9PT0gJycpIHJldHVybiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCc7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1vZGU6ICdpbmxpbmUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJyNzZXgnKS5lZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIHByZXBlbmQ6IFwibm90IHNlbGVjdGVkXCIsXHJcbiAgICAgICAgICAgIHNvdXJjZTogW1xyXG4gICAgICAgICAgICAgICAgeyB2YWx1ZTogMSwgdGV4dDogJ01hbGUnIH0sXHJcbiAgICAgICAgICAgICAgICB7IHZhbHVlOiAyLCB0ZXh0OiAnRmVtYWxlJyB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZ1bmN0aW9uKHZhbHVlLCBzb3VyY2VEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29sb3JzID0geyBcIlwiOiBcImdyYXlcIiwgMTogXCJncmVlblwiLCAyOiBcImJsdWVcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0gPSAkLmdyZXAoc291cmNlRGF0YSwgZnVuY3Rpb24obykgeyByZXR1cm4gby52YWx1ZSA9PSB2YWx1ZTsgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50ZXh0KGVsZW1bMF0udGV4dCkuY3NzKFwiY29sb3JcIiwgY29sb3JzW3ZhbHVlXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbW9kZTogJ2lubGluZSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnI3N0YXR1cycpLmVkaXRhYmxlKHtcclxuICAgICAgICAgICAgbW9kZTogJ2lubGluZSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnI2dyb3VwJykuZWRpdGFibGUoe1xyXG4gICAgICAgICAgICBzaG93YnV0dG9uczogZmFsc2UsXHJcbiAgICAgICAgICAgIG1vZGU6ICdpbmxpbmUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJyNkb2InKS5lZGl0YWJsZSh7XHJcbiAgICAgICAgICAgIG1vZGU6ICdpbmxpbmUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJyNldmVudCcpLmVkaXRhYmxlKHtcclxuICAgICAgICAgICAgcGxhY2VtZW50OiAncmlnaHQnLFxyXG4gICAgICAgICAgICBjb21ib2RhdGU6IHtcclxuICAgICAgICAgICAgICAgIGZpcnN0SXRlbTogJ25hbWUnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1vZGU6ICdpbmxpbmUnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJyNjb21tZW50cycpLmVkaXRhYmxlKHtcclxuICAgICAgICAgICAgc2hvd2J1dHRvbnM6ICdib3R0b20nLFxyXG4gICAgICAgICAgICBtb2RlOiAnaW5saW5lJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcjbm90ZScpLmVkaXRhYmxlKHtcclxuICAgICAgICAgICAgbW9kZTogJ2lubGluZSdcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcjcGVuY2lsJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJyNub3RlJykuZWRpdGFibGUoJ3RvZ2dsZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcjdXNlciAuZWRpdGFibGUnKS5vbignaGlkZGVuJywgZnVuY3Rpb24oZSwgcmVhc29uKSB7XHJcbiAgICAgICAgICAgIGlmIChyZWFzb24gPT09ICdzYXZlJyB8fCByZWFzb24gPT09ICdub2NoYW5nZScpIHtcclxuICAgICAgICAgICAgICAgIHZhciAkbmV4dCA9ICQodGhpcykuY2xvc2VzdCgndHInKS5uZXh0KCkuZmluZCgnLmVkaXRhYmxlJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2F1dG9vcGVuJykuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbmV4dC5lZGl0YWJsZSgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVEFCTEVcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgICAgICAkKCcjdXNlcnMgYScpLmVkaXRhYmxlKHtcclxuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxyXG4gICAgICAgICAgICBuYW1lOiAndXNlcm5hbWUnLFxyXG4gICAgICAgICAgICB0aXRsZTogJ0VudGVyIHVzZXJuYW1lJyxcclxuICAgICAgICAgICAgbW9kZTogJ2lubGluZSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8qKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBNb2R1bGU6IGdtYXAuanNcclxuICogSW5pdCBHb29nbGUgTWFwIHBsdWdpblxyXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAkKGluaXRHb29nbGVNYXBzKTtcclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBNYXAgU3R5bGUgZGVmaW5pdGlvblxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gR2V0IG1vcmUgc3R5bGVzIGZyb20gaHR0cDovL3NuYXp6eW1hcHMuY29tL3N0eWxlLzI5L2xpZ2h0LW1vbm9jaHJvbWVcclxuICAgIC8vIC0gSnVzdCByZXBsYWNlIGFuZCBhc3NpZ24gdG8gJ01hcFN0eWxlcycgdGhlIG5ldyBzdHlsZSBhcnJheVxyXG4gICAgdmFyIE1hcFN0eWxlcyA9IFt7IGZlYXR1cmVUeXBlOiAnd2F0ZXInLCBzdHlsZXJzOiBbeyB2aXNpYmlsaXR5OiAnb24nIH0sIHsgY29sb3I6ICcjYmRkMWY5JyB9XSB9LCB7IGZlYXR1cmVUeXBlOiAnYWxsJywgZWxlbWVudFR5cGU6ICdsYWJlbHMudGV4dC5maWxsJywgc3R5bGVyczogW3sgY29sb3I6ICcjMzM0MTY1JyB9XSB9LCB7IGZlYXR1cmVUeXBlOiAnbGFuZHNjYXBlJywgc3R5bGVyczogW3sgY29sb3I6ICcjZTllYmYxJyB9XSB9LCB7IGZlYXR1cmVUeXBlOiAncm9hZC5oaWdod2F5JywgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsIHN0eWxlcnM6IFt7IGNvbG9yOiAnI2M1YzZjNicgfV0gfSwgeyBmZWF0dXJlVHlwZTogJ3JvYWQuYXJ0ZXJpYWwnLCBlbGVtZW50VHlwZTogJ2dlb21ldHJ5Jywgc3R5bGVyczogW3sgY29sb3I6ICcjZmZmJyB9XSB9LCB7IGZlYXR1cmVUeXBlOiAncm9hZC5sb2NhbCcsIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLCBzdHlsZXJzOiBbeyBjb2xvcjogJyNmZmYnIH1dIH0sIHsgZmVhdHVyZVR5cGU6ICd0cmFuc2l0JywgZWxlbWVudFR5cGU6ICdnZW9tZXRyeScsIHN0eWxlcnM6IFt7IGNvbG9yOiAnI2Q4ZGJlMCcgfV0gfSwgeyBmZWF0dXJlVHlwZTogJ3BvaScsIGVsZW1lbnRUeXBlOiAnZ2VvbWV0cnknLCBzdHlsZXJzOiBbeyBjb2xvcjogJyNjZmQ1ZTAnIH1dIH0sIHsgZmVhdHVyZVR5cGU6ICdhZG1pbmlzdHJhdGl2ZScsIHN0eWxlcnM6IFt7IHZpc2liaWxpdHk6ICdvbicgfSwgeyBsaWdodG5lc3M6IDMzIH1dIH0sIHsgZmVhdHVyZVR5cGU6ICdwb2kucGFyaycsIGVsZW1lbnRUeXBlOiAnbGFiZWxzJywgc3R5bGVyczogW3sgdmlzaWJpbGl0eTogJ29uJyB9LCB7IGxpZ2h0bmVzczogMjAgfV0gfSwgeyBmZWF0dXJlVHlwZTogJ3JvYWQnLCBzdHlsZXJzOiBbeyBjb2xvcjogJyNkOGRiZTAnLCBsaWdodG5lc3M6IDIwIH1dIH1dO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0R29vZ2xlTWFwcygpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmZuLmdNYXApIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIG1hcFNlbGVjdG9yID0gJ1tkYXRhLWdtYXBdJztcclxuICAgICAgICB2YXIgZ01hcFJlZnMgPSBbXTtcclxuXHJcbiAgICAgICAgJChtYXBTZWxlY3RvcikuZWFjaChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICBhZGRyZXNzZXMgPSAkdGhpcy5kYXRhKCdhZGRyZXNzJykgJiYgJHRoaXMuZGF0YSgnYWRkcmVzcycpLnNwbGl0KCc7JyksXHJcbiAgICAgICAgICAgICAgICB0aXRsZXMgPSAkdGhpcy5kYXRhKCd0aXRsZScpICYmICR0aGlzLmRhdGEoJ3RpdGxlJykuc3BsaXQoJzsnKSxcclxuICAgICAgICAgICAgICAgIHpvb20gPSAkdGhpcy5kYXRhKCd6b29tJykgfHwgMTQsXHJcbiAgICAgICAgICAgICAgICBtYXB0eXBlID0gJHRoaXMuZGF0YSgnbWFwdHlwZScpIHx8ICdST0FETUFQJywgLy8gb3IgJ1RFUlJBSU4nXHJcbiAgICAgICAgICAgICAgICBtYXJrZXJzID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAoYWRkcmVzc2VzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhIGluIGFkZHJlc3Nlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYWRkcmVzc2VzW2FdID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBhZGRyZXNzZXNbYV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBodG1sOiAodGl0bGVzICYmIHRpdGxlc1thXSkgfHwgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3B1cDogdHJ1ZSAvKiBBbHdheXMgcG9wdXAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhbkNvbnRyb2w6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVDb250cm9sOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJlZXRWaWV3Q29udHJvbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcnZpZXdNYXBDb250cm9sOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFwdHlwZTogbWFwdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJrZXJzOiBtYXJrZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIHpvb206IHpvb21cclxuICAgICAgICAgICAgICAgICAgICAvLyBNb3JlIG9wdGlvbnMgaHR0cHM6Ly9naXRodWIuY29tL21hcmlvZXN0cmFkYS9qUXVlcnktZ01hcFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZ01hcCA9ICR0aGlzLmdNYXAob3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHJlZiA9IGdNYXAuZGF0YSgnZ01hcC5yZWZlcmVuY2UnKTtcclxuICAgICAgICAgICAgICAgIC8vIHNhdmUgaW4gdGhlIG1hcCByZWZlcmVuY2VzIGxpc3RcclxuICAgICAgICAgICAgICAgIGdNYXBSZWZzLnB1c2gocmVmKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIHN0eWxlc1xyXG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLmRhdGEoJ3N0eWxlZCcpICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVmLnNldE9wdGlvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXM6IE1hcFN0eWxlc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTsgLy9lYWNoXHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBqVmVjdG9yTWFwXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdFZlY3Rvck1hcCk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdFZlY3Rvck1hcCgpIHtcclxuXHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSAkKCdbZGF0YS12ZWN0b3ItbWFwXScpO1xyXG5cclxuICAgICAgICB2YXIgc2VyaWVzRGF0YSA9IHtcclxuICAgICAgICAgICAgJ0NBJzogMTExMDAsIC8vIENhbmFkYVxyXG4gICAgICAgICAgICAnREUnOiAyNTEwLCAvLyBHZXJtYW55XHJcbiAgICAgICAgICAgICdGUic6IDM3MTAsIC8vIEZyYW5jZVxyXG4gICAgICAgICAgICAnQVUnOiA1NzEwLCAvLyBBdXN0cmFsaWFcclxuICAgICAgICAgICAgJ0dCJzogODMxMCwgLy8gR3JlYXQgQnJpdGFpblxyXG4gICAgICAgICAgICAnUlUnOiA5MzEwLCAvLyBSdXNzaWFcclxuICAgICAgICAgICAgJ0JSJzogNjYxMCwgLy8gQnJhemlsXHJcbiAgICAgICAgICAgICdJTic6IDc4MTAsIC8vIEluZGlhXHJcbiAgICAgICAgICAgICdDTic6IDQzMTAsIC8vIENoaW5hXHJcbiAgICAgICAgICAgICdVUyc6IDgzOSwgLy8gVVNBXHJcbiAgICAgICAgICAgICdTQSc6IDQxMCAvLyBTYXVkaSBBcmFiaWFcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgbWFya2Vyc0RhdGEgPSBbXHJcbiAgICAgICAgICAgIHsgbGF0TG5nOiBbNDEuOTAsIDEyLjQ1XSwgbmFtZTogJ1ZhdGljYW4gQ2l0eScgfSxcclxuICAgICAgICAgICAgeyBsYXRMbmc6IFs0My43MywgNy40MV0sIG5hbWU6ICdNb25hY28nIH0sXHJcbiAgICAgICAgICAgIHsgbGF0TG5nOiBbLTAuNTIsIDE2Ni45M10sIG5hbWU6ICdOYXVydScgfSxcclxuICAgICAgICAgICAgeyBsYXRMbmc6IFstOC41MSwgMTc5LjIxXSwgbmFtZTogJ1R1dmFsdScgfSxcclxuICAgICAgICAgICAgeyBsYXRMbmc6IFs3LjExLCAxNzEuMDZdLCBuYW1lOiAnTWFyc2hhbGwgSXNsYW5kcycgfSxcclxuICAgICAgICAgICAgeyBsYXRMbmc6IFsxNy4zLCAtNjIuNzNdLCBuYW1lOiAnU2FpbnQgS2l0dHMgYW5kIE5ldmlzJyB9LFxyXG4gICAgICAgICAgICB7IGxhdExuZzogWzMuMiwgNzMuMjJdLCBuYW1lOiAnTWFsZGl2ZXMnIH0sXHJcbiAgICAgICAgICAgIHsgbGF0TG5nOiBbMzUuODgsIDE0LjVdLCBuYW1lOiAnTWFsdGEnIH0sXHJcbiAgICAgICAgICAgIHsgbGF0TG5nOiBbNDEuMCwgLTcxLjA2XSwgbmFtZTogJ05ldyBFbmdsYW5kJyB9LFxyXG4gICAgICAgICAgICB7IGxhdExuZzogWzEyLjA1LCAtNjEuNzVdLCBuYW1lOiAnR3JlbmFkYScgfSxcclxuICAgICAgICAgICAgeyBsYXRMbmc6IFsxMy4xNiwgLTU5LjU1XSwgbmFtZTogJ0JhcmJhZG9zJyB9LFxyXG4gICAgICAgICAgICB7IGxhdExuZzogWzE3LjExLCAtNjEuODVdLCBuYW1lOiAnQW50aWd1YSBhbmQgQmFyYnVkYScgfSxcclxuICAgICAgICAgICAgeyBsYXRMbmc6IFstNC42MSwgNTUuNDVdLCBuYW1lOiAnU2V5Y2hlbGxlcycgfSxcclxuICAgICAgICAgICAgeyBsYXRMbmc6IFs3LjM1LCAxMzQuNDZdLCBuYW1lOiAnUGFsYXUnIH0sXHJcbiAgICAgICAgICAgIHsgbGF0TG5nOiBbNDIuNSwgMS41MV0sIG5hbWU6ICdBbmRvcnJhJyB9XHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgbmV3IFZlY3Rvck1hcChlbGVtZW50LCBzZXJpZXNEYXRhLCBtYXJrZXJzRGF0YSk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBKVkVDVE9SIE1BUFxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8vIEFsbG93IEdsb2JhbCBhY2Nlc3NcclxuICAgIHdpbmRvdy5WZWN0b3JNYXAgPSBWZWN0b3JNYXBcclxuXHJcbiAgICB2YXIgZGVmYXVsdENvbG9ycyA9IHtcclxuICAgICAgICBtYXJrZXJDb2xvcjogJyMyM2I3ZTUnLCAvLyB0aGUgbWFya2VyIHBvaW50c1xyXG4gICAgICAgIGJnQ29sb3I6ICd0cmFuc3BhcmVudCcsIC8vIHRoZSBiYWNrZ3JvdW5kXHJcbiAgICAgICAgc2NhbGVDb2xvcnM6IFsnIzg3OGM5YSddLCAvLyB0aGUgY29sb3Igb2YgdGhlIHJlZ2lvbiBpbiB0aGUgc2VyaWVcclxuICAgICAgICByZWdpb25GaWxsOiAnI2JiYmVjNicgLy8gdGhlIGJhc2UgcmVnaW9uIGNvbG9yXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIFZlY3Rvck1hcChlbGVtZW50LCBzZXJpZXNEYXRhLCBtYXJrZXJzRGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciBhdHRycyA9IGVsZW1lbnQuZGF0YSgpLFxyXG4gICAgICAgICAgICBtYXBIZWlnaHQgPSBhdHRycy5oZWlnaHQgfHwgJzMwMCcsXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBtYXJrZXJDb2xvcjogYXR0cnMubWFya2VyQ29sb3IgfHwgZGVmYXVsdENvbG9ycy5tYXJrZXJDb2xvcixcclxuICAgICAgICAgICAgICAgIGJnQ29sb3I6IGF0dHJzLmJnQ29sb3IgfHwgZGVmYXVsdENvbG9ycy5iZ0NvbG9yLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IGF0dHJzLnNjYWxlIHx8IDEsXHJcbiAgICAgICAgICAgICAgICBzY2FsZUNvbG9yczogYXR0cnMuc2NhbGVDb2xvcnMgfHwgZGVmYXVsdENvbG9ycy5zY2FsZUNvbG9ycyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbkZpbGw6IGF0dHJzLnJlZ2lvbkZpbGwgfHwgZGVmYXVsdENvbG9ycy5yZWdpb25GaWxsLFxyXG4gICAgICAgICAgICAgICAgbWFwTmFtZTogYXR0cnMubWFwTmFtZSB8fCAnd29ybGRfbWlsbF9lbidcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5jc3MoJ2hlaWdodCcsIG1hcEhlaWdodCk7XHJcblxyXG4gICAgICAgIGluaXQoZWxlbWVudCwgb3B0aW9ucywgc2VyaWVzRGF0YSwgbWFya2Vyc0RhdGEpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCRlbGVtZW50LCBvcHRzLCBzZXJpZXMsIG1hcmtlcnMpIHtcclxuXHJcbiAgICAgICAgICAgICRlbGVtZW50LnZlY3Rvck1hcCh7XHJcbiAgICAgICAgICAgICAgICBtYXA6IG9wdHMubWFwTmFtZSxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogb3B0cy5iZ0NvbG9yLFxyXG4gICAgICAgICAgICAgICAgem9vbU1pbjogMSxcclxuICAgICAgICAgICAgICAgIHpvb21NYXg6IDgsXHJcbiAgICAgICAgICAgICAgICB6b29tT25TY3JvbGw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdmaWxsJzogb3B0cy5yZWdpb25GaWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZmlsbC1vcGFjaXR5JzogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9rZSc6ICdub25lJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IDEuNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9rZS1vcGFjaXR5JzogMVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaG92ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ZpbGwtb3BhY2l0eSc6IDAuOFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogJ2JsdWUnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEhvdmVyOiB7fVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZvY3VzT246IHsgeDogMC40LCB5OiAwLjYsIHNjYWxlOiBvcHRzLnNjYWxlIH0sXHJcbiAgICAgICAgICAgICAgICBtYXJrZXJTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogb3B0cy5tYXJrZXJDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBvcHRzLm1hcmtlckNvbG9yXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG9uUmVnaW9uTGFiZWxTaG93OiBmdW5jdGlvbihlLCBlbCwgY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXJpZXMgJiYgc2VyaWVzW2NvZGVdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5odG1sKGVsLmh0bWwoKSArICc6ICcgKyBzZXJpZXNbY29kZV0gKyAnIHZpc2l0b3JzJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWFya2VyczogbWFya2VycyxcclxuICAgICAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbnM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlczogc2VyaWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogb3B0cy5zY2FsZUNvbG9ycyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplRnVuY3Rpb246ICdwb2x5bm9taWFsJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSAvLyBlbmQgaW5pdFxyXG4gICAgfTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIFVzZWQgZm9yIHVzZXIgcGFnZXNcclxuICogTG9naW4gYW5kIFJlZ2lzdGVyXHJcbiAqL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0UGFyc2xleUZvclBhZ2VzKVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRQYXJzbGV5Rm9yUGFnZXMoKSB7XHJcblxyXG4gICAgICAgIC8vIFBhcnNsZXkgb3B0aW9ucyBzZXR1cCBmb3IgYm9vdHN0cmFwIHZhbGlkYXRpb24gY2xhc3Nlc1xyXG4gICAgICAgIHZhciBwYXJzbGV5T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgZXJyb3JDbGFzczogJ2lzLWludmFsaWQnLFxyXG4gICAgICAgICAgICBzdWNjZXNzQ2xhc3M6ICdpcy12YWxpZCcsXHJcbiAgICAgICAgICAgIGNsYXNzSGFuZGxlcjogZnVuY3Rpb24oUGFyc2xleUZpZWxkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWwgPSBQYXJzbGV5RmllbGQuJGVsZW1lbnQucGFyZW50cygnLmZvcm0tZ3JvdXAnKS5maW5kKCdpbnB1dCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFlbC5sZW5ndGgpIC8vIHN1cHBvcnQgY3VzdG9tIGNoZWNrYm94XHJcbiAgICAgICAgICAgICAgICAgICAgZWwgPSBQYXJzbGV5RmllbGQuJGVsZW1lbnQucGFyZW50cygnLmMtY2hlY2tib3gnKS5maW5kKCdsYWJlbCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcnNDb250YWluZXI6IGZ1bmN0aW9uKFBhcnNsZXlGaWVsZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBhcnNsZXlGaWVsZC4kZWxlbWVudC5wYXJlbnRzKCcuZm9ybS1ncm91cCcpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcnNXcmFwcGVyOiAnPGRpdiBjbGFzcz1cInRleHQtaGVscFwiPicsXHJcbiAgICAgICAgICAgIGVycm9yVGVtcGxhdGU6ICc8ZGl2PjwvZGl2PidcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBMb2dpbiBmb3JtIHZhbGlkYXRpb24gd2l0aCBQYXJzbGV5XHJcbiAgICAgICAgdmFyIGxvZ2luRm9ybSA9ICQoXCIjbG9naW5Gb3JtXCIpO1xyXG4gICAgICAgIGlmIChsb2dpbkZvcm0ubGVuZ3RoKVxyXG4gICAgICAgICAgICBsb2dpbkZvcm0ucGFyc2xleShwYXJzbGV5T3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIFJlZ2lzdGVyIGZvcm0gdmFsaWRhdGlvbiB3aXRoIFBhcnNsZXlcclxuICAgICAgICB2YXIgcmVnaXN0ZXJGb3JtID0gJChcIiNyZWdpc3RlckZvcm1cIik7XHJcbiAgICAgICAgaWYgKHJlZ2lzdGVyRm9ybS5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJlZ2lzdGVyRm9ybS5wYXJzbGV5KHBhcnNsZXlPcHRpb25zKTtcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyIsIi8vIEJPT1RHUklEXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgJChpbml0Qm9vdGdyaWQpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRCb290Z3JpZCgpIHtcclxuXHJcbiAgICAgICAgaWYgKCEkLmZuLmJvb3RncmlkKSByZXR1cm47XHJcblxyXG4gICAgICAgICQoJyNib290Z3JpZC1iYXNpYycpLmJvb3RncmlkKHtcclxuICAgICAgICAgICAgdGVtcGxhdGVzOiB7XHJcbiAgICAgICAgICAgICAgICAvLyB0ZW1wbGF0ZXMgZm9yIEJTNFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uQnV0dG9uOiAnPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgdHlwZT1cImJ1dHRvblwiIHRpdGxlPVwie3tjdHgudGV4dH19XCI+e3tjdHguY29udGVudH19PC9idXR0b24+JyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkRyb3BEb3duOiAnPGRpdiBjbGFzcz1cInt7Y3NzLmRyb3BEb3duTWVudX19XCI+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGRyb3Bkb3duLXRvZ2dsZSBkcm9wZG93bi10b2dnbGUtbm9jYXJldFwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+PHNwYW4gY2xhc3M9XCJ7e2Nzcy5kcm9wRG93bk1lbnVUZXh0fX1cIj57e2N0eC5jb250ZW50fX08L3NwYW4+PC9idXR0b24+PHVsIGNsYXNzPVwie3tjc3MuZHJvcERvd25NZW51SXRlbXN9fVwiIHJvbGU9XCJtZW51XCI+PC91bD48L2Rpdj4nLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uRHJvcERvd25JdGVtOiAnPGxpIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiPjxhIGhyZWY9XCJcIiBkYXRhLWFjdGlvbj1cInt7Y3R4LmFjdGlvbn19XCIgY2xhc3M9XCJkcm9wZG93bi1saW5rIHt7Y3NzLmRyb3BEb3duSXRlbUJ1dHRvbn19XCI+e3tjdHgudGV4dH19PC9hPjwvbGk+JyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkRyb3BEb3duQ2hlY2tib3hJdGVtOiAnPGxpIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiPjxsYWJlbCBjbGFzcz1cImRyb3Bkb3duLWl0ZW0gcC0wXCI+PGlucHV0IG5hbWU9XCJ7e2N0eC5uYW1lfX1cIiB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cIjFcIiBjbGFzcz1cInt7Y3NzLmRyb3BEb3duSXRlbUNoZWNrYm94fX1cIiB7e2N0eC5jaGVja2VkfX0gLz4ge3tjdHgubGFiZWx9fTwvbGFiZWw+PC9saT4nLFxyXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbkl0ZW06ICc8bGkgY2xhc3M9XCJwYWdlLWl0ZW0ge3tjdHguY3NzfX1cIj48YSBocmVmPVwiXCIgZGF0YS1wYWdlPVwie3tjdHgucGFnZX19XCIgY2xhc3M9XCJwYWdlLWxpbmsge3tjc3MucGFnaW5hdGlvbkJ1dHRvbn19XCI+e3tjdHgudGV4dH19PC9hPjwvbGk+JyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcjYm9vdGdyaWQtc2VsZWN0aW9uJykuYm9vdGdyaWQoe1xyXG4gICAgICAgICAgICBzZWxlY3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgIG11bHRpU2VsZWN0OiB0cnVlLFxyXG4gICAgICAgICAgICByb3dTZWxlY3Q6IHRydWUsXHJcbiAgICAgICAgICAgIGtlZXBTZWxlY3Rpb246IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlczoge1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2hlY2tib3ggYy1jaGVja2JveFwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwibWItMFwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwie3tjdHgudHlwZX19XCIgY2xhc3M9XCJ7e2Nzcy5zZWxlY3RCb3h9fVwiIHZhbHVlPVwie3tjdHgudmFsdWV9fVwiIHt7Y3R4LmNoZWNrZWR9fT4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9sYWJlbD4nK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxyXG4gICAgICAgICAgICAgICAgLy8gdGVtcGxhdGVzIGZvciBCUzRcclxuICAgICAgICAgICAgICAgIGFjdGlvbkJ1dHRvbjogJzxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIHR5cGU9XCJidXR0b25cIiB0aXRsZT1cInt7Y3R4LnRleHR9fVwiPnt7Y3R4LmNvbnRlbnR9fTwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25Ecm9wRG93bjogJzxkaXYgY2xhc3M9XCJ7e2Nzcy5kcm9wRG93bk1lbnV9fVwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBkcm9wZG93bi10b2dnbGUgZHJvcGRvd24tdG9nZ2xlLW5vY2FyZXRcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiPjxzcGFuIGNsYXNzPVwie3tjc3MuZHJvcERvd25NZW51VGV4dH19XCI+e3tjdHguY29udGVudH19PC9zcGFuPjwvYnV0dG9uPjx1bCBjbGFzcz1cInt7Y3NzLmRyb3BEb3duTWVudUl0ZW1zfX1cIiByb2xlPVwibWVudVwiPjwvdWw+PC9kaXY+JyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkRyb3BEb3duSXRlbTogJzxsaSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIj48YSBocmVmPVwiXCIgZGF0YS1hY3Rpb249XCJ7e2N0eC5hY3Rpb259fVwiIGNsYXNzPVwiZHJvcGRvd24tbGluayB7e2Nzcy5kcm9wRG93bkl0ZW1CdXR0b259fVwiPnt7Y3R4LnRleHR9fTwvYT48L2xpPicsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25Ecm9wRG93bkNoZWNrYm94SXRlbTogJzxsaSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIj48bGFiZWwgY2xhc3M9XCJkcm9wZG93bi1pdGVtIHAtMFwiPjxpbnB1dCBuYW1lPVwie3tjdHgubmFtZX19XCIgdHlwZT1cImNoZWNrYm94XCIgdmFsdWU9XCIxXCIgY2xhc3M9XCJ7e2Nzcy5kcm9wRG93bkl0ZW1DaGVja2JveH19XCIge3tjdHguY2hlY2tlZH19IC8+IHt7Y3R4LmxhYmVsfX08L2xhYmVsPjwvbGk+JyxcclxuICAgICAgICAgICAgICAgIHBhZ2luYXRpb25JdGVtOiAnPGxpIGNsYXNzPVwicGFnZS1pdGVtIHt7Y3R4LmNzc319XCI+PGEgaHJlZj1cIlwiIGRhdGEtcGFnZT1cInt7Y3R4LnBhZ2V9fVwiIGNsYXNzPVwicGFnZS1saW5rIHt7Y3NzLnBhZ2luYXRpb25CdXR0b259fVwiPnt7Y3R4LnRleHR9fTwvYT48L2xpPicsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGdyaWQgPSAkKCcjYm9vdGdyaWQtY29tbWFuZCcpLmJvb3RncmlkKHtcclxuICAgICAgICAgICAgZm9ybWF0dGVyczoge1xyXG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IGZ1bmN0aW9uKGNvbHVtbiwgcm93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc20gYnRuLWluZm8gbXItMiBjb21tYW5kLWVkaXRcIiBkYXRhLXJvdy1pZD1cIicgKyByb3cuaWQgKyAnXCI+PGVtIGNsYXNzPVwiZmEgZmEtZWRpdCBmYS1md1wiPjwvZW0+PC9idXR0b24+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc20gYnRuLWRhbmdlciBjb21tYW5kLWRlbGV0ZVwiIGRhdGEtcm93LWlkPVwiJyArIHJvdy5pZCArICdcIj48ZW0gY2xhc3M9XCJmYSBmYS10cmFzaCBmYS1md1wiPjwvZW0+PC9idXR0b24+JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVtcGxhdGVzOiB7XHJcbiAgICAgICAgICAgICAgICAvLyB0ZW1wbGF0ZXMgZm9yIEJTNFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uQnV0dG9uOiAnPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgdHlwZT1cImJ1dHRvblwiIHRpdGxlPVwie3tjdHgudGV4dH19XCI+e3tjdHguY29udGVudH19PC9idXR0b24+JyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkRyb3BEb3duOiAnPGRpdiBjbGFzcz1cInt7Y3NzLmRyb3BEb3duTWVudX19XCI+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGRyb3Bkb3duLXRvZ2dsZSBkcm9wZG93bi10b2dnbGUtbm9jYXJldFwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCI+PHNwYW4gY2xhc3M9XCJ7e2Nzcy5kcm9wRG93bk1lbnVUZXh0fX1cIj57e2N0eC5jb250ZW50fX08L3NwYW4+PC9idXR0b24+PHVsIGNsYXNzPVwie3tjc3MuZHJvcERvd25NZW51SXRlbXN9fVwiIHJvbGU9XCJtZW51XCI+PC91bD48L2Rpdj4nLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uRHJvcERvd25JdGVtOiAnPGxpIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiPjxhIGhyZWY9XCJcIiBkYXRhLWFjdGlvbj1cInt7Y3R4LmFjdGlvbn19XCIgY2xhc3M9XCJkcm9wZG93bi1saW5rIHt7Y3NzLmRyb3BEb3duSXRlbUJ1dHRvbn19XCI+e3tjdHgudGV4dH19PC9hPjwvbGk+JyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbkRyb3BEb3duQ2hlY2tib3hJdGVtOiAnPGxpIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiPjxsYWJlbCBjbGFzcz1cImRyb3Bkb3duLWl0ZW0gcC0wXCI+PGlucHV0IG5hbWU9XCJ7e2N0eC5uYW1lfX1cIiB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cIjFcIiBjbGFzcz1cInt7Y3NzLmRyb3BEb3duSXRlbUNoZWNrYm94fX1cIiB7e2N0eC5jaGVja2VkfX0gLz4ge3tjdHgubGFiZWx9fTwvbGFiZWw+PC9saT4nLFxyXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbkl0ZW06ICc8bGkgY2xhc3M9XCJwYWdlLWl0ZW0ge3tjdHguY3NzfX1cIj48YSBocmVmPVwiXCIgZGF0YS1wYWdlPVwie3tjdHgucGFnZX19XCIgY2xhc3M9XCJwYWdlLWxpbmsge3tjc3MucGFnaW5hdGlvbkJ1dHRvbn19XCI+e3tjdHgudGV4dH19PC9hPjwvbGk+JyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLm9uKCdsb2FkZWQucnMuanF1ZXJ5LmJvb3RncmlkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8qIEV4ZWN1dGVzIGFmdGVyIGRhdGEgaXMgbG9hZGVkIGFuZCByZW5kZXJlZCAqL1xyXG4gICAgICAgICAgICBncmlkLmZpbmQoJy5jb21tYW5kLWVkaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgcHJlc3NlZCBlZGl0IG9uIHJvdzogJyArICQodGhpcykuZGF0YSgncm93LWlkJykpO1xyXG4gICAgICAgICAgICB9KS5lbmQoKS5maW5kKCcuY29tbWFuZC1kZWxldGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgcHJlc3NlZCBkZWxldGUgb24gcm93OiAnICsgJCh0aGlzKS5kYXRhKCdyb3ctaWQnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiLy8gREFUQVRBQkxFU1xyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdERhdGF0YWJsZXMpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXREYXRhdGFibGVzKCkge1xyXG5cclxuICAgICAgICBpZiAoISQuZm4uRGF0YVRhYmxlKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIFplcm8gY29uZmlndXJhdGlvblxyXG5cclxuICAgICAgICAkKCcjZGF0YXRhYmxlMScpLkRhdGFUYWJsZSh7XHJcbiAgICAgICAgICAgICdwYWdpbmcnOiB0cnVlLCAvLyBUYWJsZSBwYWdpbmF0aW9uXHJcbiAgICAgICAgICAgICdvcmRlcmluZyc6IHRydWUsIC8vIENvbHVtbiBvcmRlcmluZ1xyXG4gICAgICAgICAgICAnaW5mbyc6IHRydWUsIC8vIEJvdHRvbSBsZWZ0IHN0YXR1cyB0ZXh0XHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIFRleHQgdHJhbnNsYXRpb24gb3B0aW9uc1xyXG4gICAgICAgICAgICAvLyBOb3RlIHRoZSByZXF1aXJlZCBrZXl3b3JkcyBiZXR3ZWVuIHVuZGVyc2NvcmVzIChlLmcgX01FTlVfKVxyXG4gICAgICAgICAgICBvTGFuZ3VhZ2U6IHtcclxuICAgICAgICAgICAgICAgIHNTZWFyY2g6ICc8ZW0gY2xhc3M9XCJmYXMgZmEtc2VhcmNoXCI+PC9lbT4nLFxyXG4gICAgICAgICAgICAgICAgc0xlbmd0aE1lbnU6ICdfTUVOVV8gcmVjb3JkcyBwZXIgcGFnZScsXHJcbiAgICAgICAgICAgICAgICBpbmZvOiAnU2hvd2luZyBwYWdlIF9QQUdFXyBvZiBfUEFHRVNfJyxcclxuICAgICAgICAgICAgICAgIHplcm9SZWNvcmRzOiAnTm90aGluZyBmb3VuZCAtIHNvcnJ5JyxcclxuICAgICAgICAgICAgICAgIGluZm9FbXB0eTogJ05vIHJlY29yZHMgYXZhaWxhYmxlJyxcclxuICAgICAgICAgICAgICAgIGluZm9GaWx0ZXJlZDogJyhmaWx0ZXJlZCBmcm9tIF9NQVhfIHRvdGFsIHJlY29yZHMpJyxcclxuICAgICAgICAgICAgICAgIG9QYWdpbmF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHNOZXh0OiAnPGVtIGNsYXNzPVwiZmEgZmEtY2FyZXQtcmlnaHRcIj48L2VtPicsXHJcbiAgICAgICAgICAgICAgICAgICAgc1ByZXZpb3VzOiAnPGVtIGNsYXNzPVwiZmEgZmEtY2FyZXQtbGVmdFwiPjwvZW0+J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyBGaWx0ZXJcclxuXHJcbiAgICAgICAgJCgnI2RhdGF0YWJsZTInKS5EYXRhVGFibGUoe1xyXG4gICAgICAgICAgICAncGFnaW5nJzogdHJ1ZSwgLy8gVGFibGUgcGFnaW5hdGlvblxyXG4gICAgICAgICAgICAnb3JkZXJpbmcnOiB0cnVlLCAvLyBDb2x1bW4gb3JkZXJpbmdcclxuICAgICAgICAgICAgJ2luZm8nOiB0cnVlLCAvLyBCb3R0b20gbGVmdCBzdGF0dXMgdGV4dFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBUZXh0IHRyYW5zbGF0aW9uIG9wdGlvbnNcclxuICAgICAgICAgICAgLy8gTm90ZSB0aGUgcmVxdWlyZWQga2V5d29yZHMgYmV0d2VlbiB1bmRlcnNjb3JlcyAoZS5nIF9NRU5VXylcclxuICAgICAgICAgICAgb0xhbmd1YWdlOiB7XHJcbiAgICAgICAgICAgICAgICBzU2VhcmNoOiAnU2VhcmNoIGFsbCBjb2x1bW5zOicsXHJcbiAgICAgICAgICAgICAgICBzTGVuZ3RoTWVudTogJ19NRU5VXyByZWNvcmRzIHBlciBwYWdlJyxcclxuICAgICAgICAgICAgICAgIGluZm86ICdTaG93aW5nIHBhZ2UgX1BBR0VfIG9mIF9QQUdFU18nLFxyXG4gICAgICAgICAgICAgICAgemVyb1JlY29yZHM6ICdOb3RoaW5nIGZvdW5kIC0gc29ycnknLFxyXG4gICAgICAgICAgICAgICAgaW5mb0VtcHR5OiAnTm8gcmVjb3JkcyBhdmFpbGFibGUnLFxyXG4gICAgICAgICAgICAgICAgaW5mb0ZpbHRlcmVkOiAnKGZpbHRlcmVkIGZyb20gX01BWF8gdG90YWwgcmVjb3JkcyknLFxyXG4gICAgICAgICAgICAgICAgb1BhZ2luYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc05leHQ6ICc8ZW0gY2xhc3M9XCJmYSBmYS1jYXJldC1yaWdodFwiPjwvZW0+JyxcclxuICAgICAgICAgICAgICAgICAgICBzUHJldmlvdXM6ICc8ZW0gY2xhc3M9XCJmYSBmYS1jYXJldC1sZWZ0XCI+PC9lbT4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIERhdGF0YWJsZSBCdXR0b25zIHNldHVwXHJcbiAgICAgICAgICAgIGRvbTogJ0JmcnRpcCcsXHJcbiAgICAgICAgICAgIGJ1dHRvbnM6IFtcclxuICAgICAgICAgICAgICAgIHsgZXh0ZW5kOiAnY29weScsIGNsYXNzTmFtZTogJ2J0bi1pbmZvJyB9LFxyXG4gICAgICAgICAgICAgICAgeyBleHRlbmQ6ICdjc3YnLCBjbGFzc05hbWU6ICdidG4taW5mbycgfSxcclxuICAgICAgICAgICAgICAgIHsgZXh0ZW5kOiAnZXhjZWwnLCBjbGFzc05hbWU6ICdidG4taW5mbycsIHRpdGxlOiAnWExTLUZpbGUnIH0sXHJcbiAgICAgICAgICAgICAgICB7IGV4dGVuZDogJ3BkZicsIGNsYXNzTmFtZTogJ2J0bi1pbmZvJywgdGl0bGU6ICQoJ3RpdGxlJykudGV4dCgpIH0sXHJcbiAgICAgICAgICAgICAgICB7IGV4dGVuZDogJ3ByaW50JywgY2xhc3NOYW1lOiAnYnRuLWluZm8nIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcjZGF0YXRhYmxlMycpLkRhdGFUYWJsZSh7XHJcbiAgICAgICAgICAgICdwYWdpbmcnOiB0cnVlLCAvLyBUYWJsZSBwYWdpbmF0aW9uXHJcbiAgICAgICAgICAgICdvcmRlcmluZyc6IHRydWUsIC8vIENvbHVtbiBvcmRlcmluZ1xyXG4gICAgICAgICAgICAnaW5mbyc6IHRydWUsIC8vIEJvdHRvbSBsZWZ0IHN0YXR1cyB0ZXh0XHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIC8vIFRleHQgdHJhbnNsYXRpb24gb3B0aW9uc1xyXG4gICAgICAgICAgICAvLyBOb3RlIHRoZSByZXF1aXJlZCBrZXl3b3JkcyBiZXR3ZWVuIHVuZGVyc2NvcmVzIChlLmcgX01FTlVfKVxyXG4gICAgICAgICAgICBvTGFuZ3VhZ2U6IHtcclxuICAgICAgICAgICAgICAgIHNTZWFyY2g6ICdTZWFyY2ggYWxsIGNvbHVtbnM6JyxcclxuICAgICAgICAgICAgICAgIHNMZW5ndGhNZW51OiAnX01FTlVfIHJlY29yZHMgcGVyIHBhZ2UnLFxyXG4gICAgICAgICAgICAgICAgaW5mbzogJ1Nob3dpbmcgcGFnZSBfUEFHRV8gb2YgX1BBR0VTXycsXHJcbiAgICAgICAgICAgICAgICB6ZXJvUmVjb3JkczogJ05vdGhpbmcgZm91bmQgLSBzb3JyeScsXHJcbiAgICAgICAgICAgICAgICBpbmZvRW1wdHk6ICdObyByZWNvcmRzIGF2YWlsYWJsZScsXHJcbiAgICAgICAgICAgICAgICBpbmZvRmlsdGVyZWQ6ICcoZmlsdGVyZWQgZnJvbSBfTUFYXyB0b3RhbCByZWNvcmRzKScsXHJcbiAgICAgICAgICAgICAgICBvUGFnaW5hdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzTmV4dDogJzxlbSBjbGFzcz1cImZhIGZhLWNhcmV0LXJpZ2h0XCI+PC9lbT4nLFxyXG4gICAgICAgICAgICAgICAgICAgIHNQcmV2aW91czogJzxlbSBjbGFzcz1cImZhIGZhLWNhcmV0LWxlZnRcIj48L2VtPidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gRGF0YXRhYmxlIGtleSBzZXR1cFxyXG4gICAgICAgICAgICBrZXlzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIvLyBDdXN0b20gQ29kZVxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICQoaW5pdEN1c3RvbSk7XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEN1c3RvbSgpIHtcclxuXHJcbiAgICAgICAgLy8gY3VzdG9tIGNvZGVcclxuXHJcbiAgICB9XHJcblxyXG59KSgpOyJdfQ==
