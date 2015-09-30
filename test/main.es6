import { test } from 'tape';
import { abs, halve } from '../lib/main';

test('abs', function(t) {
  t.equal(abs(1), 1, 'positive');
  t.equal(abs(-1), 1, 'negative');
  t.equal(abs(-0), 0, 'zero');
  t.end();
});

test('halve', function(t) {
  t.equal(halve(3), 1, 'odd');
  t.equal(halve(4), 2, 'even');
  t.equal(halve(-3), -1, 'should fail');
  t.end();
});

