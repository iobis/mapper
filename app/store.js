import L from "leaflet"
import api from "./api"

const getColor = function(d) {
	return d > 1000 ? '#800026' :
		d > 500  ? '#BD0026' :
			d > 200  ? '#E31A1C' :
				d > 100  ? '#FC4E2A' :
					d > 50   ? '#FD8D3C' :
						d > 20   ? '#FEB24C' :
							d > 10   ? '#FED976' :
								'#FFEDA0'
}

const style = function(feature) {
	return {
		fillColor: getColor(feature.properties.n),
		weight: 0,
		fillOpacity: 0.7
	}
}

export const store = {
	state: {
		layers: new L.FeatureGroup()
	},
	addLayer: function(name) {
		let self = this
		let criteria = {
			name: name
		}
		api.geo(criteria, 3).then(function(response) {

			L.geoJSON(response, {style: style}).addTo(self.state.layers)

		})
	}
}