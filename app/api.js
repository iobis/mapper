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
		let url = "http://api2.iobis.org/taxon/complete/verbose/" + input
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	completeDataset(input) {
		let url = "http://api2.iobis.org/dataset/complete/" + input
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	completeArea(input) {
		let url = "http://api2.iobis.org/area/complete/" + input
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
	},
	geoPoints(criteria) {
		let q = util.createQuery(criteria)
		let url = "http://api2.iobis.org/occurrence/points?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	download(criteria) {
		let q = util.createQuery(criteria)
		let url = "http://api2.iobis.org/download/occurrence?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	downloadStatus(hash) {
		let url = "http://api2.iobis.org/download/" + hash + "/status"
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	taxon(id) {
		let url = "http://api2.iobis.org/taxon/" + id
		return axios.get(url)
			.then((response) => Promise.resolve(response.data.results[0]))
			.catch((error) => Promise.reject(error))
	},
	area(id) {
		let url = "http://api2.iobis.org/area/" + id
		return axios.get(url)
			.then((response) => Promise.resolve(response.data.results[0]))
			.catch((error) => Promise.reject(error))
	},
	dataset(id) {
		let url = "http://api2.iobis.org/dataset/" + id
		return axios.get(url)
			.then((response) => Promise.resolve(response.data.results[0]))
			.catch((error) => Promise.reject(error))
	}
}