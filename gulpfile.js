var gulp = require('gulp'),
    // sass = require('gulp-ruby-sass'),
    // sass = require('gulp-sass'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    stylish = require('jshint-stylish');

// Error logging, so don't need gulp-plumber
function errorLog(error){
	console.error.bind(error);
	this.emit('end');
}

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
    .pipe( concat('main.js') )
    .pipe( gulp.dest('build/js') )
    .pipe( rename( {suffix: '.min'}) )
    .pipe( uglify() )
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
  .pipe( compass({
    css : 'build/css',
    sass : 'src/scss',
    require : ['susy']
  }) )
	.on('error', errorLog )
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe( gulp.dest('build/css') )
	.pipe( rename({suffix: '.min'}) )
	.pipe( minifycss() )
	.pipe( gulp.dest('build/css') )
  .pipe( notify({ message: 'Styles task complete' }) )
  .pipe( livereload() );
});

// Images task
gulp.task('images',function(){
	return gulp.src( ['src/img/*','!src/img/*.fw.png'] ) // ignore Fireworks source files
	.pipe( cache( imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }) ) )
	.pipe( gulp.dest('build/img') )
	.pipe(notify({ message: 'Images task complete' }));
});

// Cleanup build dir
gulp.task('clean', function(cb) {
    del(['build/css', 'build/js', 'build/img'], cb)
});

// Watch task
gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/img/**/*', ['images']);
  livereload.listen();
});

gulp.task('default', ['clean','checkjs'], function() {
    gulp.start('styles', 'scripts', 'images', 'movejs');
});