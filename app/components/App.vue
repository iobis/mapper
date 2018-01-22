<template>
	<div>
		<div class="sidebar">

			<div id="menubar" class="sidepanel">
                <div class="menuicon" v-on:click="currentView = 'layers-component'"><span class="oi oi-layers"></span></div>
                <div class="menuicon" v-on:click="currentView = 'criteria-component'"><span class="oi oi-plus"></span></div>
                <div class="menuicon" v-on:click="currentView = 'options-component'"><span class="oi oi-wrench"></span></div>
                <div class="menuicon"><span class="oi oi-data-transfer-download"></span></div>
                <div class="menuicon"><span class="oi oi-chevron-right"></span></div>
            </div>

            <component v-bind:is="currentView">
            </component>

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
            sharedState: store.state,
            currentView: "layers-component"
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