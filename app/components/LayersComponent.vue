<template>
	<div>
		<span class="sideheader">Layers</span>

		<div v-if="sharedState.layers.length == 0" class="sidepanel"><div class="content"><p class="no-results">No layers.</p></div></div>

		<div v-for="layer in sharedState.layers" class="sidelayer">
            <div class="layericons">
                <div class="layericon" v-on:click="viewData(layer)"><span class="oi oi-list"></span></div>
                <div class="layericon" v-on:click="addDownload(layer)"><span class="oi oi-data-transfer-download"></span></div>
                <div class="layericon" v-on:click="removeLayer(layer)"><span class="oi oi-x"></span></div>
            </div>
			<span v-for="(taxon, index) in layer.taxa">
				{{ taxon.scientificName }} <span class="smaller">{{ taxon.scientificNameAuthorship }}</span><span v-if="index < layer.taxa.length - 1"><br/></span>
			</span>
            <span v-if="layer.startyear != null || layer.endyear != null" class="smaller">
				<br/>{{ layer.startyear }} - {{ layer.endyear }}
			</span>
            <span v-if="layer.startdate != null || layer.enddate != null" class="smaller">
				<br/>{{ layer.startdate }} - {{ layer.enddate }}
			</span>
			<span v-if="layer.geometry != null" class="smaller">
				<br/>polygon filter
			</span>
			<br/><span class="smaller">{{ layer.count }} records</span>
			<br/><div>
			<span v-if="layer.colors.length > 1" class="colorsquare" :style="{ 'background-color': color }" v-for="color in layer.colors"></span>
			<span v-if="layer.colors.length == 1" class="colorsquarelong" :style="{ 'background-color': layer.colors[0] }"></span>
			</div>
		</div>

	</div>
</template>

<script>
import { store } from "../store"

export default {
	data() {
		return {
			sharedState: store.state
		}
	},
	methods: {
		removeLayer: function(layer) {
			store.removeLayer(layer)
		},
		viewData: function(layer) {
			store.viewData(layer)
		},
        addDownload: function(layer) {
		    store.addDownload(layer)
        }
	}
}
</script>