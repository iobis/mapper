<template>
    <div>
        <div id="sidebar" v-bind:class="{ slidein: sharedState.show, slideout: !sharedState.show }">
            <div id="menubar">
                <div class="menuicon" v-if="sharedState.show" v-on:click="sharedState.show = false"><span class="oi oi-chevron-right"></span></div>
                <div class="menuicon" v-if="!sharedState.show" v-on:click="sharedState.show = true"><span class="oi oi-chevron-left"></span></div>
                <div data-toggle="tooltip" title="Layers" data-placement="bottom" class="menuicon" v-bind:class="{ active: sharedState.currentView == 'layers-component' }" v-on:click="sharedState.currentView = 'layers-component'"><span class="oi oi-layers"></span></div>
                <div data-toggle="tooltip" title="Criteria" data-placement="bottom" class="menuicon" v-bind:class="{ active: sharedState.currentView == 'criteria-component' }" v-on:click="sharedState.currentView = 'criteria-component'"><span class="oi oi-plus"></span></div>
                <div data-toggle="tooltip" title="Downloads" data-placement="bottom" class="menuicon" v-bind:class="{ active: sharedState.currentView == 'downloads-component' }" v-on:click="sharedState.currentView = 'downloads-component'"><span class="oi oi-data-transfer-download"></span></div>
                <div data-toggle="tooltip" title="Options" data-placement="bottom" class="menuicon" v-bind:class="{ active: sharedState.currentView == 'options-component' }" v-on:click="sharedState.currentView = 'options-component'"><span class="oi oi-wrench"></span></div>
                <div data-toggle="tooltip" title="Help" data-placement="bottom" class="menuicon" v-bind:class="{ active: sharedState.currentView == 'help-component' }" v-on:click="sharedState.currentView = 'help-component'"><span class="oi oi-info"></span></div>
            </div>
            <keep-alive>
                <component v-bind:is="sharedState.currentView">
                </component>
            </keep-alive>
        </div>
        <keep-alive>
            <map-component v-if="sharedState.mapMode == true"></map-component>
        </keep-alive>
        <data-component v-if="sharedState.mapMode == false"></data-component>
    </div>
</template>

<script>
	import LayersComponent from "./LayersComponent.vue"
	import DownloadsComponent from "./DownloadsComponent.vue"
	import CriteriaComponent from "./CriteriaComponent.vue"
	import OptionsComponent from "./OptionsComponent.vue"
	import MapComponent from "./MapComponent.vue"
	import DataComponent from "./DataComponent.vue"
	import HelpComponent from "./HelpComponent.vue"
	import { store } from "../store"
	import util from "../util"

	export default {
		data() {
			return {
				sharedState: store.state
			}
		},
		mounted: function() {
			store.populate()
		},
		methods: {
		},
		components: {
			LayersComponent,
			DownloadsComponent,
			CriteriaComponent,
			OptionsComponent,
			MapComponent,
			DataComponent,
			HelpComponent
		}
	}
</script>