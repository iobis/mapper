<template>
    <div>

        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">System maintenance 13/05/2021</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>The OBIS system is undergoing maintenance on 13/05/2021. Downloads can take a while to be processed. Full exports of the database are still available from <a href="https://obis.org/manual/access/">https://obis.org/manual/access/</a>.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="sidebar" v-bind:class="{ slidein: store.show, slideout: !store.show }">
            <div id="menubar">
                <div class="menuicon" v-if="store.show" v-on:click="store.show = false"><span class="oi oi-chevron-right"></span></div>
                <div class="menuicon" v-if="!store.show" v-on:click="store.show = true"><span class="oi oi-chevron-left"></span></div>
                <div data-toggle="tooltip" title="Layers" data-placement="bottom" class="menuicon" v-bind:class="{ active: store.currentView == 'layers-component' }" v-on:click="store.currentView = 'layers-component'"><span class="oi oi-layers"></span></div>
                <div data-toggle="tooltip" title="Criteria" data-placement="bottom" class="menuicon" v-bind:class="{ active: store.currentView == 'criteria-component' }" v-on:click="store.currentView = 'criteria-component'"><span class="oi oi-plus"></span></div>
                <div data-toggle="tooltip" title="Downloads" data-placement="bottom" class="menuicon" v-bind:class="{ active: store.currentView == 'downloads-component' }" v-on:click="store.currentView = 'downloads-component'"><span class="oi oi-data-transfer-download"></span></div>
                <div data-toggle="tooltip" title="Options" data-placement="bottom" class="menuicon" v-bind:class="{ active: store.currentView == 'options-component' }" v-on:click="store.currentView = 'options-component'"><span class="oi oi-wrench"></span></div>
                <div data-toggle="tooltip" title="Help" data-placement="bottom" class="menuicon" v-bind:class="{ active: store.currentView == 'help-component' }" v-on:click="store.currentView = 'help-component'"><span class="oi oi-info"></span></div>
            </div>
            <keep-alive>
                <component v-bind:is="store.currentView">
                </component>
            </keep-alive>
        </div>
        <keep-alive>
            <map-component v-if="store.mapMode == true"></map-component>
        </keep-alive>
        <data-component v-if="store.mapMode == false"></data-component>
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

    $(document).ready(function() {
        $(".modal").modal();
    });

	export default {
		data() {
			return {
				store: store
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