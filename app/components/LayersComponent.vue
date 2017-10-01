<template>
	<div>
		<a class="sideheader" data-toggle="collapse" href="#collapse1" aria-expanded="true" aria-controls="collapse1">Layers</a>
		<div class="collapse show sidepanel" id="collapse1">
			<div class="content">
				<ul v-if="sharedState.layers.length > 0" class="suggestions">
					<li v-for="layer in sharedState.layers">
						<div class="closeicon pull-right">
							<span class="oi oi-x clickable" v-on:click="removeLayer(layer)"></span>
						</div>
						{{ layer.name }}
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
		}
	}
}
</script>