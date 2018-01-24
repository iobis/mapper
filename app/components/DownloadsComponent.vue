<template>
    <div>
        <span class="sideheader">Downloads</span>

        <div v-if="sharedState.downloads.length == 0" class="sidepanel"><div class="content"><p class="no-results">No downloads.</p></div></div>

        <div v-for="download in sharedState.downloads" class="sidelayer">
            <p>
                <span v-for="(taxon, index) in download.criteria.taxa">
                    {{ taxon.scientificName }} <span class="smaller">{{ taxon.scientificNameAuthorship }}</span><span v-if="index < download.criteria.taxa.length - 1"><br/></span>
                </span>
                <br/>
                <span v-for="(dataset, index) in download.criteria.datasets">
                    {{ dataset.id }}<span v-if="index < download.criteria.datasets.length - 1"><br/></span>
                </span>
                <span v-if="download.criteria.startyear != null || download.criteria.endyear != null" class="smaller">
                    <br/>{{ download.criteria.startyear }} - {{ download.criteria.endyear }}
                </span>
                <span v-if="download.criteria.startdate != null || download.criteria.enddate != null" class="smaller">
                    <br/>{{ download.criteria.startdate }} - {{ download.criteria.enddate }}
                </span>
                <span v-if="download.criteria.geometry != null" class="smaller">
                    <br/>polygon filter
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

    export default {
        data() {
            return {
                sharedState: store.state
            }
        },
        methods: {
            getFile: function(download) {
                if (download.ready) {
                    window.open("http://download.iobis.org/files/" + download.hash + ".zip");
                }
            }
        }
    }
</script>