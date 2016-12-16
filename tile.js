var geojsonVt = require('geojson-vt');
var vtpbf = require('vt-pbf');
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
//var output = argv.out || argv.o || 'output.json';
//console.log('output to: ' + output);

var orig = JSON.parse(fs.readFileSync(path));

var tileOptions = {
    maxZoom: 16,  // max zoom to preserve detail on
    tolerance: 5, // simplification tolerance (higher means simpler)
    extent: 4096, // tile extent (both width and height)
    buffer: 64,   // tile buffer on each side
    debug: 1,      // logging level (0 to disable, 1 or 2)

    indexMaxZoom: 0,        // max zoom in the initial tile index
    indexMaxPoints: 100000, // max number of points per tile in the index
};


var tileindex = geojsonVt(orig, tileOptions);

// TODO: replace with incoming arvg
var zoom = 6;

if (!fs.existsSync(zoom + '/')){
    fs.mkdirSync(zoom + '/');
}

// TODO: replace with incoming arvg
for (var x = 9; x < 21; x++) {
  var path = zoom + '/' + x; // + '/';

  for (var y = 21; y < 28; y++) {
    var tile = tileindex.getTile(zoom, x, y);
    if (!tile) {
      console.log('NO TILE AT ' + x + ', ' + y);
      break;
    }

    var buff = vtpbf.fromGeojsonVt({ 'geojsonLayer': tile });
    if (!buff) {
      console.log('NO BUFF AT ' + x + ', ' + y);
      break;
    } 

    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }

    fs.writeFileSync(path + '/' + y + '.mvt', buff);

  }
}

