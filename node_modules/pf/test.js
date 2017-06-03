var test = require('tap').test;

test('curry examples', function (t) {
    function fn(a, b, c, d) {
        return [a, b, c, d].join();
    }
    function okay_sir(str) {
        t.equals(str, 'hello,world,foo,bar');
    }
    okay_sir(pf(fn).curry('hello', 'world')('foo', 'bar'));
    okay_sir(pf.curry(fn, 'hello', 'world')('foo', 'bar'));
    okay_sir(pf.curry('hello')(fn).curry('world')('foo', 'bar'));
    t.end();
});
