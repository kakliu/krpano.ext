var pmc = require('./lib/main'),
    path = require('path'),
    srcPath = path.resolve(__dirname, '../src/'),
    distPath = path.resolve(__dirname, '../dist/');
var deps = require('../src/deps').deps;

pmc.config({
    dist: distPath,
    src: srcPath,
    output:'P',
    deps:deps
});
// build with only one package.