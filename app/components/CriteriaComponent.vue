<template>
	<div>
		<div class="sideheader">Create layer
            <button class="btn btn-success btn-sm clickable pull-right-vertical right-10" :disabled="disableAdd" v-on:click="addLayer">Add</button>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse1" aria-expanded="true" aria-controls="collapse1">Scientific name</div>

        <div class="sidepanel collapse in" id="collapse1">
            <div class="panelcontent">
                <div class="form-group">
                    <input id="nameInput" class="form-control" type="text" placeholder="Enter scientific name" ref="nameInput">
                    <typeahead v-model="selectedTaxon" target="#nameInput" :async-function="complete" item-key="scientificName" :force-select="true" :debounce="500">
                        <template slot="item" scope="props">
                            <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
                                <a role="button" @click="props.select(item)">
                                    {{ item.scientificName }} <span class="smaller">{{ item.scientificNameAuthorship }}</span>
                                    <br/><span class="smaller">Taxon ID: {{ item.acceptedNameUsageID }}</span>
                                </a>
                            </li>
                        </template>
                    </typeahead>
                </div>
                <table class="table no-bottom-margin">
                    <thead>
                    <tr>
                        <th>Scientific name</th>
                        <th>Taxon ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="!taxa || taxa.length == 0">
                        <td class="no-results">No taxa selected.</td><td></td>
                    </tr>
                    <tr v-for="(taxon, index) in taxa" v-on:click="removeTaxon(index)" class="clickable">
                        <td>{{ taxon.scientificName }} {{ taxon.scientificNameAuthorship }}</td>
                        <td>{{ taxon.acceptedNameUsageID }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse2" aria-expanded="true" aria-controls="collapse2">Datasets</div>

        <div class="sidepanel collapse" id="collapse2">
            <div class="panelcontent">
                <div class="form-group">
                    <input id="datasetInput" class="form-control" type="text" placeholder="Enter dataset name" ref="datasetInput">
                    <typeahead v-model="selectedDataset" target="#datasetInput" :async-function="completeDataset" item-key="resname" :force-select="true" :debounce="500">
                        <template slot="item" scope="props">
                            <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
                                <a role="button" @click="props.select(item)">
                                    {{ item.resname }}
                                    <br/><span class="smaller">Dataset ID: {{ item.id }}</span>
                                </a>
                            </li>
                        </template>
                    </typeahead>
                </div>
                <table class="table no-bottom-margin">
                    <thead>
                    <tr>
                        <th>Dataset</th>
                        <th>ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="!datasets || datasets.length == 0">
                        <td class="no-results">No datasets selected.</td><td></td>
                    </tr>
                    <tr v-for="(dataset, index) in datasets" v-on:click="removeDataset(index)" class="clickable">
                        <td>{{ dataset.resname }}</td>
                        <td>{{ dataset.id }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse3" aria-expanded="true" aria-controls="collapse3">Area</div>

        <div class="sidepanel collapse" id="collapse3">
            <div class="panelcontent">
                <div class="form-group">
                    <input id="areaInput" class="form-control" type="text" placeholder="Enter area name" ref="areaInput">
                    <typeahead v-model="selectedArea" target="#areaInput" :async-function="completeArea" item-key="name" :force-select="true" :debounce="500">
                        <template slot="item" scope="props">
                            <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
                                <a role="button" @click="props.select(item)">
                                    {{ item.name }}
                                    <br/><span class="smaller">Area ID: {{ item.id }}</span>
                                </a>
                            </li>
                        </template>
                    </typeahead>
                </div>
                <table class="table no-bottom-margin">
                    <thead>
                    <tr>
                        <th>Area</th>
                        <th>ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="!areas || areas.length == 0">
                        <td class="no-results">No areas selected.</td><td></td>
                    </tr>
                    <tr v-for="(area, index) in areas" v-on:click="removeArea(index)" class="clickable">
                        <td>{{ area.name }}</td>
                        <td>{{ area.id }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse4" aria-expanded="true" aria-controls="collapse4">Geometry</div>

        <div class="sidepanel collapse" id="collapse4">
            <div class="panelcontent">
                <div class="form-group">
                    <div  v-if="sharedState.wkt != null">
                        <p class="count clickable" v-on:click="sharedState.wkt = null">{{ sharedState.wkt }}</p>
                    </div>
                    <p v-if="sharedState.wkt == null" class="no-results">No geometry selected.</p>
                </div>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse5" aria-expanded="true" aria-controls="collapse5">Time range</div>

        <div class="sidepanel collapse" id="collapse5">
            <div class="panelcontent">
                <div class="form-group">
                    <div class="sliderwrapper">
                        <input id="slider">
                    </div>
                </div>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse7" aria-expanded="true" aria-controls="collapse7">Depth range</div>

        <div class="sidepanel collapse" id="collapse7">
            <div class="panelcontent">
                <div class="form-group">
                    <div class="sliderwrapper">
                        <input id="depthslider">
                    </div>
                </div>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse6" aria-expanded="true" aria-controls="collapse6">Styling</div>

        <div class="sidepanel collapse in" id="collapse6">
            <div class="panelcontent">
                <div class="form-group">
                    <label>Color scale</label>
                    <span v-for="(scale, name) in scales">
                        <br/>
                        <label class="colorlabel">
                        <input type="radio" name="scale" v-model="selectedScale" v-bind:value="name">
                        <div class="colorsquares">
                            <span class="colorsquare" :style="{ 'background-color': color }" v-for="color in scale.colors"></span>
                        </div>
                        </label>
                    </span>
                    <br><input type="radio" name="scale" v-model="selectedScale" value="custom" id="customcolor"><label class="radiolabel clickable" for="customcolor">custom color</label>
                    <color-picker v-model="customColor" v-if="selectedScale == 'custom'"></color-picker>
                </div>

                <div class="form-group">
                    <label>Opacity</label>
                    <select class="form-control" v-model="opacity">
                        <option>1</option>
                        <option>0.9</option>
                        <option>0.8</option>
                        <option>0.7</option>
                        <option>0.6</option>
                        <option>0.5</option>
                        <option>0.4</option>
                        <option>0.3</option>
                        <option>0.2</option>
                        <option>0.1</option>
                    </select>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
import api from "../api"
import { store } from "../store"
import ColorPicker from "./ColorPicker.vue"
import { Typeahead } from "uiv"

export default {
	data() {
		return {
			suggestions: [],
			taxa: [],
            datasets: [],
            areas: [],
			scales: store.scales,
			selectedScale: "red",
			startYear: 1900,
			currentYear: (new Date()).getFullYear(),
            customColor: "#cc3300",
			opacity: 0.7,
			sharedState: store.state,
            selectedTaxon: null,
            selectedDataset: null,
            selectedArea: null
		}
	},
    watch: {
		selectedTaxon: function(taxon) {
			if (taxon) {
				this.select(taxon)
			}
		},
		selectedDataset: function(dataset) {
			if (dataset) {
				this.selectDataset(dataset)
			}
		},
		selectedArea: function(area) {
			if (area) {
				this.selectArea(area)
			}
		}
    },
    mounted() {
		$("#slider").ionRangeSlider({
			type: "double",
			grid: false,
			min: this.startYear,
			max: this.currentYear,
			from: this.startYear,
			to: this.currentYear,
			prettify_enabled: true,
			prettify: function (num) {
				return num
			}
		})
		$("#depthslider").ionRangeSlider({
			type: "double",
			grid: false,
			from: 0,
			to: 11000,
            values: [0, 1, 2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000],
			prettify_enabled: true,
			prettify: function (num) {
				return num
			}
		})
    },
    components: {
        "color-picker": ColorPicker,
        "typeahead": Typeahead
    },
    computed: {
	    disableAdd: function() {
			return this.taxa.length == 0 && this.datasets.length == 0 && this.areas.length == 0 && !this.sharedState.wkt
        }
    },
	methods: {
		complete: function(input, done) {
			api.complete(input).then(res => {
				done(res)
			})
		},
		completeDataset: function(input, done) {
			api.completeDataset(input).then(res => {
				done(res)
			})
		},
		completeArea: function(input, done) {
			api.completeArea(input).then(res => {
				done(res)
			})
		},
		select: function(taxon) {
			this.taxa.push({
				"scientificName": taxon.scientificName,
				"acceptedNameUsageID": taxon.acceptedNameUsageID,
				"scientificNameAuthorship": taxon.scientificNameAuthorship
			})
            this.$nextTick(function() {
				this.$refs.nameInput.value = ""
            })
		},
		selectDataset: function(dataset) {
			this.datasets.push({
				"id": dataset.id,
				"resname": dataset.resname
			})
			this.$nextTick(function() {
				this.$refs.datasetInput.value = ""
			})
		},
		selectArea: function(area) {
			this.areas.push({
				"id": area.id,
				"name": area.name
			})
			this.$nextTick(function() {
				this.$refs.areaInput.value = ""
			})
		},
		removeTaxon: function(index) {
			this.taxa.splice(index, 1)
		},
		removeDataset: function(index) {
			this.datasets.splice(index, 1)
		},
		removeArea: function(index) {
			this.areas.splice(index, 1)
		},
		addLayer: function() {
			let years = $("#slider").val().split(";")
			let start = years[0]
			let end = years[1]
			let depths = $("#depthslider").val().split(";")
			let startdepth = parseInt(depths[0])
			let enddepth = parseInt(depths[1])
			if (start == this.startYear) {
				start = null
			}
			if (end == this.currentYear) {
				end = null
			}
			if (startdepth == 0) {
				startdepth = null
			}
			if (enddepth == 11000) {
				enddepth = null
			}
			store.addLayer({
				taxa: JSON.parse(JSON.stringify(this.taxa)),
				datasets: JSON.parse(JSON.stringify(this.datasets)),
				areas: JSON.parse(JSON.stringify(this.areas)),
				startyear: start,
				endyear: end,
                startdepth: startdepth,
                enddepth: enddepth,
				precision: 3,
				geometry: this.sharedState.wkt,
				opacity: this.opacity,
				scale: this.selectedScale,
                customColor: this.customColor
			})
		}
	}
}
</script>