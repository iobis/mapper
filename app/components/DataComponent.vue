<template>
    <div id="data">

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
                    <td>{{ record.eventDate }}</td>
                    <td>{{ record.decimalLongitude }}</td>
                    <td>{{ record.decimalLatitude }}</td>
                    <td>{{ record.institutionCode }}</td>
                    <td>{{ record.collectionCode }}</td>
                    <td>{{ record.catalogNumber }}</td>
                </tr>
            </tbody>
        </table>

        <p>
            <button class="btn btn-success" v-on:click="close()">back</button>
        </p>

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
        close: function() {
            store.showMap()
        }
    }
}
</script>