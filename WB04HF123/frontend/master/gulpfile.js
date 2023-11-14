var gulp = require('gulp'),
    args = require('yargs').argv,
    $ = require('gulp-load-plugins')(),
    path = require('path'),
    del = require('del'),
    saveLicense = require('uglify-save-license'),
    browserSync = require('browser-sync').create(),
    ansicolors = require('ansi-colors'),
    log = require('fancy-log');

// production mode (--prod flag)
var isProduction = !!args.prod;
// styles sourcemaps (--sourcemap[s] flag)
var useSourceMaps = !!args.sourcemaps;

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!' + hidden_files;

// VENDOR CONFIG
var vendor = {
    site: {
        source: require('./vendor.json'),
        dest: '../site/vendor'
    }
};

// SOURCES CONFIG
var source = {
    scripts: {
        site: ['js/script.js',
            'js/modules/**/*.js',
            'js/custom/**/*.js',
            ignored_files
        ],
        watch: ['js/*.js', 'js/**/*.js']
    },
    templates: {
        pages: {
            files: ['pug/*.pug', ignored_files],
            watch: ['pug/**/*.pug', 'pug/*.pug', 'pug/' + hidden_files]
        }
    },
    styles: {
        site: {
            main: ['sass/styles.scss', '!sass/themes/*.scss'],
            dir: 'sass',
            watch: ['sass/*.scss', 'sass/**/*.scss', '!sass/themes/*.scss']
        },
        themes: {
            main: ['sass/themes/*.scss', ignored_files],
            dir: 'sass/themes',
            watch: ['sass/themes/*.scss']
        }
    }
};

// BUILD TARGET CONFIG
var build = {
    scripts: {
        site: {
            main: 'scripts.js',
            dir: '../site/js'
        }
    },
    styles: '../site/css/',
    templates: {
        pages: '../site'
    }
};



//---------------
// TASKS
//---------------


// JS SITE
gulp.task('scripts:site', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(source.scripts.site)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe($.concat(build.scripts.site.main))
        .on('error', handleError)
        .pipe($.if(isProduction, $.uglify({
            output: {
                comments: saveLicense
            }
        })))
        .on('error', handleError)
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(gulp.dest(build.scripts.site.dir))
        .pipe(browserSync.stream());
});


// VENDOR BUILD

// copy file from npm folder into the site vendor folder
gulp.task('vendor', function() {

    var jsFilter = $.filter('**/*.js', { restore: true });
    var cssFilter = $.filter('**/*.css', { restore: true });

    return gulp.src(vendor.site.source, {
            base: 'node_modules'
        })
        .pipe(jsFilter)
        .pipe($.if(isProduction, $.uglify({
            output: {
                comments: false
            }
        })))
        .on('error', handleError)
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.if(isProduction, $.cssnano()))
        .pipe(cssFilter.restore)
        .pipe(gulp.dest(vendor.site.dest))
        .pipe(browserSync.stream());

});

// SITE STYLES
gulp.task('styles:site', function() {
    return gulp.src(source.styles.site.main)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe($.sass())
        .on('error', handleError)
        .pipe($.if(isProduction, $.cssnano()))
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe(gulp.dest(build.styles))
        .pipe(browserSync.stream());
});

// SITE RTL
gulp.task('styles:site:rtl', function() {
    return gulp.src(source.styles.site.main)
        .pipe($.if(useSourceMaps, $.sourcemaps.init()))
        .pipe($.sass())
        .on('error', handleError)
        .pipe($.rtlcss())
        .pipe($.if(isProduction, $.cssnano()))
        .pipe($.if(useSourceMaps, $.sourcemaps.write()))
        .pipe($.rename(function(path) {
            path.basename += '-rtl';
            return path;
        }))
        .pipe(gulp.dest(build.styles))
        .pipe(browserSync.stream());
});

// THEME STYLES
gulp.task('styles:themes', function() {
    return gulp.src(source.styles.themes.main)
        .pipe($.sass())
        .on('error', handleError)
        .pipe(gulp.dest(build.styles))
        .pipe(browserSync.stream());
});


// PUG (ex JADE)
gulp.task('templates:pages', function() {
    return gulp.src(source.templates.pages.files)
        // .pipe($.changed(build.templates.pages, { extension: '.html' }))
        .pipe($.pug())
        .on('error', handleError)
        .pipe($.jsbeautifier({
            indent_char: ' ',
            indent_size: 3,
            unformatted: ['sub', 'sup', 'b', 'i', 'u', 'pre', 'code']
        }))
        .pipe(gulp.dest(build.templates.pages));
});


//---------------
// WATCH
//---------------


function reload(done) {
    browserSync.reload();
    done();
}

// Rerun the task when a file changes
gulp.task('watch', function() {

    gulp.watch(source.scripts.watch, gulp.task('scripts:site'));
    gulp.watch(source.styles.site.watch, gulp.parallel('styles:site', 'styles:site:rtl'));
    gulp.watch(source.styles.themes.watch, gulp.task('styles:themes'));
    gulp.watch(source.templates.pages.watch, gulp.series('templates:pages', reload));

});

// Serve files with auto reaload
gulp.task('browsersync', function(cb) {
    log('Starting BrowserSync..');

    browserSync.init({
        notify: false,
        server: {
            baseDir: '../site'
        }
    }, cb);

});

// Remove all files from the build paths
gulp.task('clean', function(done) {
    var delconfig = [].concat(
        build.styles,
        build.scripts.site.dir,
        vendor.site.dest,
        build.templates.pages + '/index.html'
    );

    log('Cleaning: ' + delconfig);
    // force: clean files outside current directory
    del(delconfig, {
        force: true
    }).then(function() {
        log('Delete done.');
        done();
    });
});

//---------------
// MAIN TASKS
//---------------

// distribution build (production)
gulp.task('assets', gulp.parallel([
    'scripts:site',
    'styles:site',
    'styles:site:rtl',
    'styles:themes',
    'templates:pages'
]));

gulp.task('build', gulp.series([
    'vendor',
    'assets'
]));

// Server for development
gulp.task('serve', gulp.series(
    'build',
    'browsersync',
    'watch'
));

gulp.task('default', gulp.task('build'));

///////


// Error handler
function handleError(err) {
    log(ansicolors.blue(err.toString()));
    this.emit('end');
}

// log to console using
function log(msg) {
    log(ansicolors.blue(msg));
}
