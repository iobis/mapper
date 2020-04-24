<template>
	<div>
        <div class="sideheader">Create layer <span class="smaller left-10" v-if="store.editLayer">{{ store.editLayer.count | number}} records</span>
            <button class="btn btn-success btn-sm clickable pull-right-vertical right-10" :disabled="disableAdd" v-on:click="saveLayer">Save</button>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse1" aria-expanded="true" aria-controls="collapse1">Scientific name</div>

        <div class="sidepanel collapse in" id="collapse1">
            <div class="panelcontent">
                <div class="form-group">
                    <input id="nameInput" class="form-control" type="text" placeholder="Enter scientific name" ref="nameInput" autocomplete="off">
                    <typeahead v-model="selectedTaxon" target="#nameInput" :async-function="complete" item-key="scientificName" :force-select="true" :debounce="500">
                        <template slot="item" slot-scope="props">
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
                    <tr v-if="!criteria.taxa || criteria.taxa.length == 0">
                        <td class="no-results">No taxa selected.</td><td></td>
                    </tr>
                    <tr v-for="(taxon, index) in criteria.taxa" v-on:click="removeTaxon(index)" class="clickable">
                        <td>{{ taxon.scientificName }} {{ taxon.scientificNameAuthorship }}</td>
                        <td>{{ taxon.acceptedNameUsageID }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse2" aria-expanded="true" aria-controls="collapse2">Datasets</div>

        <div class="sidepanel collapse defaultclosed" id="collapse2">
            <div class="panelcontent">
                <div class="form-group">
                    <input id="datasetInput" class="form-control" type="text" placeholder="Enter dataset name" ref="datasetInput">
                    <typeahead v-model="selectedDataset" target="#datasetInput" :async-function="completeDataset" item-key="title" :force-select="true" :debounce="500">
                        <template slot="item" slot-scope="props">
                            <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
                                <a role="button" @click="props.select(item)">
                                    {{ item.title }}
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
                    <tr v-if="!criteria.datasets || criteria.datasets.length == 0">
                        <td class="no-results">No datasets selected.</td><td></td>
                    </tr>
                    <tr v-for="(dataset, index) in criteria.datasets" v-on:click="removeDataset(index)" class="clickable">
                        <td>{{ dataset.title }}</td>
                        <td>{{ dataset.id }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse8" aria-expanded="true" aria-controls="collapse8">Nodes</div>

        <div class="sidepanel collapse defaultclosed" id="collapse8">
            <div class="panelcontent">
                <div class="form-group">
                    <input id="nodeInput" class="form-control" type="text" placeholder="Enter node name" ref="nodeInput">
                    <typeahead v-model="selectedNode" target="#nodeInput" :async-function="completeNode" item-key="name" :force-select="true" :debounce="500">
                        <template slot="item" slot-scope="props">
                            <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
                                <a role="button" @click="props.select(item)">
                                    {{ item.name }}
                                    <br/><span class="smaller">Node ID: {{ item.id }}</span>
                                </a>
                            </li>
                        </template>
                    </typeahead>
                </div>
                <table class="table no-bottom-margin">
                    <thead>
                    <tr>
                        <th>Node</th>
                        <th>ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="!criteria.nodes || criteria.nodes.length == 0">
                        <td class="no-results">No nodes selected.</td><td></td>
                    </tr>
                    <tr v-for="(node, index) in criteria.nodes" v-on:click="removeNode(index)" class="clickable">
                        <td>{{ node.name }}</td>
                        <td>{{ node.id }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse9" aria-expanded="true" aria-controls="collapse9">Institutes</div>

        <div class="sidepanel collapse defaultclosed" id="collapse9">
            <div class="panelcontent">
                <div class="form-group">
                    <input id="instituteInput" class="form-control" type="text" placeholder="Enter institute name" ref="instituteInput">
                    <typeahead v-model="selectedInstitute" target="#instituteInput" :async-function="completeInstitute" item-key="name" :force-select="true" :debounce="500">
                        <template slot="item" slot-scope="props">
                            <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
                                <a role="button" @click="props.select(item)">
                                    {{ item.name }}
                                    <br/><span class="smaller">Institute ID: {{ item.id }}</span>
                                </a>
                            </li>
                        </template>
                    </typeahead>
                </div>
                <table class="table no-bottom-margin">
                    <thead>
                    <tr>
                        <th>Institute</th>
                        <th>ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="!criteria.institutes || criteria.institutes.length == 0">
                        <td class="no-results">No institutes selected.</td><td></td>
                    </tr>
                    <tr v-for="(institute, index) in criteria.institutes" v-on:click="removeInstitute(index)" class="clickable">
                        <td>{{ institute.name }}</td>
                        <td>{{ institute.id }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse3" aria-expanded="true" aria-controls="collapse3">Areas</div>

        <div class="sidepanel collapse defaultclosed" id="collapse3">
            <div class="panelcontent">
                <div class="form-group">
                    <input id="areaInput" class="form-control" type="text" placeholder="Enter area name" ref="areaInput">
                    <typeahead v-model="selectedArea" target="#areaInput" :async-function="completeArea" item-key="name" :force-select="true" :debounce="500">
                        <template slot="item" slot-scope="props">
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
                    <tr v-if="!criteria.areas || criteria.areas.length == 0">
                        <td class="no-results">No areas selected.</td><td></td>
                    </tr>
                    <tr v-for="(area, index) in criteria.areas" v-on:click="removeArea(index)" class="clickable">
                        <td>{{ area.name }}</td>
                        <td>{{ area.id }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse15" aria-expanded="true" aria-controls="collapse15">Publisher countries</div>

        <div class="sidepanel collapse defaultclosed" id="collapse15">
            <div class="panelcontent">
                <div class="form-group">
                    <input id="countryInput" class="form-control" type="text" placeholder="Enter country name" ref="countryInput">
                    <typeahead v-model="selectedCountry" target="#countryInput" :async-function="completeCountry" item-key="country" :force-select="true" :debounce="500">
                        <template slot="item" slot-scope="props">
                            <li v-for="(item, index) in props.items" :class="{active:props.activeIndex===index}">
                                <a role="button" @click="props.select(item)">
                                    {{ item.country }}
                                    <br/><span class="smaller">Country ID: {{ item.id }}</span>
                                </a>
                            </li>
                        </template>
                    </typeahead>
                </div>
                <table class="table no-bottom-margin">
                    <thead>
                    <tr>
                        <th>Country</th>
                        <th>ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="!criteria.countries || criteria.countries.length == 0">
                        <td class="no-results">No countries selected.</td><td></td>
                    </tr>
                    <tr v-for="(country, index) in criteria.countries" v-on:click="removeCountry(index)" class="clickable">
                        <td>{{ country.country }}</td>
                        <td>{{ country.id }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse4" aria-expanded="true" aria-controls="collapse4">Geometry</div>

        <div class="sidepanel collapse defaultclosed" id="collapse4">
            <div class="panelcontent">
                <div class="form-group">
                    <div v-if="criteria.wkt != null">
                        <p class="count clickable" v-on:click="criteria.wkt = null">{{ criteria.wkt }}</p>
                    </div>
                    <p v-if="criteria.wkt == null" class="no-results">No geometry selected.</p>
                </div>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse5" aria-expanded="true" aria-controls="collapse5">Time range</div>

        <div class="sidepanel collapse defaultclosed" id="collapse5">
            <div class="panelcontent">
                <div class="form-group">
                    <div class="sliderwrapper">
                        <input id="slider">
                    </div>
                </div>
            </div>
        </div>

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse7" aria-expanded="true" aria-controls="collapse7">Depth range</div>

        <div class="sidepanel collapse defaultclosed" id="collapse7">
            <div class="panelcontent">
                <div class="form-group">
                    <div class="sliderwrapper">
                        <input id="depthslider">
                    </div>
                </div>
            </div>
        </div>

        <!--
        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse16" aria-expanded="true" aria-controls="collapse16">Data quality</div>

        <div class="sidepanel collapse defaultclosed" id="collapse16">
            <div class="panelcontent">
                <div class="form-group">
                    <label>Bathymetry issue</label>
                    <select class="form-control" v-model="criteria.flags.bath_issue">
                        <option>include</option>
                        <option>exclude</option>
                    </select>
                </div>
            </div>
        </div>
        -->

        <div class="sidesubheader clickable" data-toggle="collapse" href="#collapse10" aria-expanded="true" aria-controls="collapse10">Options</div>

        <div class="sidepanel collapse defaultclosed" id="collapse10">
            <div class="panelcontent">
                <label>
                    <input type="checkbox" v-model="criteria.dropped"> only dropped records
                </label>
                <br/><label>
                <input type="checkbox" v-model="criteria.redlist"> only Red List species
                </label>
                <br/><label>
                    <input type="checkbox" v-model="criteria.hab"> only HAB species
                </label>
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
                        <input type="radio" name="scale" v-model="criteria.selectedScale" v-bind:value="name">
                        <div class="colorsquares">
                            <span class="colorsquare" :style="{ 'background-color': color }" v-for="color in scale.colors"></span>
                        </div>
                        </label>
                    </span>
                    <br><input type="radio" name="scale" v-model="criteria.selectedScale" value="custom" id="customcolor"><label class="radiolabel clickable" for="customcolor">custom color</label>
                    <color-picker v-model="criteria.customColor" v-if="criteria.selectedScale == 'custom'" id="cp"></color-picker>
                </div>

                <div class="form-group">
                    <label>Opacity</label>
                    <select class="form-control" v-model="criteria.opacity">
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
            scales: store.scales,
            criteria: store.criteria,
            settings: store.settings,
            suggestions: [],
            selectedTaxon: null,
            selectedDataset: null,
            selectedNode: null,
            selectedInstitute: null,
            selectedArea: null,
            selectedCountry: null,
            timeSlider: null,
            depthSlider: null,
            store: store, // todo: only share store
			depths: [0, 1, 2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000]
        }
    },
    watch: {
        "criteria.timeValues": function(timeValues) {
            let start = timeValues[0]
            let end = timeValues[1]
            // check start value
            if (start == null && this.timeSlider.result.from != this.settings.startYear) {
                this.timeSlider.update({
                    from: this.settings.startYear
                })
            } else if (start != null && start != this.timeSlider.result.from) {
                this.timeSlider.update({
                    from: start
                })
            }
            // check end value
            if (end == null && this.timeSlider.result.to != this.settings.currentYear) {
                this.timeSlider.update({
                    to: this.settings.currentYear
                })
            } else if (end != null && end != this.timeSlider.result.to) {
                this.timeSlider.update({
                    to: end
                })
            }
        },
        "criteria.depthValues": function(depthValues) {
            let start = depthValues[0]
            let end = depthValues[1]
            // check start value
            if (start == null && (this.depthSlider.result.from_value != null && this.depthSlider.result.from_value != 0)) {
                this.depthSlider.update({
                    from: 0
                })
            } else if (start != null && (this.depthSlider.result.from_value == null || start != this.depthSlider.result.from_value)) {
                this.depthSlider.update({
					from: this.depths.indexOf(parseInt(start))
                })
            }
            // check end value
            if (end == null && (this.depthSlider.result.to != null && this.timeSlider.result.to_value != 11000)) {
                this.depthSlider.update({
                    to: this.depths[this.depths.length - 1]
                })
            } else if (end != null && (this.timeSlider.result.to_value == null || end != this.timeSlider.result.to_value)) {
                this.depthSlider.update({
                    to: this.depths.indexOf(parseInt(end))
                })
            }
        },
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
        selectedNode: function(node) {
            if (node) {
                this.selectNode(node)
            }
        },
        selectedInstitute: function(institute) {
            if (institute) {
                this.selectInstitute(institute)
            }
        },
        selectedArea: function(area) {
            if (area) {
                this.selectArea(area)
            }
        },
        selectedCountry: function(country) {
            if (country) {
                this.selectCountry(country)
            }
        },
        filters: function() {
			if (this.disableAdd) {
				this.clearLayer()
            } else {
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
			return !this.criteria.hab && this.criteria.taxa.length == 0 && this.criteria.datasets.length == 0 && this.criteria.nodes.length == 0 && this.criteria.institutes.length == 0 && this.criteria.areas.length == 0 && this.criteria.countries.length == 0 && !this.criteria.wkt && this.criteria.timeValues.every(function(x) { return x == null }) && this.criteria.depthValues.every(function(x) { return x == null })
        },
        filters: function() {
            return [ this.criteria.taxa, this.criteria.datasets, this.criteria.nodes, this.criteria.institutes, this.criteria.areas, this.criteria.countries, this.criteria.timeValues, this.criteria.depthValues, this.criteria.selectedScale, this.criteria.customColor, this.criteria.opacity, this.criteria.wkt, this.criteria.dropped, this.criteria.redlist, this.criteria.hab, this.criteria.flags.bath_issue ]
        }
    },
	methods: {
        reset: function() {
            store.resetCriteria()
            this.resetSliders()
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
                min: this.settings.startYear,
                max: this.settings.currentYear,
                from: this.settings.startYear,
                to: this.settings.currentYear,
                prettify_enabled: true,
                prettify: function(num) {
                    return num
                },
                onFinish: function(e) {
                    let start = e.from_pretty
                    let end = e.to_pretty
                    if (start == self.settings.startYear) {
                        start = null
                    }
                    if (end == self.settings.currentYear) {
                        end = null
                    }
                    self.criteria.timeValues = [start, end]
                }
            })
            this.timeSlider = $("#slider").data("ionRangeSlider")
            $("#depthslider").ionRangeSlider({
                type: "double",
                grid: false,
                from: 0,
                to: 11000,
                values: this.depths,
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
                    self.criteria.depthValues = [start, end]
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
        completeNode: function(input, done) {
            api.completeNode(input).then(res => {
                done(res)
            })
        },
        completeInstitute: function(input, done) {
            api.completeInstitute(input).then(res => {
                done(res)
            })
        },
        completeArea: function(input, done) {
            api.completeArea(input).then(res => {
                done(res)
            })
        },
        completeCountry: function(input, done) {
            api.completeCountry(input).then(res => {
                done(res)
            })
        },
		select: function(taxon) {
			this.criteria.taxa.push({
				"scientificName": taxon.scientificName,
				"acceptedNameUsageID": taxon.acceptedNameUsageID,
				"scientificNameAuthorship": taxon.scientificNameAuthorship
			})
            this.$nextTick(function() {
				this.$refs.nameInput.value = ""
            })
		},
        selectDataset: function(dataset) {
            this.criteria.datasets.push({
                "id": dataset.id,
                "title": dataset.title
            })
            this.$nextTick(function() {
                this.$refs.datasetInput.value = ""
            })
        },
        selectNode: function(node) {
            this.criteria.nodes.push({
                "id": node.id,
                "name": node.name
            })
            this.$nextTick(function() {
                this.$refs.nodeInput.value = ""
            })
        },
        selectInstitute: function(item) {
            this.criteria.institutes.push({
                "id": item.id,
                "name": item.name
            })
            this.$nextTick(function() {
                this.$refs.instituteInput.value = ""
            })
        },
        selectArea: function(area) {
            this.criteria.areas.push({
                "id": area.id,
                "name": area.name
            })
            this.$nextTick(function() {
                this.$refs.areaInput.value = ""
            })
        },
        selectCountry: function(item) {
            this.criteria.countries.push({
                "id": item.id,
                "country": item.country
            })
            this.$nextTick(function() {
                this.$refs.countryInput.value = ""
            })
        },
		removeTaxon: function(index) {
			this.criteria.taxa.splice(index, 1)
		},
        removeDataset: function(index) {
            this.criteria.datasets.splice(index, 1)
        },
        removeNode: function(index) {
            this.criteria.nodes.splice(index, 1)
        },
        removeInstitute: function(index) {
            this.criteria.institutes.splice(index, 1)
        },
        removeArea: function(index) {
            this.criteria.areas.splice(index, 1)
        },
        removeCountry: function(index) {
            this.criteria.countries.splice(index, 1)
        },
        saveLayer: function() {
            store.saveLayer()
            this.reset()
            $(".defaultclosed").collapse("hide")
        },
        clearLayer: function() {
            store.clearLayer()
        },
		addLayer: function() {
			store.addLayerTemp()
		}
	}
}
</script>