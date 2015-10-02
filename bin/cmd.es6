#!/usr/bin/env node

import path from 'path';
import vfs from 'vinyl-fs';
import { run } from 'callback-sequence';
import fs from 'fs';

var opts = process.argv.slice(2);
var tmpl = path.resolve.bind(
  path, __dirname, '..', 'template'
);

(function () {
  if (opts.length) {
    if (opts[0] === 'peek') {
      if (/gulp/.test(opts[1])) {
        return peek(tmpl('gulpfile.babel.js'));
      }
      if (/index/.test(opts[1])) {
        return peek(tmpl('index.js'));
      }
      if (/gitignore/.test(opts[1])) {
        return peek(tmpl('gitignore'));
      }
      return;
    }
  }

  run(
    [access_package, edit_package, copy],
    (err) => {
      if (err) {
        console.log(err);
        process.exit(-1);
      }
      console.log(
        'DONE.',
        'Refer to',
        //'\033[4;32m',
        '\u001B[4;32m',
        'https://github.com/zoubin/es6-pkg',
        //'\033[0m',
        '\u001B[0m',
        'for more information'
      );
    }
  );

}());

function peek(file) {
  fs.createReadStream(file)
    .pipe(process.stdout)
    .on('close', () => {
      process.exit(1);
    });
}

function access_package(cb) {
  let fs = require('fs');
  fs.access(path.resolve('package.json'), cb);
}

function edit_package() {
  let mix = require('util-mix');
  let unpick = require('util-mix/unpick');
  let editor = require('gulp-json-editor');
  return vfs.src('package.json')
    .pipe(editor((p) => {
      p.main = 'index';

      p.scripts = p.scripts || {};
      p.scripts.test = 'gulp';

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
  let files = [
    'index.js',
    'gulpfile.babel.js',
    'eslintrc',
    'gitignore',
    'lib/main.es6',
    'test/main.es6',
  ];
  let rename = require('gulp-rename');
  let srcdir = tmpl();
  return vfs.src(files, { cwd: srcdir, base: srcdir })
    .pipe(rename((p) => {
      if (['eslintrc', 'gitignore'].indexOf(p.basename) !== -1) {
        p.basename = '.' + p.basename;
      }
    }))
    .pipe(vfs.dest(process.cwd(), { overwrite: false }));
}

