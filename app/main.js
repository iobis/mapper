import Vue from "vue"
import App from "./components/App.vue"
import store from "./store"

new Vue({
	el: "#app",
	components: {
		"app": App
	},
	mounted() {
	}
})

/*
let hashCode = function(str) {
	var hash = 0
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	return hash
}

let intToRGB = function(i){
	var c = (i & 0x00FFFFFF).toString(16).toUpperCase()
	return "00000".substring(0, 6 - c.length) + c
}

let generateColor = function(str) {
	if (str) {
		return "#" + intToRGB(hashCode(str))
	} else {
		return "#cc3300"
	}
}

$("#csv").text(data)

let color = $("#color")
color.on("change", function() {
	window.plot()
})

window.plot = function() {
	group.clearLayers()
	let delimiter = $("#delimiter").val()
	let selectedField = color.val()
	if (delimiter == "tab") {
		delimiter = "	"
	}
	let input = $("#csv").val()
	let fields = null

	window.csvtojson({ delimiter: delimiter }).fromString(input)
		.on("json", (row) => {
			if (!fields) {
				fields = Object.keys(row)
			}
			let marker = new L.CircleMarker([row.decimalLatitude, row.decimalLongitude], {
				radius: 4,
				fillOpacity: 1,
				opacity: 1,
				color: "white",
				fillColor: generateColor(row[selectedField]),
				weight: 2,
				clickable: true
			})
			if (selectedField) {
				marker.bindPopup(row[selectedField])
			}
			marker.addTo(group)
		})
		.on("done", () => {
			color.find("option").remove().end().append('<option>Select field</option>').val(null)
			fields.forEach(field => {
				color.append('<option value="' + field + '">' + field + '</option>');
			})
			if (fields.indexOf(selectedField) > -1) {
				color.val(selectedField)
			}
			map.fitBounds(group.getBounds())
		})
}
*/