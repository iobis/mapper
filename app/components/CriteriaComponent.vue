<template>
	<div>
		<div class="sideheader">Create layer
            <button class="btn btn-success btn-sm clickable pull-right-vertical right-10" :disabled="taxa.length <= 0" v-on:click="addLayer">Add</button>
        </div>

        <div class="sidesubheader">Scientific name</div>

        <div class="sidepanel">
            <div class="form-group">
                <input id="nameInput" class="form-control" type="text" placeholder="Enter scientific name">
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

        <div class="sidesubheader">Geometry</div>

        <div class="sidepanel">
            <div class="form-group">
                <div  v-if="sharedState.wkt != null">
                    <p class="count clickable" v-on:click="sharedState.wkt = null">{{ sharedState.wkt }}</p>
                </div>
                <p v-if="sharedState.wkt == null" class="no-results">No geometry selected.</p>
            </div>
        </div>

        <div class="sidesubheader">Time range</div>

        <div class="sidepanel">
            <div class="form-group">
                <div class="sliderwrapper">
                    <input id="slider">
                </div>
            </div>
        </div>

        <div class="sidesubheader">Styling</div>

        <div class="sidepanel">
            <div class="form-group">
                <label>Color scale</label>
                <span v-for="(scale, name) in scales">
                    <br/>
                    <input type="radio" name="scale" v-model="selectedScale" v-bind:value="name">
                    <div class="colorsquares">
                        <span class="colorsquare" :style="{ 'background-color': color }" v-for="color in scale.colors"></span>
                    </div>
                </span>
                <br><input type="radio" name="scale" v-model="selectedScale" value="custom" id="customcolor"><label class="radiolabel" for="customcolor">custom color</label>
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
			scales: store.scales,
			selectedScale: "red",
			startYear: 1900,
			currentYear: (new Date()).getFullYear(),
            customColor: "#cc3300",
			opacity: 0.7,
			sharedState: store.state,
            selectedTaxon: null
		}
	},
    watch: {
	    selectedTaxon: function(taxon) {
            if (taxon) {
                this.select(taxon)
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
    },
    components: {
        "color-picker": ColorPicker,
        "typeahead": Typeahead
    },
	methods: {
        complete: function(input, done) {
            api.complete(input).then(res => {
                done(res)
            })
        },
		select: function(taxon) {
			this.taxa.push({
				"scientificName": taxon.scientificName,
				"acceptedNameUsageID": taxon.acceptedNameUsageID,
				"scientificNameAuthorship": taxon.scientificNameAuthorship
			})
		},
		removeTaxon: function(index) {
			this.taxa.splice(index, 1)
		},
		addLayer: function() {
            let years = $("#slider").val().split(";")
			let start = years[0]
			let end = years[1]
			if (start == this.startYear) {
            	start = null
			}
			if (end == this.currentYear) {
            	end = null
			}
			store.addLayer({
				taxa: JSON.parse(JSON.stringify(this.taxa)),
				startyear: start,
				endyear: end,
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