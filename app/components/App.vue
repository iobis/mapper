<template>
	<div>
		<div class="sidebar">
			<layers-component></layers-component>
			<criteria-component></criteria-component>
			<options-component></options-component>
		</div>
        <map-component v-if="sharedState.mapmode == true"></map-component>
        <data-component v-if="sharedState.mapmode == false"></data-component>
	</div>
</template>

<script>
import LayersComponent from "./LayersComponent.vue"
import CriteriaComponent from "./CriteriaComponent.vue"
import OptionsComponent from "./OptionsComponent.vue"
import MapComponent from "./MapComponent.vue"
import DataComponent from "./DataComponent.vue"
import { store } from "../store"

export default {
    data() {
        return {
            sharedState: store.state
        }
    },
	components: {
		LayersComponent,
		CriteriaComponent,
		OptionsComponent,
		MapComponent,
        DataComponent
	}
}
</script>