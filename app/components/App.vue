<template>
	<div>
		<div class="sidebar">
			<layers-component></layers-component>
			<criteria-component></criteria-component>
		</div>
		<map-component></map-component>
	</div>
</template>

<script>
	import LayersComponent from "./LayersComponent.vue"
	import CriteriaComponent from "./CriteriaComponent.vue"
	import MapComponent from "./MapComponent.vue"
	export default {
		components: {
			LayersComponent,
			CriteriaComponent,
			MapComponent
		}
	}
</script>