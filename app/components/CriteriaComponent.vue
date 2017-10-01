<template>
	<div>
		<a class="sideheader" data-toggle="collapse" href="#collapse2" aria-expanded="true" aria-controls="collapse2">Criteria</a>
		<div class="collapse show sidepanel" id="collapse2">
			<div class="content">

				<div class="form-group">
					<label>Scientific name</label>
					<input type="text" class="form-control" v-on:input="debounceInput" v-model="name">
				</div>
				<ul v-if="suggestions.length > 0" class="suggestions">
					<li class="clickable" v-for="suggestion in suggestions" v-on:click="select">{{ suggestion }}</li>
				</ul>
				<button class="btn btn-success clickable" :disabled="name == ''" v-on:click="addLayer">Add layer</button>

			</div>
		</div>
	</div>
</template>

<script>
import api from "../api"
import { store } from "../store"

export default {
	data() {
		return {
			suggestions: [],
			name: ""
		}
	},
	methods: {
		debounceInput: _.debounce(function(e) {
			let self = this
			api.complete(e.target.value).then(function(response) {
				self.suggestions = response
			})
		}, 500),
		select: function(event) {
			this.name = event.target.innerHTML
			this.suggestions = []
		},
		addLayer: function() {
			store.addLayer(this.name)
		}
	}
}
</script>