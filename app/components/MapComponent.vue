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
			map: null
		}
	},
	mounted() {
		let el = this.$refs.map
		this.map = L.map(el, {
			minZoom: 1,
			attributionControl: false
		}).setView([20, 0], 2)
		store.group.addTo(this.map)
		store.baseGroup.addTo(this.map)
		store.updateBase()
	},
	methods: {
	}
}
</script>