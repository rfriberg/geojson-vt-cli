var geojsonVt = require('geojson-vt');
var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2));

// path to data may be passed in via --data= or -d
// e.g. node tile.js --data=./data/route.json
var path = argv.data || argv.d;
if (!path) {
  console.log('Need to specify path to data; aborting');
  return;
}
console.log('load from: ' + path);

// output name may be passed in via --out= or -o | defaults to 'output.json'
var output = argv.out || argv.o || 'output.json';
console.log('output to: ' + output);

//var orig = JSON.parse(fs.readFileSync(__dirname + '/data/route.json'));
var orig = JSON.parse(fs.readFileSync(path));

var tileOptions = {
    maxZoom: 16,  // max zoom to preserve detail on
    tolerance: 5, // simplification tolerance (higher means simpler)
    extent: 4096, // tile extent (both width and height)
    buffer: 64,   // tile buffer on each side
    debug: 2,      // logging level (0 to disable, 1 or 2)

    indexMaxZoom: 0,        // max zoom in the initial tile index
    indexMaxPoints: 100000, // max number of points per tile in the index
};


var tileindex = geojsonVt(orig, tileOptions);

var tile = tileindex.getTile(1, 0, 0);
if (!tile) {
  console.log('tile at [1, 0, 0] is empty');
  return;
}

fs.writeFileSync(output, JSON.stringify(tile))
