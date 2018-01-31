<template>
	<div id="map" ref="map"></div>
</template>

<script>
import api from "../api"
import L from "leaflet"
import { store } from "../store"
import Wkt from "wicket/wicket"
require("leaflet-draw")

export default {
	data() {
		return {
			map: null
		}
	},
	mounted() {
		const wkt = function(layer) {
			let points = []
			for (let l = 0; l < layer._latlngs[0].length; l++) {
				points.push(layer._latlngs[0][l].lng.toFixed(4) + " " + layer._latlngs[0][l].lat.toFixed(4))
			}
			points.push(layer._latlngs[0][0].lng.toFixed(4) + " " + layer._latlngs[0][0].lat.toFixed(4))
			return "POLYGON ((" + points.join(", ") + "))"
		}
		let el = this.$refs.map
		this.map = L.map(el, {
			minZoom: 1,
			attributionControl: false
		}).setView([20, 0], 2)
		store.map = this.map
		store.group.addTo(this.map)
		store.baseGroup.addTo(this.map)
		let drawControl = new L.Control.Draw({
			draw: {
				polyline: false,
				polygon: {
					allowIntersection: false,
					drawError: {
						color: "#cc3300"
					},
					icon: new L.DivIcon({
						iconSize: new L.Point(10, 10),
						className: "leaflet-div-icon leaflet-editing-icon"
					})
				},
				circle: false,
				rectangle: false,
				marker: false,
				circlemarker: false
			}
		})
		this.map.addControl(drawControl)
		this.map.on(L.Draw.Event.CREATED, function(e) {
			let layer = e.layer
			store.state.wkt = wkt(layer)
		})
		store.updateBase()
	},
	methods: {
	}
}
</script>