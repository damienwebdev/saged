var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var del = require('del');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');

var src = "src";
var topLevelFolder = "dist";

gulp.task('default', () => {
  return runSequence('serve');
})

// Static server
gulp.task('serve', ['build'] ,() => {
  browserSync.init({
      server: {
          baseDir: "./" + topLevelFolder
      }
  });

  gulp.watch("src/**/*.css", ['css', function(){browserSync.reload();}]);
  gulp.watch("src/**/*.html", ['html', function(){browserSync.reload();}]);
  gulp.watch("src/js/**/*.js", ['scripts', function(){browserSync.reload();}]);
  gulp.watch("src/images/**/**",['images']);
});

gulp.task('clean', function(){
   return del([topLevelFolder]);
});

gulp.task('html', () => {
    return gulp.src(['src/**/*.html', '!src/ssi/*.html'])
      .pipe(data(function() {
        return Object.assign({}, require('./package.json'), {
          now: new Date().getFullYear()
        })
      }))
      .pipe(nunjucksRender({
          path: ['src/ssi']
        })
      )
      .on('error', function(error) {
        console.log(error.message);
        this.emit('end');
      })
      .pipe(gulp.dest(topLevelFolder));
});

gulp.task('css', () => {
  return gulp.src(src + '/css/**/**')
    .pipe(gulp.dest(topLevelFolder + "/css"));
});

gulp.task('js', () => {
  return gulp.src(src + '/js/**/**')
    .pipe(gulp.dest(topLevelFolder + "/js"));
});

gulp.task('images', () => {
  return gulp.src(src + '/images/**/**')
    .pipe(gulp.dest(topLevelFolder + "/images"));
});

gulp.task("build", () => {
  return runSequence('clean', ['html', 'css', 'js', 'images']);
})
