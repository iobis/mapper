<template>
	<div>
        <div id="sidebar" v-bind:class="{ slidein: sharedState.show, slideout: !sharedState.show }">
            <div id="menubar">
                <div class="menuicon" v-if="sharedState.show" v-on:click="sharedState.show = false"><span class="oi oi-chevron-right"></span></div>
                <div class="menuicon" v-if="!sharedState.show" v-on:click="sharedState.show = true"><span class="oi oi-chevron-left"></span></div>
                <div class="menuicon" v-on:click="currentView = 'layers-component'"><span class="oi oi-layers"></span></div>
                <div class="menuicon" v-on:click="currentView = 'criteria-component'"><span class="oi oi-plus"></span></div>
                <div class="menuicon" v-on:click="currentView = 'downloads-component'"><span class="oi oi-data-transfer-download"></span></div>
                <div class="menuicon" v-on:click="currentView = 'options-component'"><span class="oi oi-wrench"></span></div>
            </div>
            <keep-alive>
                <component v-bind:is="currentView">
                </component>
            </keep-alive>
        </div>
        <map-component v-if="sharedState.mapmode == true"></map-component>
        <data-component v-if="sharedState.mapmode == false"></data-component>
    </div>
</template>

<script>
import LayersComponent from "./LayersComponent.vue"
import DownloadsComponent from "./DownloadsComponent.vue"
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
    methods: {
    },
	components: {
		LayersComponent,
        DownloadsComponent,
		CriteriaComponent,
		OptionsComponent,
		MapComponent,
        DataComponent
	}
}
</script>