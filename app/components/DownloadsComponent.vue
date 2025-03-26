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
                    dataset {{ dataset.id }} <span class="smaller">{{ dataset.title }}</span><br/>
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
                <span v-if="download.criteria.dropped == 'true'">
                    only dropped records<br/>
                </span>
                <span v-if="download.criteria.dropped == 'include'">
                    dropped records included<br/>
                </span>
                <span v-if="download.criteria.absence == 'true'">
                    only absence records<br/>
                </span>
                <span v-if="download.criteria.absence == 'include'">
                    absence records included<br/>
                </span>
                <span v-if="download.criteria.redlist">
                    only Red List species<br/>
                </span>
                <span v-if="download.criteria.flags">
                    flags: {{ download.criteria.flags }}<br/>
                </span>
                <span v-if="download.criteria.exclude">
                    exclude: {{ download.criteria.exclude }}<br/>
                </span>
            </p>
            <p>
                <span v-if="download.ready">
                    <button class="btn btn-sm btn-success clickable" v-on:click="getFile(download)">
                        Download ZIP file
                    </button>
                    <button class="btn btn-sm btn-success clickable" v-on:click="copyFile(download)">
                        <span class="oi oi-clipboard"></span>
                    </button>
                </span>
                <span v-if="!download.ready">
                    <button class="btn btn-sm btn-warning">
                        Preparing file <span v-if="download.interval">({{ download.interval }})</span>
                    </button>
                </span>
            </p>
        </div>

    </div>
</template>

<script>
    import { store } from "../store"
    const config = require("../config.js")
    const copy = require("clipboard-copy")
    const util = require("../util")

    export default {
        data() {
            return {
                downloads: store.downloads
            }
        },
        methods: {
            getFile: function(download) {
                if (download.ready) {
                    if (download.s3path) {
                        window.open(config["s3"] + download.s3path)
                    } else {
                        window.open(config["s3"] + "downloads/" + download.id + ".zip")
                    }
                }
            },
            copyFile: function(download) {
                if (download.s3path) {
                    copy(config["s3"] + download.s3path)
                } else {
                    copy(config["s3"] + "downloads/" + download.id + ".zip")
                }
                util.toast("File URL copied", {
                    type: "success",
                    duration: 5000
                })
            }
        }
    }
</script>