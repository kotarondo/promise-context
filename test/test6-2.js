// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test illegal break 

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilledE, onRejectedE);

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');

var i = 0;
ctx.loop(function() {
    ctx.loop("L2", function() {
        ctx.chain(A);
        ctx.loop("L1", function() {
            ctx.chain(B);
            ctx.break("L" + (++i));
            ctx.chain(C);
        });
        ctx.chain(D);
    });
});
ctx.end();

expected_error = "Error: illegal break()";
expected_order = "<AA><BB><DD><AA><BB><AA>";
order_separator = '';
