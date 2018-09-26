<template>
    <div id="data">

        <p class="top-20"><a href="#" v-on:click="close()">Back</a></p>

        <h3>Summary</h3>

        <table class="table table-sm table-condensed table-nonfluid" v-if="store.statistics">
            <thead>
                <tr>
                    <th>records</th>
                    <th>species</th>
                    <th>taxa</th>
                    <th>years</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ store.statistics.records }}</td>
                    <td>{{ store.statistics.species }}</td>
                    <td>{{ store.statistics.taxa }}</td>
                    <td>{{ store.statistics.yearrange[0] }} - {{ store.statistics.yearrange[1] }}</td>
                </tr>
            </tbody>
        </table>

        <h3>Occurrences</h3>

        <ul class="pagination">
            <li v-bind:class="{ disabled: store.dataTable.pageIndex == 0 }">
                <span class="clickable" v-on:click="previousPageData()">&laquo;</span>
            </li>
            <li><span>{{ store.dataTable.pageIndex + 1 }}</span></li>
            <li v-bind:class="{ disabled: store.dataTable.data.length < config.dataTable.pageSize }">
                <span class="clickable" v-on:click="nextPageData()">&raquo;</span>
            </li>
        </ul>

        <table class="table table-sm table-condensed">
            <thead>
            <tr>
                <th>ID</th>
                <th>dataset ID</th>
                <th>scientificName</th>
                <th>eventDate</th>
                <th>decimalLongitude</th>
                <th>decimalLatitude</th>
                <th>institutionCode</th>
                <th>collectionCode</th>
                <th>catalogNumber</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="record in store.dataTable.data">
                <td>{{ record.id }}</td>
                <td>{{ record.resource_id }}</td>
                <td>{{ record.scientificName }}</td>
                <td>{{ record.eventDate | eventdate }}</td>
                <td>{{ record.decimalLongitude | coordinate }}</td>
                <td>{{ record.decimalLatitude | coordinate }}</td>
                <td>{{ record.institutionCode }}</td>
                <td>{{ record.collectionCode }}</td>
                <td>{{ record.catalogNumber }}</td>
            </tr>
            </tbody>
        </table>

        <h3>Checklist</h3>

        <ul class="pagination pagination-sm">
            <li v-bind:class="{ disabled: store.checklistTable.pageIndex == 0 }">
                <span class="clickable" v-on:click="previousPageChecklist()">&laquo;</span>
            </li>
            <li><span>{{ store.checklistTable.pageIndex + 1 }}</span></li>
            <!--
            // Temporary fix for https://github.com/iobis/elastic-populate/issues/10
            <li v-bind:class="{ disabled: sharedState.checklistTable.data.length < config.checklistTable.pageSize }">
            -->
            <li>
                <span class="clickable" v-on:click="nextPageChecklist()">&raquo;</span>
            </li>
        </ul>

        <table class="table table-sm table-condensed">
            <thead>
            <tr>
                <th>ID</th>
                <th>scientificName</th>
                <th>records</th>
                <th>phylum</th>
                <th>class</th>
                <th>order</th>
                <th>family</th>
                <th>genus</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="record in store.checklistTable.data">
                <td>{{ record.taxonID }}</td>
                <td>{{ record.scientificName }}</td>
                <td>{{ record.records }}</td>
                <td>{{ record.phylum }}</td>
                <td>{{ record.class }}</td>
                <td>{{ record.order }}</td>
                <td>{{ record.family }}</td>
                <td>{{ record.genus }}</td>
            </tr>
            </tbody>
        </table>

        <h3>Datasets</h3>

        <ul class="pagination pagination-sm">
            <li v-bind:class="{ disabled: store.datasetTable.pageIndex == 0 }">
                <span class="clickable" v-on:click="previousPageDataset()">&laquo;</span>
            </li>
            <li><span>{{ store.datasetTable.pageIndex + 1 }}</span></li>
            <li>
                <span class="clickable" v-on:click="nextPageDataset()">&raquo;</span>
            </li>
        </ul>

        <table class="table table-sm table-condensed">
            <thead>
            <tr>
                <th>ID</th>
                <th>name</th>
                <th>records</th>
                <th>URL</th>
                <th>abstract</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="record in store.datasetTable.data">
                <td>{{ record.id }}</td>
                <td>{{ record.resname }}</td>
                <td>{{ record.records }}</td>
                <td><a v-bind:href="record.digirurl" target="_blank">{{ record.digirurl }}</a></td>
                <td>{{ record.abstract }}</td>
            </tr>
            </tbody>
        </table>

    </div>
</template>

<script>
import { store } from "../store"
import config from "../config"
let moment = require("moment")

export default {
    data() {
        return {
            store: store,
            config: config
        }
    },
    mounted() {
    },
    methods: {
        close: function() {
            store.showMap()
        },
        nextPageData: function() {
            if (store.dataTable.data.length == config.dataTable.pageSize) {
                store.nextPageData()
            }
        },
        previousPageData: function() {
            if (store.dataTable.pageIndex > 0) {
                store.previousPageData()
            }
        },
        nextPageChecklist: function() {
            // Temporary fix for https://github.com/iobis/elastic-populate/issues/10
            // if (store.state.checklistTable.data.length == config.checklistTable.pageSize) {
            store.nextPageChecklist()
            // }
        },
        previousPageChecklist: function() {
            if (store.checklistTable.pageIndex > 0) {
                store.previousPageChecklist()
            }
        },
        nextPageDataset: function() {
            store.nextPageDataset()
        },
        previousPageDataset: function() {
            if (store.datasetTable.pageIndex > 0) {
                store.previousPageDataset()
            }
        }
    },
	filters: {
		coordinate: function(value) {
			if (!value) {
				return ""
			} else {
				return value.toFixed(4)
			}
		},
		eventdate: function(value) {
			if (!value) {
				return ""
			} else {
				return moment(value).format("YYYY-MM-DD")
			}
		}
	}
}
</script>