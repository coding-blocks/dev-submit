/*jslint node: true */

'use strict';

var _ = require('lodash');

function dsl(actions) {
    var obj = Object.create(dsl.prototype);
    obj._actions = actions || []; 
    return obj;
}

['methods', 'call'].forEach(function (key) {
    dsl[key] = function () {
        var inst = dsl();
        return inst[key].apply(inst, arguments);
    };
    dsl.prototype[key] = function () {
        return dsl(this._actions.concat([[key, _.toArray(arguments)]]));
    };
});

dsl.prototype.done = function () {
    /**
     * Methods for DSL
     */
    var methods = this._actions.filter(function (a) {
        return a[0] === 'methods';
    }).reduce(function (a, b) {
        return a.concat(b[1][0]);
    }, []);

    /**
     * Callable methods
     */
    var method_fns = this._actions.filter(function (a) {
        return a[0] === 'call' && typeof a[1][0] !== 'function';
    });

    /**
     * Is this DSL callable?  If it is, it makes our code a less efficient,
     * because we can't do object delegation with functions.
     */
    var callable = _.find(this._actions, function (a) {
        return a[0] === 'call' && typeof a[1][0] === 'function';
    });
    if (callable) {
        callable = callable[1][0];
    }

    var create, prototype = {};

    if (callable) {
        create = function (opts) {
            var obj = function () {
                return callable.apply(obj, arguments);
            };
            _.extend(obj, prototype, opts);
            obj._actions = obj._actions || [];
            console.log('actions', obj._actions);

            return obj;
        };
    } else {
        throw new Error('@TODO non-callable DSL');
    }

    methods.forEach(function (method) {
        prototype[method] = function () {
            return create({
                _actions: this._actions.concat([[method, _.toArray(arguments)]])
            });
        };
    });

    console.log('rwarr!!!', this, prototype);
    return create();
};

var pf = dsl
    .methods(['curry'])
    .call(function (fn) {
        if (!this._fn) {
            return {_fn: fn};
        }
        console.log('rawrrr!', this._actions);
    })
    .done();

pf.curry('foo').curry('bar')('hello');
