const createQuery = function(criteria) {
	let map = []
	if (criteria.size) {
		map.push(["size", criteria.size])
	}
	if (criteria.after && criteria.after > -1) {
		map.push(["after", criteria.after])
	}
	if (criteria.name) {
		map.push(["scientificname", criteria.name])
	}
	if (criteria.startyear) {
		map.push(["startdate", criteria.startyear + "-01-01"])
	}
	if (criteria.endyear) {
		map.push(["enddate", criteria.endyear + "-12-31"])
	}
	if (criteria.geometry) {
		map.push(["geometry", criteria.geometry])
	}
	let q = map.map(c => {
		return c[0] + "=" + c[1]
	}).join("&")
	return q
}

module.exports = {
	createQuery: createQuery
}