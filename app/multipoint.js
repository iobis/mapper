import L from "leaflet"
import * as d3 from "d3"

module.exports = L.GridLayer.extend({
	options: {
		radius: 4,
		fill: "#cc3300",
		stroke: "#ffffff",
		strokeWidth: 1.3,
		onClick: null,
		onTileCounted: null
	},
	initialize: function(url, options) {
		this._url = url;
		L.GridLayer.prototype.initialize.call(this, options);
	},
	onAdd: function() {
		L.GridLayer.prototype.onAdd.apply(this, arguments);
		var self = this;
		var svg = L.svg();
		svg.addTo(this._map);
		this._transform = function(d) {
			var point = self._map.latLngToLayerPoint(new L.LatLng(d[1], d[0]));
			return [point.x, point.y];
		}
	},
	getTileUrl: function(coords) {
		let result = this._url.replace("{x}", coords.x).replace("{y}", coords.y).replace("{z}", coords.z);
		return result;
	},
	_removeTile: function(key) {
		var tile = this._tiles[key];
		if (!tile) { return; }
		tile.request.abort();
		if (tile.el) tile.el.remove();
		delete this._tiles[key];
	},
	_addTile: function(coords) {
		var self = this;
		var key = this._tileCoordsToKey(coords);
		this._tiles[key] = {
            coords: coords,
            current: true,
            request: d3.json(this.getTileUrl(this._wrapCoords(coords)), function (res) {
                setTimeout(function () {
                    if (self._tiles[key]) {
                        for (var i = 0; i < res.coordinates.length; i++) {
                            res.coordinates[i] = res.coordinates[i].concat(self._transform(res.coordinates[i]));
						}
                        var g = d3.select("#map").select("svg").append("g").attr("class", "leaflet-zoom-hide");
                        self._tiles[key].el = g.selectAll("circle")
                            .data(res.coordinates)
                            .enter()
                            .append("circle")
                            .style("pointer-events", "visible")
                            .style("cursor", "pointer")
                            .attr("fill", self.options.fill)
                            .style("stroke-width", self.options.strokeWidth)
                            .style("stroke", self.options.stroke)
                            .attr("cx", function (d) {
                                return d[2];
                            })
                            .attr("cy", function (d) {
                                return d[3];
                            })
                            .attr("r", self.options.radius)
                        if (self.options.onTileCounted) {
                            self.options.onTileCounted(res.coordinates.length)
                        }
                        if (self.options.onClick) {
                            self._tiles[key].el.on("click", self.options.onClick);
                        }
                    }
                }, 400);
            })
        };
	}
});