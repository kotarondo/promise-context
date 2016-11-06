// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// performance test: null ctx.call()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilledP, onRejected);

perf_name = "null ctx.call()";
perf_loops = 100000;

function testF() {}

var i = 0;
ctx.loop(function() {
    ctx.call(testF);
    if (++i == perf_loops) ctx.break();
});
ctx.end();
