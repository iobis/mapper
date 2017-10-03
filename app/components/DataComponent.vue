<template>
    <div id="data">

        <p>
            <button class="btn btn-primary clickable" v-on:click="previousPage()" :disabled="sharedState.pageindex == 0">Previous</button>
            <button class="btn btn-primary clickable" v-on:click="nextPage()">Next</button>
            <button class="btn btn-success clickable" v-on:click="close()">Close</button>
        </p>

        <table class="table table-sm">
            <thead>
                <tr>
                    <th>id</th>
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
let moment = require("moment")

export default {
    data() {
        return {
            sharedState: store.state
        }
    },
    methods: {
        close: function() {
            store.showMap()
        },
        nextPage: function() {
            store.nextPage()
        },
        previousPage: function() {
        	store.previousPage()
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