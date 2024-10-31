var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');


gulp.task('watch', function(done) {
  return gulp.watch('src/**.js', gulp.series('clean', 'jsBundle'))
});
 
// Task to delete target build folder
gulp.task('clean', async function(done) {
  return del.deleteSync(['public/**', '!public']);
});

gulp.task('jsBundle', async function(done) {
  return gulp.src(['assets/letters/*.js',
            'src/PseudRand.js',
            'src/EZWG.js',
            'src/typer.js',
            'src/game.js',
            'src/config.js',
            'src/kickoff.js'
            ])
  .pipe(uglify())
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist/js'));
});

