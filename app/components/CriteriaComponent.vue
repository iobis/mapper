<template>
	<div>
		<div class="sideheader">Create layer
            <button class="btn btn-success btn-sm clickable pull-right-vertical right-10" :disabled="disableAdd" v-on:click="saveLayer">Save</button>
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
                    <color-picker v-model="customColor" v-if="selectedScale == 'custom'" id="cp"></color-picker>
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
import Vue from "vue"

let getDefaults = function() {
    return {
        taxa: [],
        datasets: [],
        areas: [],
        timeValues: [ null, null ],
        depthValues: [ null, null ],
        selectedScale: "red",
        startYear: 1900,
        currentYear: (new Date()).getFullYear(),
        customColor: "#cc3300",
        opacity: 0.7
    }
}

export default {
	data() {
	    let d = {
            scales: store.scales,
            sharedState: store.state,
            suggestions: [],
            selectedTaxon: null,
            selectedDataset: null,
            selectedArea: null,
            timeSlider: null,
            depthSlider: null
        }
        Object.assign(d, getDefaults())
        return d
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
		},
        filters: function(filters) {
		    console.log(JSON.stringify(filters, null, 2))
            if (!this.disableAdd) {
                this.addLayer()
            }
        }
    },
    mounted() {
	    this.initSliders()
    },
    components: {
        "color-picker": ColorPicker,
        "typeahead": Typeahead
    },
    computed: {
	    disableAdd: function() {
			return this.taxa.length == 0 && this.datasets.length == 0 && this.areas.length == 0 && !this.sharedState.wkt && this.timeValues.every(function(x) { return x == null }) && this.depthValues.every(function(x) { return x == null })
        },
        filters: function() {
            return [ this.taxa, this.datasets, this.areas, this.timeValues, this.depthValues, this.selectedScale, this.customColor, this.opacity, this.sharedState.wkt ]
        }
    },
	methods: {
        reset: function() {
            Object.assign(this.$data, getDefaults())
            this.resetSliders()
            this.sharedState.wkt = null
        },
        resetSliders: function() {
            this.timeSlider.reset()
            this.depthSlider.reset()
        },
        initSliders: function() {
            let self = this
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
                },
                onFinish: function(e) {
                    let start = e.from_pretty
                    let end = e.to_pretty
                    if (start == self.startYear) {
                        start = null
                    }
                    if (end == self.currentYear) {
                        end = null
                    }
                    self.timeValues = [start, end]
                }
            })
            this.timeSlider = $("#slider").data("ionRangeSlider")
            $("#depthslider").ionRangeSlider({
                type: "double",
                grid: false,
                from: 0,
                to: 11000,
                values: [0, 1, 2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000],
                prettify_enabled: true,
                prettify: function (num) {
                    return num
                },
                onFinish: function(e) {
                    let start = e.from_value
                    let end = e.to_value
                    if (start == 0) {
                        start = null
                    }
                    if (end == 11000) {
                        end = null
                    }
                    self.depthValues = [start, end]
                }
            })
            this.depthSlider = $("#depthslider").data("ionRangeSlider")
        },
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
        saveLayer: function() {
		    store.saveLayer()
            this.reset()
        },
		addLayer: function() {
			store.addLayer({
                taxa: JSON.parse(JSON.stringify(this.taxa)),
                datasets: JSON.parse(JSON.stringify(this.datasets)),
                areas: JSON.parse(JSON.stringify(this.areas)),
                startyear: this.timeValues[0],
                endyear: this.timeValues[1],
                startdepth: this.depthValues[0],
                enddepth: this.depthValues[1],
                precision: 3,
                geometry: this.sharedState.wkt,
                opacity: this.opacity,
                scale: this.selectedScale,
                customColor: this.customColor,
                count: null
            })
		}
	}
}
</script>