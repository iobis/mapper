const axios = require("axios")
const util = require("./util.js")
const config = require("./config.js")

export default {
    fetch(criteria) {
        let q = util.createQuery(criteria)
        let url = config.api + "occurrence?" + q
        return axios.get(url)
            .then((response) => Promise.resolve(response.data))
            .catch((error) => Promise.reject(error))
    },
	fetchChecklist(criteria) {
		let q = util.createQuery(criteria)
		let url = config.api + "checklist?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	fetchStatistics(criteria) {
		let q = util.createQuery(criteria)
		let url = config.api + "statistics?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	fetchDatasets(criteria) {
		let q = util.createQuery(criteria)
		let url = config.api + "dataset?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	count(criteria) {
		let q = util.createQuery(criteria)
		let url = config.api + "occurrence?" + q + "&size=0"
		return axios.get(url)
			.then((response) => Promise.resolve(response.data.total))
			.catch((error) => Promise.reject(error))
	},
	complete(input) {
		let url = config.api + "taxon/complete/verbose/" + input
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	completeDataset(input) {
		let url = config.api + "dataset/complete/" + input
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	completeArea(input) {
		let url = config.api + "area/complete/" + input
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	geo(criteria, precision) {
		let q = util.createQuery(criteria)
		let url = config.api + "occurrence/grid/" + precision + "?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	geoPoints(criteria) {
		let q = util.createQuery(criteria)
		let url = config.api + "occurrence/points?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	geoPoint(criteria, x, y, z) {
		let q = util.createQuery(criteria)
		let url = config.api + "occurrence/point/" + x + "/" + y
		if (z) {
			url = url + "/" + z
		}
		url = url + "?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	download(criteria) {
		let q = util.createQuery(criteria)
		let url = config.api + "download/occurrence?" + q
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	downloadStatus(hash) {
		let url = config.api + "download/" + hash + "/status"
		return axios.get(url)
			.then((response) => Promise.resolve(response.data))
			.catch((error) => Promise.reject(error))
	},
	taxon(id) {
		let url = config.api + "taxon/" + id
		return axios.get(url)
			.then((response) => Promise.resolve(response.data.results[0]))
			.catch((error) => Promise.reject(error))
	},
	area(id) {
		let url = config.api + "area/" + id
		return axios.get(url)
			.then((response) => Promise.resolve(response.data.results[0]))
			.catch((error) => Promise.reject(error))
	},
    dataset(id) {
        let url = config.api + "dataset/" + id
        return axios.get(url)
            .then((response) => Promise.resolve(response.data.results[0]))
            .catch((error) => Promise.reject(error))
    },
    email(email, message) {
        let url = config.api + "email"
        return axios.post(url, {
        	"email": email,
			"message": message
		})
			.then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }
}