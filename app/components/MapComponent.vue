<template>
	<div id="map" ref="map"></div>
</template>

<script>
import api from "../api"
import L from "leaflet"
import { store } from "../store"

export default {
	data() {
		return {
			map: null,
			layers: null
		}
	},
	mounted() {
		let el = this.$refs.map
		this.map = L.map(el, {
			minZoom: 1,
			attributionControl: false
		}).setView([20, 0], 2)
		L.tileLayer("http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png").addTo(this.map)
		store.state.layers.addTo(this.map)
	},
	methods: {
	}
}
</script>