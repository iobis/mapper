<template>
	<div>
		<a class="sideheader" data-toggle="collapse" href="#collapse1" aria-expanded="true" aria-controls="collapse1">Layers</a>
		<div class="collapse show sidepanel" id="collapse1">
			<div class="content">
                <span v-if="sharedState.layers.length == 0"><i>No layers.</i></span>
				<ul v-if="sharedState.layers.length > 0" class="suggestions">
					<li v-for="layer in sharedState.layers">
						<div class="closeicon pull-right">
							<span class="oi oi-x clickable" v-on:click="removeLayer(layer)"></span>
							<br/><span class="oi oi-grid-three-up clickable" v-on:click="viewData(layer)"></span>
						</div>
						{{ layer.name }}
						<span v-if="layer.startyear != null || layer.endyear != null" class="count">
							<br/>{{ layer.startyear }} - {{ layer.endyear }}
						</span>
						<br/><span class="count">{{ layer.count }} records</span>
						<br/><div>
							<span class="colorsquare" :style="{ 'background-color': color }" v-for="color in layer.colors"></span>
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