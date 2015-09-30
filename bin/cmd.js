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
      p.main = 'lib/main';
      p.devDependencies = mix(
        unpick(
          Object.keys(p.dependencies || {}),
          require('../package.json').devDependencies
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
    'lib/main.es6',
    'test/main.es6',
    '.eslintrc',
    '.npmignore',
    '.gitignore',
  ];
  var srcdir = path.resolve(__dirname, '..');
  return vfs.src(files, { cwd: srcdir, base: srcdir })
    .pipe(vfs.dest(process.cwd(), { overwrite: true }));
}


