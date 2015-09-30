# es6-pkg
Boilerplate for developing node modules using es6

## Usage

```bash
npm i -g es6-pkg

mkdir your_project

cd your_project

# create `package.json`
npm init

# create files
es6pkg

npm install

# test the sample code
gulp

# coding

# check coverage
npm test

# commit your code and bump version

gulp build

cd build

npm publish

```

### project directory

Put all your scripts in `lib/`, and tests in `test/`.

If there is a `bin` directory,
you should modify `gulpfile.babel.js`.

```
⌘ tree .
.
├── gulpfile.babel.js
├── index.js
├── lib
│   └── main.es6
├── package.json
└── test
    └── main.es6
```

### test and coverage

Run `gulp` or `npm test`, you will see something like:

![test](test.png)

## Test

Refer to [tape](https://github.com/substack/tape) to learn how to write tests.

The default reporter is [tap-spec](https://github.com/scottcorgan/tap-spec).

**NOTE**: Tests should depend upon the same `tape` with `gulp-tape`,
otherwise the reporter may fail to receive the output.

Coverage statistics is done by
[istanbul](https://github.com/SBoudrias/gulp-istanbul) and
[isparta](https://github.com/douglasduteil/isparta).

## Lint

Refer to [eslint](https://github.com/eslint/eslint/tree/master/docs/rules)
to learn how to confiure.

## Learn es6

* [lukehoban#es6features](https://github.com/lukehoban/es6features)
* [ecma-262 6th edition](http://www.ecma-international.org/ecma-262/6.0/)
* [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

