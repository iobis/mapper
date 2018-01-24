import L from "leaflet"
import api from "./api"
import util from "./util"

export const store = {
	state: {
		layers: [],
		mapmode: true,
        data: [],
		pageindex: 0,
		after: [ -1 ],
		selectedLayer: null,
		wkt: null,
		baseLayer: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
		show: true
	},
    group: new L.FeatureGroup(),
    baseGroup: new L.featureGroup(),
	scales: util.makeScales(),
	addLayer: function(spec) {
		let self = this
		let criteria = {
			taxa: spec.taxa,
			startyear: spec.startyear,
			endyear: spec.endyear,
			geometry: spec.geometry
		}
		api.geo(criteria, spec.precision).then(function(response) {
            if (spec.scale == "custom") {
		        spec.colors = [ spec.customColor ]
            } else {
                spec.colors = self.scales[spec.scale].colors
            }
            let layer = L.geoJSON(response, {
				style: function (feature) {
					return {
						fillColor: util.getColor(feature.properties.n, spec.colors),
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