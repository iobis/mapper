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
            <div class="right-30">
                <span v-for="(taxon, index) in layer.taxa">
                    {{ taxon.scientificName }} <span class="smaller">{{ taxon.scientificNameAuthorship }}</span><br/>
                </span>
                <span v-for="(dataset, index) in layer.datasets">
                    dataset {{ dataset.id }} <span class="smaller">{{ dataset.title }}</span><br/>
                </span>
                <span v-for="(node, index) in layer.nodes">
                    node {{ node.id }} <span class="smaller">{{ node.name }}</span><br/>
                </span>
                <span v-for="(institute, index) in layer.institutes">
                    institute {{ institute.id }} <span class="smaller">{{ institute.name }}</span><br/>
                </span>
                <span v-for="(area, index) in layer.areas">
                    area {{ area.id }} <span class="smaller">{{ area.name }}</span><br/>
                </span>
                <span v-for="(item, index) in layer.countries">
                    country {{ item.id }} <span class="smaller">{{ item.country }}</span><br/>
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
                <span v-if="layer.dropped == 'true'">
                    only dropped records<br/>
                </span>
                <span v-if="layer.dropped == 'include'">
                    dropped records included<br/>
                </span>
                <span v-if="layer.absence == 'true'">
                    only absence records<br/>
                </span>
                <span v-if="layer.absence == 'include'">
                    absence records included<br/>
                </span>
                <span v-if="layer.redlist">
                    only Red List species<br/>
                </span>
                <span v-if="layer.flags">
                    flags: {{ layer.flags }}<br/>
                </span>
                <span v-if="layer.exclude">
                    exclude: {{ layer.exclude }}<br/>
                </span>
                <span class="smaller">{{ layer.count | number }} records</span><br/>
                <div class="layer   legend">
                    <span v-bind:title="getColorLabel(index)" v-if="layer.colors.length > 1" class="colorsquare" :style="{ 'background-color': color }" v-for="(color, index) in layer.colors"></span>
                    <span v-if="layer.colors.length == 1" class="colorsquarelong" :style="{ 'background-color': layer.colors[0] }"></span>
                </div>
            </div>
		</div>

        <div id="downloadModal" class="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">Confirmation</h4>
                    </div>
                    <div class="modal-body">
                        <p>Please enter your e-mail address. You will receive an e-mail notification once your file is ready. Make sure to check your spam folder. Separate multiple e-mail addresses with a semicolon.</p>
                        <p>
                            <input type="email" class="form-control" placeholder="E-mail address" v-model="store.email">
                        </p>
                        <div class="alert alert-danger" v-if="downloadRecords > 2000000">
                            <p>You are about to download {{ downloadRecords | number }} records, which can take a while. Are you sure? Please go to <a href="https://obis.org/manual/access/" target="_blank">https://obis.org/manual/access/</a> for a faster download of the entire OBIS dataset.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">No, thanks</button>
                        <button type="button" class="btn btn-primary" :disabled="!validateEmail(store.email)" v-on:click="confirmDownload()" data-dismiss="modal">Yes, proceed</button>
                    </div>
                </div>
            </div>
        </div>

	</div>

</template>

<script>
import { store } from "../store"
import util from "../util"

export default {
	data() {
		return {
			store: store,
            downloadRecords: null,
            downloadLayer: null
		}
	},
	methods: {
        validateEmail(email) {
            if (!email) return false;
            const emails = email.trim().split(/[,; ]+/);
            if (emails.length < 1) return false;
            for (let i = 0; i < emails.length; i++) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(emails[i])) {
                    return false;
                }
            }
            return true;
        },
	    getColorLabel(i) {
	        return util.getColorLabels(i)
        },
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
            this.downloadRecords = layer.count;
            this.downloadLayer = layer;
            $("#downloadModal").modal("show");
        },
        confirmDownload: function() {
            store.addDownload(this.downloadLayer);
        }
	}
}
</script>