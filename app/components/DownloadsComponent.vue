<template>
    <div>
        <span class="sideheader">Downloads</span>

        <div v-if="downloads.length == 0" class="sidepanel">
            <div class="panelcontent"><p class="no-results">No downloads.</p></div>
        </div>

        <div v-for="download in downloads" class="sidelayer">
            <p>
                <span v-for="(taxon, index) in download.criteria.taxa">
                    {{ taxon.scientificName }} <span class="smaller">{{ taxon.scientificNameAuthorship }}</span><br/>
                </span>
                <span v-for="(dataset, index) in download.criteria.datasets">
                    dataset {{ dataset.id }} <span class="smaller">{{ dataset.resname }}</span><br/>
                </span>
                <span v-for="(node, index) in download.criteria.nodes">
                    node {{ node.id }} <span class="smaller">{{ node.name }}</span><br/>
                </span>
                <span v-for="(area, index) in download.criteria.areas">
                    area {{ area.id }} <span class="smaller">{{ area.name }}</span><br/>
                </span>
                <span v-if="download.criteria.startyear || download.criteria.endyear" class="smaller">
                    {{ download.criteria.startyear }} &rarr; {{ download.criteria.endyear }}<br/>
                </span>
                <span v-if="download.criteria.startdate || download.criteria.enddate" class="smaller">
                    {{ download.criteria.startdate }} &rarr; {{ download.criteria.enddate }}<br/>
                </span>
                <span v-if="download.criteria.startdepth || download.criteria.enddepth" class="smaller">
                    {{ download.criteria.startdepth }} &rarr; {{ download.criteria.enddepth }}<br/>
                </span>
                <span v-if="download.criteria.geometry != null" class="smaller">
                    polygon filter set<br/>
                </span>
            </p>
            <p>
                <button class="btn btn-sm clickable" v-bind:class="{ 'btn-warning': !download.ready, 'btn-success': download.ready }" v-on:click="getFile(download)">
                    <span v-if="download.ready">
                        {{ download.hash }}
                    </span>
                    <span v-if="!download.ready">
                        Progress: {{ download.records }} / {{ download.total }}
                    </span>
                </button>
            </p>
        </div>

    </div>
</template>

<script>
    import { store } from "../store"
    const config = require("../config.js")

    export default {
        data() {
            return {
                downloads: store.downloads
            }
        },
        methods: {
            getFile: function(download) {
                if (download.ready) {
                    window.open(config["files"] + download.hash + ".zip");
                }
            }
        }
    }
</script>