var URL = "reformat-bootstrap.dev";

var gulp = require('gulp'),
    compass = require('gulp-compass'),
    cleanCSS = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    newer = require('gulp-newer'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    stylish = require('jshint-stylish');

var browserSync = require('browser-sync').create();

// Error logging, so don't need gulp-plumber
function errorLog(error){
  console.error.bind(error);
  this.emit('end');
}

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('build/fonts'));
});

// Check javascript task
gulp.task('checkjs', function(){
  return gulp.src( ['src/js/main.js'] )
    .pipe( jshint('.jshintrc') )
    .pipe( jshint.reporter(stylish) )
    .pipe( jshint.reporter('fail') )
    .pipe( notify({ message: 'Scripts task complete' }) );
});

// Scripts task
gulp.task('scripts', function(){
  return gulp.src( ['src/js/plugins.js','src/js/plugins/*.js','src/js/main.js'] )
    .pipe( sourcemaps.init() )
    .pipe( concat('main.js') )
    .pipe( gulp.dest('build/js') )
    .pipe( rename( {suffix: '.min'}) )
    .pipe( uglify() )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest('build/js') )
    .pipe( notify({ message: 'Scripts task complete' }) );
});

gulp.task('movejs', function(){
  return gulp.src( 'src/js/vendor/*.js' )
  .pipe( gulp.dest('build/js/vendor') );
});

// Styles task
gulp.task('styles', function(){
  return gulp.src('src/scss/main.scss')
  .pipe( sourcemaps.init() )
  .pipe( compass({
    css : 'build/css',
    sass : 'src/scss',
    require : ['susy'],
    sourcemap : true
  }) )
  .on('error', errorLog )
  .pipe( sourcemaps.write('.'))
  .pipe( gulp.dest('build/css') )
  .pipe( rename({suffix: '.min'}) )
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe( cleanCSS({ compatibility: 'ie8', debug:true }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }) )
  .pipe( gulp.dest('build/css') )
  .pipe( browserSync.stream({match: '**/*.css'}) );
});

// Images task
gulp.task('images',function(){
  return gulp.src( ['src/img/*','!src/img/*.fw.png','!src/img/*.ai'] ) // ignore Fireworks source files
  .pipe( newer('build/img') )
  .pipe( imagemin() )
  .pipe( gulp.dest('build/img') )
  .pipe( notify({ message: 'Images task complete' }) );
});

// Browsersync
gulp.task('serve', ['styles'], function() {
    
    browserSync.init({
        port: 3000,
        proxy: URL,
        files: "build/css/**/*.css",
        open: false
    });

    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/js/**/*.js', ['scripts']).on('change', browserSync.reload);
    gulp.watch('src/img/**/*', ['images']).on('change', browserSync.reload);
    gulp.watch('src/fonts/**/*', ['fonts']).on('change', browserSync.reload);
    gulp.watch("*.php").on('change', browserSync.reload);

});

// Cleanup build dir
gulp.task('clean', function(cb) {
    del(['build/css', 'build/js', 'build/img'], cb)
});

gulp.task('init', ['clean','checkjs'], function() {
    gulp.start('styles', 'scripts', 'images', 'movejs');
});

gulp.task('default', ['serve']);