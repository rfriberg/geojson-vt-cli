# geojson-vt-cli
Tile vector data using geojson-vt on the command line

To set up, run:

```
npm install
```

Example usage:

```
node tile.js --data=./data/route.json --out=./my-tiled-data/ --zoom=3
```

`zoom` is the max zoom you want tiled.  Default is 5.