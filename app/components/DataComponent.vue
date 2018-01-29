<template>
    <div id="data">

        <nav>
            <ul class="pagination">
                <li v-bind:class="{ disabled: sharedState.pageindex == 0 }">
                    <a v-on:click="previousPage()" href="#"><span aria-hidden="true">&laquo;</span></a>
                </li>
                <li><a>{{ sharedState.pageindex + 1 }}</a></li>
                <li v-bind:class="{ disabled: sharedState.data.length < config.pagesize }">
                    <a class="clickable" v-on:click="nextPage()" href="#"><span aria-hidden="true">&raquo;</span></a>
                </li>
            </ul>
            <ul class="pagination back">
                <li><a href="#" v-on:click="close()">Close</a></li>
            </ul>
        </nav>

        <table class="table table-sm">
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
                <tr v-for="record in sharedState.data">
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
        nextPage: function() {
            if (store.state.data.length == config.pagesize) {
                store.nextPage()
            }
        },
        previousPage: function() {
        	if (store.state.pageindex > 0) {
        		store.previousPage()
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