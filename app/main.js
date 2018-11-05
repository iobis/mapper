import Vue from "vue"
import App from "./components/App.vue"
import Toasted from "vue-toasted"
import numeral from "numeral"

Vue.use(Toasted)

new Vue({
	el: "#app",
	components: {
		"app": App
	},
	mounted() {
	}
})

$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip({
		"delay": { show: 600, hide: 0 }
	});
});

Vue.filter("number", function(value) {
    return numeral(value).format("0,0")
})