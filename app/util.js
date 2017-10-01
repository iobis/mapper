const createQuery = function(criteria) {
	let map = []
	if (criteria.name) {
		map.push(["scientificname", criteria.name])
	}
	let q = map.map(c => {
		return c[0] + "=" + c[1]
	}).join("&")
	return q
}

module.exports = {
	createQuery: createQuery
}