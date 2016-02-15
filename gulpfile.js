(function () {
  'use strict';

  var args = require('yargs')
    .default('target', 'local')
    .default('open', true)
    .argv;
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var del = require('del');
  var runSequence = require('run-sequence');
  var browserSync = require('browser-sync');
  var reload = browserSync.reload;
  var config = require('./wea-config.json');
  var examplesConfig = require('./wea-examples-config.json');

  $.util.log('Using configuration', $.util.colors.cyan(args.target));

  gulp.on('error', $.util.log);

  gulp.task('bower', function () {
    return $.bower('.tmp/bower_components');
  });

  gulp.task('lint', [ 'js:lint', 'styles:lint' ]);

  gulp.task('autolint', ['lint'], function () {
    gulp.watch([ 'app/**/*.js', 'app/**/*.{css,scss}' ], ['lint']);
  });

  gulp.task('js:lint', function () {
    return gulp.src([ '!app/vendor/**/*.js', 'app/**/*.js' ])
      .pipe($.eslint())
      .pipe($.eslint.formatEach())
      .pipe($.if(!browserSync.active, $.eslint.failOnError()))
      .pipe(reload({ 'stream': true }));
  });

  gulp.task('js:compile', ['js:lint'], function () {
    return gulp.src(['app/**/*.js'])
      .pipe($.preprocess({ 'context': config[args.target] }))
      .pipe(gulp.dest('.tmp'));
  });

  gulp.task('fonts', ['bower'], function () {
    return gulp.src([ 'app/fonts/**/*', '.tmp/bower_components/bootstrap-sass/assets/fonts/**/*' ])
      .pipe(gulp.dest('.tmp/fonts'))
      .pipe(gulp.dest('dist/fonts'))
      .pipe(reload({ 'stream': true, 'once': true }))
      .pipe($.size({ 'title': 'fonts' }));
  });

  gulp.task('images', function () {
    return gulp.src('app/images/**/*')
      .pipe(gulp.dest('dist/images'))
      .pipe(reload({ 'stream': true, 'once': true }))
      .pipe($.size({ 'title': 'images' }));
  });

  gulp.task('styles:css', function () {
    return gulp.src('app/**/*.css')
      .pipe($.autoprefixer('last 1 version'))
      .pipe(gulp.dest('.tmp'))
      .pipe(reload({ 'stream': true }))
      .pipe($.size({ 'title': 'styles:css' }));
  });

  gulp.task('styles:scss', ['bower'], function () {
    return gulp.src('app/**/*.scss')
      .pipe($.sass({
        'sourceComments': false,
        'errLogToConsole': true,
        'outputStyle': 'expanded',
        'precision': 10,
        'includePaths': [ 'app', '.tmp/bower_components/bootstrap-sass/assets/stylesheets' ]
      }))
      .pipe($.autoprefixer('last 1 version'))
      .pipe(gulp.dest('.tmp'))
      .pipe($.size({ 'title': 'styles:scss' }));
  });

  gulp.task('styles:lint', function () {
    gulp.src('app/**/*.scss')
      .pipe($.scssLint());
  });

  gulp.task('styles', [ 'styles:scss', 'styles:css' ]);

  gulp.task('html:compile', function () {
    return gulp.src([ '!app/index.html', 'app/**/*.html' ])
      .pipe($.minifyHtml({ 'empty': true }))
      .pipe($.angularTemplatecache('templates.js', { 'standalone': true }))
      .pipe(gulp.dest('.tmp'));
  });

  gulp.task('html', [ 'bower', 'js:compile', 'html:compile', 'translations' ], function () {
    var assets = $.useref.assets({ 'searchPath': '.tmp' });
    return gulp.src('app/index.html')
      .pipe(assets)
      .pipe($.if('*.js', $.ngAnnotate()))
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', $.minifyCss()))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.if('*.html', $.minifyHtml({ 'empty': true, 'quotes': true })))
      .pipe(gulp.dest('dist'))
      .pipe($.size({ 'title': 'html' }));
  });

  gulp.task('translations:pot', function () {
    return gulp.src(['app/**/*.{html,js}'])
      .pipe($.angularGettext.extract('wea.pot', {}))
      .pipe(gulp.dest('po/'));
  });

  gulp.task('translations', function () {
    return gulp.src('po/**/*.po')
      .pipe($.angularGettext.compile({}))
      .pipe(gulp.dest('.tmp/translations'));
  });

  gulp.task('docs', function () {
    var infos = {
      'plugins': ['plugins/markdown']
    };
    gulp.src([ './app/**/*.js', 'README.md' ])
      .pipe($.jsdoc.parser(infos))
      .pipe($.jsdoc.generator('.tmp/jsdoc'));
  });

  gulp.task('serve', [ 'bower', 'styles', 'fonts', 'js:compile', 'html:compile', 'examples:build', 'translations' ], function () {
    browserSync({
      'notify': false,
      'open': args.open,
      'server': {
        'baseDir': [ '.tmp', 'app', '.tmp_examples' ]
      },
      'ports': {
       'min': 9090,
       'max': 9090
      }
    });

    gulp.watch(['app/**/*.html'], [ 'html:compile', reload ]);
    gulp.watch(['app/**/*.{css,scss}'], ['styles']);
    gulp.watch(['.tmp/styles/**/*.css'], reload);
    gulp.watch(['app/**/*.js'], [ 'js:compile', reload ]);
    gulp.watch(['app/fonts/**/*'], ['fonts']);
    gulp.watch(['examples/**/*'], [ 'examples:build', reload ]);
    gulp.watch(['po/**/*.po'], [ 'translations', reload ]);
  });

  gulp.task('clean', del.bind(null, [ '.tmp', 'test_out', 'dist' ]));

  gulp.task('dist', ['clean'], function (cb) {
    runSequence('styles', [ 'html', 'fonts', 'images' ], cb);
  });

  gulp.task('examples:clean', del.bind(null, [ '.tmp/examples', 'dist/examples' ]));

  gulp.task('examples:build', ['examples:clean'], function () {
    return gulp.src(['examples/**/*'])
      .pipe($.if('*.html', $.preprocess({ 'context': examplesConfig[args.target] })))
      .pipe(gulp.dest('.tmp/examples'));
  });

  gulp.task('examples:dist', ['examples:build'], function () {
    return gulp.src(['.tmp/examples/**/*'])
      .pipe(gulp.dest('dist/examples'));
  });

  gulp.task('default', [], function (cb) {
    runSequence('dist', ['examples:dist'], cb);
  });

  gulp.task('test', ['bower'], function () {
    return gulp.src('./idontexist') // https://github.com/lazd/gulp-karma/issues/9
      .pipe($.karma({
        'configFile': './karma.conf.js',
        'autoWatch': false
      }))
      .on('error', function (err) {
        // Make sure failed tests cause a non-zero exit code
        throw err;
      });
  });

  gulp.task('autotest', ['bower'], function () {
    gulp.src('./idontexist') // https://github.com/lazd/gulp-karma/issues/9
      .pipe($.karma({
        'configFile': './karma.conf.js',
        'autoWatch': true,
        'action': 'start'
      }));
  });
}());
