<template>
    <div id="data">

        <p class="top-20"><a href="#" v-on:click="close()">Back</a></p>

        <h3>Occurrences</h3>

        <nav>
            <ul class="pagination">
                <li v-bind:class="{ disabled: sharedState.dataTable.pageIndex == 0 }">
                    <span class="clickable" v-on:click="previousPageData()">&laquo;</span>
                </li>
                <li><span>{{ sharedState.dataTable.pageIndex + 1 }}</span></li>
                <li v-bind:class="{ disabled: sharedState.dataTable.data.length < config.dataTable.pageSize }">
                    <span class="clickable" v-on:click="nextPageData()">&raquo;</span>
                </li>
            </ul>
        </nav>

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
            <tr v-for="record in sharedState.dataTable.data">
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

        <nav>
            <ul class="pagination">
                <li v-bind:class="{ disabled: sharedState.checklistTable.pageIndex == 0 }">
                    <span class="clickable" v-on:click="previousPageChecklist()">&laquo;</span>
                </li>
                <li><span>{{ sharedState.checklistTable.pageIndex + 1 }}</span></li>
                <!--
                // Temporary fix for https://github.com/iobis/elastic-populate/issues/10
                <li v-bind:class="{ disabled: sharedState.checklistTable.data.length < config.checklistTable.pageSize }">
                -->
                <li>
                    <span class="clickable" v-on:click="nextPageChecklist()">&raquo;</span>
                </li>
            </ul>
        </nav>

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
            <tr v-for="record in sharedState.checklistTable.data">
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

    </div>
</template>

<script>
import { store } from "../store"
import config from "../config"
let moment = require("moment")

export default {
    data() {
        return {
            sharedState: store.state,
            config: config
        }
    },
    methods: {
        close: function() {
            store.showMap()
        },
        nextPageData: function() {
            if (store.state.dataTable.data.length == config.dataTable.pageSize) {
                store.nextPageData()
            }
        },
        previousPageData: function() {
            if (store.state.dataTable.pageIndex > 0) {
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
            if (store.state.checklistTable.pageIndex > 0) {
                store.previousPageChecklist()
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