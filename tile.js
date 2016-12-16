var geojsonVt = require('geojson-vt');
var vtpbf = require('vt-pbf');
var fs = require("fs");
var argv = require('minimist')(process.argv.slice(2), {
  alias: { d: 'data', o: 'out', z: 'zoom' },
  default: { z: '5', o: 'cache/' }
});

//console.log(argv);

var input = argv.d;
var output = argv.o;
var zoom = argv.z;


if (!input) {
  console.log('Need to specify path to data; aborting.');
  console.log('Try running: node tile.js --data=path/to/data.js');
  return;
}
var orig = JSON.parse(fs.readFileSync(input));


// Create output directory
if (!fs.existsSync(output)){
  fs.mkdirSync(output);
}
console.log('Writing files to ' + output);


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



var start_zoom = 1;
var end_zoom = zoom;
var start_x = 0;
var end_x = 1;
var start_y = 0;
var end_y = 1;

for (var z = start_zoom; z <= end_zoom; z++) {

  // Create 'z' directory
  if (!fs.existsSync(output + '/' + z + '/')){
      fs.mkdirSync(output + '/' + z + '/');
  }

  for (var x = start_x; x <= end_x; x++) {
    var path = output + '/' + z + '/' + x;

    for (var y = start_y; y <= end_y; y++) {
      var tile = tileindex.getTile(z, x, y);
      if (!tile) {
        console.log('NO TILE AT: ' + z + ', ' + x + ', ' + y + ' (skipping)');
        break;
      }

      var buff = vtpbf.fromGeojsonVt({ 'geojsonLayer': tile });
      if (!buff) {
        console.log('ERROR CREATING BUFF AT ' + z + ', ' + x + ', ' + y);
        break;
      } 

      // Create 'x' directory
      if (!fs.existsSync(path)){
          fs.mkdirSync(path);
      }

      fs.writeFileSync(path + '/' + y + '.mvt', buff);

    }
  }

  // At each zoom level, end_x and end_y will grow
  end_x = end_x * 2 + 1;
  end_y = end_y * 2 + 1;
}



