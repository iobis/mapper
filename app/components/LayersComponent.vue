<template>
	<div>
		<span class="sideheader">Layers</span>
		<div class="sidepanel">
			<div class="content">
                <span v-if="sharedState.layers.length == 0"><i>No layers.</i></span>
				<ul v-if="sharedState.layers.length > 0" class="suggestions">
					<li v-for="layer in sharedState.layers" class="layerbox">
						<div class="closeicon pull-right">
							<span class="oi oi-x clickable" v-on:click="removeLayer(layer)"></span>
							<br/><span class="oi oi-grid-three-up clickable" v-on:click="viewData(layer)"></span>
						</div>

						<span v-for="(taxon, index) in layer.taxa">
							{{ taxon.scientificName }} <span class="count">{{ taxon.scientificNameAuthorship }}</span><span v-if="index < layer.taxa.length - 1"><br/></span>
						</span>

						<span v-if="layer.startyear != null || layer.endyear != null" class="count">
							<br/>{{ layer.startyear }} - {{ layer.endyear }}
						</span>
						<span v-if="layer.geometry != null" class="count">
							<br/>polygon filter
						</span>
						<br/><span class="count">{{ layer.count }} records</span>
						<br/><div>
						<span v-if="layer.colors.length > 1" class="colorsquare" :style="{ 'background-color': color }" v-for="color in layer.colors"></span>
						<span v-if="layer.colors.length == 1" class="colorsquarelong" :style="{ 'background-color': layer.colors[0] }"></span>
						</div>
					</li>
				</ul>
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
		}
	}
}
</script>