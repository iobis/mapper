import L from "leaflet"
import api from "./api"

const getColor = function(d, colors) {
    if (colors.length == 1) {
        return colors[0]
    } else {
        if (d > 1000) {
            return colors[7]
        } else if (d > 500) {
            return colors[6]
        } else if (d > 200) {
            return colors[5]
        } else if (d > 100) {
            return colors[4]
        } else if (d > 50) {
            return colors[3]
        } else if (d > 20) {
            return colors[2]
        } else if (d > 10) {
            return colors[1]
        } else {
            return colors[0]
        }
    }
}

export const store = {
	state: {
		layers: [],
		mapmode: true,
        data: [],
		pageindex: 0,
		after: [ -1 ],
		selectedLayer: null,
		wkt: null,
		baseLayer: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
	},
    group: new L.FeatureGroup(),
    baseGroup: new L.featureGroup(),
	scales: {
		red: {
			colors: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"]
		},
		blue: {
			colors: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"]
		},
		green: {
			colors: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"]
		},
		bluemono: {
			colors: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"]
		},
		pinkmono: {
			colors: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"]
		},
		blueeven: {
			colors: ["#4292c6","#4292c6","#4292c6","#4292c6","#4292c6","#4292c6","#4292c6","#4292c6"]
		},
		redeven: {
			colors: ["#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a"]
		},
		greeneven: {
			colors: ["#41ab5d","#41ab5d","#41ab5d","#41ab5d","#41ab5d","#41ab5d","#41ab5d","#41ab5d"]
		}
	},
	addLayer: function(spec) {
		let self = this
		let criteria = {
			taxa: spec.taxa,
			startyear: spec.startyear,
			endyear: spec.endyear,
			geometry: spec.geometry
		}
		api.geo(criteria, spec.precision).then(function(response) {
		    let colors = null
            if (spec.scale == "custom") {
		        spec.colors = [ spec.customColor ]
            } else {
                spec.colors = self.scales[spec.scale].colors
            }
            let layer = L.geoJSON(response, {
				style: function (feature) {
					return {
						fillColor: getColor(feature.properties.n, spec.colors),
						weight: 0,
						fillOpacity: spec.opacity
					}
				}
			})
			layer.addTo(self.group)
			spec.layer = layer
			spec.count = null
			spec.size = 30
			self.state.layers.push(spec)
			api.count(criteria).then(function(response) {
				spec.count = response
			})
		})
	},
    removeLayer: function(layer) {
        layer.layer.removeFrom(this.group)
        let i = this.state.layers.indexOf(layer)
        this.state.layers.splice(i, 1)
    },
	reset: function() {
		this.state.after = [ -1 ]
		this.state.pageindex = 0
	},
    viewData: function(layer) {
		this.reset()
		this.state.selectedLayer = layer
        this.state.mapmode = false
		this.fetch()
    },
	fetch: function() {
		let self = this
		this.state.selectedLayer.after = this.state.after.slice(-1)[0]
		api.fetch(this.state.selectedLayer).then(function(response) {
			self.state.data = response.results
		})
	},
    showMap: function() {
        this.state.mapmode = true
    },
	nextPage: function() {
		this.state.pageindex += 1
		this.state.after.push(this.state.data.slice(-1)[0].id)
		this.fetch()
	},
	previousPage: function() {
		this.state.pageindex -= 1
		this.state.after.pop()
		this.fetch()
	},
    updateBase: function() {
	    this.baseGroup.clearLayers()
        L.tileLayer(this.state.baseLayer).addTo(this.baseGroup)
    }
}