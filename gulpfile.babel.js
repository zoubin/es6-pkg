import gulp from 'gulp';

gulp.task('clean', () => {
  let del = require('del');
  return del('build');
});
gulp.task('lib', ['clean'], () => {
  let babel = require('gulp-babel');
  return gulp.src('lib/*.es6')
    .pipe(babel())
    .pipe(gulp.dest('build/lib'));
});
gulp.task('docs', ['clean'], () => {
  return gulp.src(['README.md', 'LICENSE', '.npmignore'])
    .pipe(gulp.dest('build'));
});
gulp.task('package', ['clean'], () => {
  let editor = require('gulp-json-editor');
  return gulp.src('./package.json')
    .pipe(editor( (p) => {
      p.main = 'lib/entry';
      p.devDependencies['babel-core'] = p.dependencies['babel-core'];
      delete p.dependencies['babel-core'];
      return p;
    }))
    .pipe(gulp.dest('build'));
});
gulp.task('build', ['lib', 'docs', 'package']);

gulp.task('lint', () => {
  let eslint = require('gulp-eslint');
  return gulp.src(['*.js', 'lib/*.es6', 'test/*.es6'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

function test() {
  require('./');
  let tape = require('gulp-tape');
  let reporter = require('tap-spec');
  return gulp.src('test/*.es6').pipe(tape({
    reporter: reporter(),
  }));
}
function instrument() {
  require('./');
  let istanbul = require('gulp-istanbul');
  let isparta = require('isparta');
  return gulp.src('lib/*.es6')
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: isparta.Instrumenter,
    }))
    .pipe(istanbul.hookRequire({
      extensions: ['.es6'],
    }));
}
function report() {
  let istanbul = require('gulp-istanbul');
  return gulp.src('test/*.es6', { read: false })
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({
      thresholds: {
      },
    }));
}

gulp.task('coverage', require('callback-sequence')(instrument, test, report));

gulp.task('default', ['lint', 'coverage']);

