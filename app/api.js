const axios = require("axios")
const util = require("./util.js")

export default {
	fetch(criteria) {
		let q = util.createQuery(criteria)
		let url = "http://api2.iobis.org/occurrence?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	count(criteria) {
		let q = util.createQuery(criteria)
		let url = "http://api2.iobis.org/occurrence?" + q + "&size=0"
		return axios.get(url)
			.then((response) => Promise.resolve(response.data.total))
			.catch((error) => Promise.reject(error))
	},
	complete(input) {
		let url = "http://api2.iobis.org/taxon/complete/" + input
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	geo(criteria, precision) {
		let q = util.createQuery(criteria)
		let url = "http://api2.iobis.org/occurrence/grid/" + precision + "?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	}
}