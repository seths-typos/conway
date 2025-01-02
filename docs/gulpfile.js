var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');


gulp.task('watch', function(done) {
  return gulp.watch('src/js/*.js', gulp.series('clean', 'jsBundle'))
});
 
// Task to delete target build folder
gulp.task('clean', async function(done) {
  return del.deleteSync(['public/**', '!public']);
});

gulp.task('jsBundle', async function(done) {
  return gulp.src([
            'src/js/header_animation.js',
            'src/js/letters.js',
            'src/js/typer.js',
            'src/js/cell_list.js',
            'src/js/game.js',
            'src/js/kickoff.js'
            ])
  .pipe(uglify())
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist/js'));
});

