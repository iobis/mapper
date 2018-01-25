<template>
	<div>
		<span class="sideheader">Layers</span>

		<div v-if="sharedState.layers.length == 0" class="sidepanel">
			<div class="panelcontent"><p class="no-results">No layers.</p></div>
		</div>

		<div v-for="layer in sharedState.layers" class="sidelayer">
            <div class="layericons">
                <div class="layericon" v-on:click="viewData(layer)"><span class="oi oi-list"></span></div>
                <div class="layericon" v-on:click="addDownload(layer)"><span class="oi oi-data-transfer-download"></span></div>
                <div class="layericon" v-on:click="removeLayer(layer)"><span class="oi oi-x"></span></div>
            </div>
			<span v-for="(taxon, index) in layer.taxa">
				{{ taxon.scientificName }} <span class="smaller">{{ taxon.scientificNameAuthorship }}</span><br/>
			</span>
			<span v-for="(dataset, index) in layer.datasets">
				dataset {{ dataset.id }} <span class="smaller">{{ dataset.resname }}</span><br/>
			</span>
			<span v-for="(area, index) in layer.areas">
				area {{ area.id }} <span class="smaller">{{ area.name }}</span><br/>
			</span>
            <span v-if="layer.startyear != null || layer.endyear != null" class="smaller">
				{{ layer.startyear }} &rarr; {{ layer.endyear }}<br/>
			</span>
			<span v-if="layer.startdate != null || layer.enddate != null" class="smaller">
				{{ layer.startdate }} &rarr; {{ layer.enddate }}<br/>
			</span>
			<span v-if="layer.startdepth || layer.enddepth" class="smaller">
				{{ layer.startdepth }} &rarr; {{ layer.enddepth }}<br/>
			</span>
			<span v-if="layer.geometry != null" class="smaller">
				polygon filter set<br/>
			</span>
			<span class="smaller">{{ layer.count }} records</span><br/>
			<div class="layerlegend">
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