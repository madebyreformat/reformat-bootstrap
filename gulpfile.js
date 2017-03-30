// var config = {
//   url : "reformat-bootstrap.dev"
// };

// https://frontend.irish/npm-config-variables
// https://gist.github.com/LandonSchropp/2816314bb336fbe1f4e6


var config = require('./package.json'),
gulp = require('gulp'),
plugins = require('gulp-load-plugins')(),
browserSync = require('browser-sync').create(),
options  = {
	dev : {
		tasks : ['dev:css'],
		dir: 'build'
	},
	dist : {
		tasks : ['minify:css'],
		dir: 'dist'
	}
};

// -------------------------------------
// Development Tasks
// -------------------------------------

gulp.task('dev:css', function(){
  return gulp.src('src/scss/main.scss')
  .pipe( plugins.compass({
    css : options.dev.dir + '/css',
    sass : 'src/scss',
    require : ['susy'],
    sourcemap : true
  }) )
  .pipe( plugins.sourcemaps.init({ loadMaps: true }) )
  .pipe( plugins.autoprefixer() )
  .pipe( plugins.sourcemaps.write('.') )
  .pipe( gulp.dest( options.dev.dir + '/css' ) )
  .pipe( plugins.notify({ message: 'Styles task complete' }) );
});

gulp.task( 'dev', function() {
  options.dev.tasks.forEach( function( task ) {
    gulp.start( task );
  });
});

// -------------------------------------
// Production Tasks
// -------------------------------------

gulp.task('minify:css', function(){
  return gulp.src('src/scss/main.scss')
  .pipe( plugins.compass({
    css : options.dist.dir + '/css',
    sass : 'src/scss',
    require : ['susy'],
    sourcemap : false
  }) )
  .pipe( plugins.autoprefixer() )
  .pipe( plugins.cleanCss({ 
    level: {
      1: {
        cleanupCharsets: true,
        specialComments: 0
      }
    }
  }) 
  )
  .pipe( gulp.dest( options.dist.dir + '/css' ) )
  .pipe( plugins.notify({ message: 'Styles task complete' }) );
});

gulp.task( 'dist', function() {
  options.dist.tasks.forEach( function( task ) {
    gulp.start( task );
  });
});

// -------------------------------------
// Utility Tasks
// -------------------------------------

gulp.task('serve', ['dev:css'], function() {
    
    browserSync.init({
        port: 3000,
        proxy: config.url,
        files: "build/css/**/*.css",
        open: false
    });

    gulp.watch('src/scss/**/*.scss', ['dev:css']);
    // gulp.watch('src/js/**/*.js', ['scripts']).on('change', browserSync.reload);
    // gulp.watch('src/img/**/*', ['images']).on('change', browserSync.reload);
    gulp.watch("*.php").on('change', browserSync.reload);

});

gulp.task('default', ['serve']);