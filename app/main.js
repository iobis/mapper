import Vue from "vue"
import App from "./components/App.vue"
import Toasted from "vue-toasted"

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
