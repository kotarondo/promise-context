// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

var harness = require('./harness')
var cp = harness.checkpoint;
var assertEquals = harness.assertEquals;

var PromiseContext = require('../PromiseContext');
var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

function executor_template(name, resolve, reject) {
    cp("in" + name);
    setTimeout(function() {
        resolve("value" + name);
        cp("out" + name);
    }, 10);
}

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');

var i = 0;
ctx.loop("L1", function() {
    ctx.chain(A);
    ctx.loop("L2", function() {
        i++;
        if (i == 3) ctx.break("L1");
        ctx.chain(B);
        if (i == 1) ctx.continue("L2");
        ctx.chain(C);
        if (i == 2) ctx.continue("L1");
    });
    ctx.chain(D);
});
ctx.chain(C);

ctx.end();

function onFulfilled() {
    harness.expected_order("inA,outA,inB,outB,inB,outB,inC,outC,inA,outA,inC,outC");
    console.log("OK");
    process.exit(0);
}

function onRejected(err) {
    console.log("NG: unexpected reject: " + err);
    process.exit(1);
}
