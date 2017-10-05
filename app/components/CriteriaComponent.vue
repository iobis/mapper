<template>
	<div>
		<a class="sideheader" data-toggle="collapse" href="#collapse2" aria-expanded="true" aria-controls="collapse2">Create layer</a>
		<div class="collapse show sidepanel" id="collapse2">
			<div class="content">

				<div class="form-group">
					<label>Scientific name</label>
					<input type="text" class="form-control" v-on:input="debounceInput" v-model="name">
				</div>
				<ul v-if="suggestions.length > 0" class="suggestions">
					<li class="clickable" v-for="suggestion in suggestions" v-on:click="select(suggestion.scientificName)">
						{{ suggestion.scientificName }} <span class="count">{{ suggestion.scientificNameAuthorship }}</span>
                        <br/><span class="count">{{suggestion.taxonRank}}</span><span class="count">, WoRMS ID: {{suggestion.acceptedNameUsageID}}</span>
					</li>
				</ul>

                <div class="form-group">
                    <label>Time range</label>
                    <div class="sliderwrapper">
                        <input id="slider">
                    </div>
                </div>

				<div class="form-group">
					<label>Color scale</label>
					<span v-for="(scale, name) in scales">
						<br/>
						<input type="radio" name="scale" v-model="selectedScale" v-bind:value="name">
						<div class="colorsquares">
							<span class="colorsquare" :style="{ 'background-color': color }" v-for="color in scale.colors"></span>
						</div>
					</span>
					<br><input type="radio" name="scale" v-model="selectedScale" value="custom"><label class="radiolabel">custom color</label>
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

				<button class="btn btn-success clickable" :disabled="name == ''" v-on:click="addLayer">Add layer</button>
			</div>
		</div>
	</div>
</template>

<script>
import api from "../api"
import { store } from "../store"
import ColorPicker from "./ColorPicker.vue"

export default {
	data() {
		return {
			suggestions: [],
			name: "",
			scales: store.scales,
			selectedScale: "red",
			startYear: 1900,
			currentYear: (new Date()).getFullYear(),
            customColor: "#cc3300",
			opacity: 0.7
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
        ColorPicker
    },
	methods: {
		debounceInput: _.debounce(function(e) {
			let self = this
			api.complete(e.target.value).then(function(response) {
				self.suggestions = response
			})
		}, 500),
		select: function(name) {
			this.name = name
			this.suggestions = []
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
				name: this.name,
				startyear: start,
				endyear: end,
				precision: 3,
				opacity: this.opacity,
				scale: this.selectedScale,
                customColor: this.customColor
			})
		}
	}
}
</script>