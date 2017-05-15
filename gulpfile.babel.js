import gulp from 'gulp';
import run from 'run-sequence';
import server from 'gulp-live-server';
import sass from 'gulp-sass';
import prefix from 'gulp-autoprefixer'
import babel from 'gulp-babel'
import sourcemaps from 'gulp-sourcemaps';
import mocha from 'gulp-mocha';
import gutil from 'gulp-util';

const paths = {
  js: ['./src/**/*.js'],
  scss: ['./src/scss/**/*.scss'],
  destination: './app'
}

gulp.task('default', cb => {
  run('server', 'build', 'watch', cb);
});

gulp.task('build', cb => {
  run('babel', 'restart', cb);
});

gulp.task('babel', ()=>{
	gulp.src("src/**/*.js")
  .pipe(sourcemaps.init())
  .pipe(babel({presets: ['node6']}))
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest("app"));
});

let express;

gulp.task('server', () => {
  express = server.new(paths.destination);
});

gulp.task('restart', () => {
  express.start.bind(express)();
});

gulp.task('watch', () => {
  gulp.watch(paths.js, () => {
    gulp.start('build');
  });
  gulp.watch(paths.scss,  ['sass']);
  gulp.watch(['test/**'], ['mocha']);
});

gulp.task('sass', ()=>{
	gulp.src('src/scss/*.scss')
  .pipe(sass({outputStyle: 'compressed'}, {errLogToConsole: true}))
  .pipe(prefix())
  .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('mocha', () => {
	gulp.src(['test/**'], { read: false })
  .pipe(mocha({ reporter: 'list' }))
  .on('error', gutil.log);
});