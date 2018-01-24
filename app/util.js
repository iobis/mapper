const createQuery = function(criteria) {
	let map = []
	if (criteria.size) {
		map.push(["size", criteria.size])
	}
	if (criteria.after && criteria.after > -1) {
		map.push(["after", criteria.after])
	}
	if (criteria.taxa) {
		map.push(["taxonid", criteria.taxa.map(function(x) { return(x.acceptedNameUsageID) }).join(",")])
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

const makeScales = function() {
	return {
		red: {
			colors: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"]
		},
		blue: {
			colors: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"]
		},
		green: {
			colors: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"]
		},
		bluemono: {
			colors: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"]
		},
		pinkmono: {
			colors: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"]
		},
		blueeven: {
			colors: ["#4292c6","#4292c6","#4292c6","#4292c6","#4292c6","#4292c6","#4292c6","#4292c6"]
		},
		redeven: {
			colors: ["#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a", "#fc4e2a"]
		},
		greeneven: {
			colors: ["#41ab5d","#41ab5d","#41ab5d","#41ab5d","#41ab5d","#41ab5d","#41ab5d","#41ab5d"]
		}
	}
}

const getColor = function(d, colors) {
    if (colors.length == 1) {
        return colors[0]
    } else {
        if (d > 1000) {
            return colors[7]
        } else if (d > 500) {
            return colors[6]
        } else if (d > 200) {
            return colors[5]
        } else if (d > 100) {
            return colors[4]
        } else if (d > 50) {
            return colors[3]
        } else if (d > 20) {
            return colors[2]
        } else if (d > 10) {
            return colors[1]
        } else {
            return colors[0]
        }
    }
}

const extractQuery = function(url) {
    let parts = url.split("?")
    if (parts.length == 2 && parts[1].length > 0) {
        return parts[1].split("&")
            .reduce((params, param) => {
                let [ key, value ] = param.split("=");
                params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : ""
                if (key == "taxonid") {
                    params[key] = params[key].split(",")
                }
                return params
            }, {})
    } else {
        return null
    }
}

/*
const createUrlQuery = function(criteria) {
    console.log("Criteria: " + JSON.stringify(criteria))
    let map = []
    if (criteria.names.length > 0) map.push(["scientificname", criteria.names.join(",")])
    if (criteria.datasets.length > 0) map.push(["datasetid", criteria.datasets.map(d => d.id).join(",")])
    if (criteria.startdate.length > 0) map.push(["startdate", criteria.startdate])
    if (criteria.enddate.length > 0) map.push(["enddate", criteria.enddate])
    if (criteria.geometry.length > 0) map.push(["geometry", criteria.geometry])
    if (criteria.area && criteria.area.id) {
        map.push(["areaid", criteria.area.id])
    }
    if (criteria.depth) {
        if (criteria.depth[0] != 11000) {
            map.push(["enddepth", criteria.depth[0]])
        }
        if (criteria.depth[1] != 0) {
            map.push(["startdepth", criteria.depth[1]])
        }
    }
    let q = map.map(c => {
        return c[0] + "=" + c[1]
    }).join("&")
    return q
}
*/

module.exports = {
    createQuery: createQuery,
    makeScales: makeScales,
    getColor: getColor,
    extractQuery: extractQuery
}