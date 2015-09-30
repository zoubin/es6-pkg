#!/usr/bin/env node

var path = require('path');
var vfs = require('vinyl-fs');
var sequence = require('callback-sequence');

sequence.run(
  [access_package, edit_package, copy],
  function (err) {
    if (err) {
      console.log(err);
      process.exit(-1);
    } else {
      console.log(
        'DONE.',
        'Refer to',
        '\033[4;32m',
        'https://github.com/zoubin/es6-pkg',
        '\033[0m',
        'for more information'
      );
    }
  }
);

function access_package(cb) {
  var fs = require('fs');
  fs.access(path.resolve('package.json'), function (err) {
    if (err && err.code === 'ENOENT') {
      console.log('`package.json` not found.');
    }
    cb(err);
  });
}

function edit_package() {
  var mix = require('util-mix');
  var unpick = require('util-mix/unpick');
  var editor = require('gulp-json-editor');
  return vfs.src('package.json', { cwd: process.cwd() })
    .pipe(editor(function (p) {
      p.main = 'index';

      p.scripts = p.scripts || {};
      p.scripts.test = p.scripts.test || 'gulp';

      p.devDependencies = mix(
        unpick(
          Object.keys(p.dependencies || {}),
          require('../template/package.json').devDependencies
        ),
        p.devDependencies
      );
      return p;
    }))
    .pipe(vfs.dest(process.cwd()));
}

function copy() {
  var files = [
    'index.js',
    'gulpfile.babel.js',
    'eslintrc',
    'gitignore',
  ];
  var rename = require('gulp-rename');
  var srcdir = path.resolve(__dirname, '..', 'template');
  return vfs.src(files, { cwd: srcdir, base: srcdir })
    .pipe(rename(function (p) {
      if (['eslintrc', 'gitignore'].indexOf(p.basename) !== -1) {
        p.basename = '.' + p.basename;
      }
    }))
    .pipe(vfs.dest(process.cwd(), { overwrite: false }));
}


