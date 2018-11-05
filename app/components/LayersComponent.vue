<template>
	<div>
		<span class="sideheader">Layers</span>

		<div v-if="store.layers.length == 0" class="sidepanel">
			<div class="panelcontent"><p class="no-results">No layers.</p></div>
		</div>

        <div v-for="layer in store.layers" class="sidelayer">
            <div class="layericons">
                <div class="btn-group">
                    <button type="button" class="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="oi oi-menu"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right">
                        <li><a href="#" v-on:click="togglePoints(layer)">Toggle points</a></li>
                        <li><a href="#" v-on:click="viewData(layer)">View data</a></li>
                        <li><a href="#" v-on:click="editData(layer)">Edit</a></li>
                        <li><a href="#" v-on:click="addDownload(layer)">Download</a></li>
                        <li><a href="#" v-on:click="removeLayer(layer)">Delete</a></li>
                    </ul>
                </div>
            </div>
			<span v-for="(taxon, index) in layer.taxa">
				{{ taxon.scientificName }} <span class="smaller">{{ taxon.scientificNameAuthorship }}</span><br/>
			</span>
			<span v-for="(dataset, index) in layer.datasets">
				dataset {{ dataset.id }} <span class="smaller">{{ dataset.title }}</span><br/>
			</span>
			<span v-for="(node, index) in layer.nodes">
				node {{ node.id }} <span class="smaller">{{ node.name }}</span><br/>
			</span>
			<span v-for="(area, index) in layer.areas">
				area {{ area.id }} <span class="smaller">{{ area.name }}</span><br/>
			</span>
            <span v-if="layer.startyear || layer.endyear" class="smaller">
				{{ layer.startyear }} &rarr; {{ layer.endyear }}<br/>
			</span>
			<span v-if="layer.startdate || layer.enddate" class="smaller">
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
			store: store
		}
	},
	methods: {
		removeLayer: function(layer) {
			store.removeLayer(layer)
		},
		viewData: function(layer) {
			store.viewData(layer)
		},
		editData: function(layer) {
			store.loadCriteria(layer)
		},
		togglePoints: function(layer) {
			store.togglePoints(layer)
		},
        addDownload: function(layer) {
		    store.addDownload(layer)
        }
	}
}
</script>