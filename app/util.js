import api from "./api"
import Vue from "vue"
const config = require("./config.js")

const createQuery = function(criteria) {
	let map = []
    if (criteria.size) {
        map.push(["size", criteria.size])
    }
    // todo: only skip when checklist and skip > 0
    if (criteria.skip) {
        map.push(["skip", criteria.skip])
    } else {
        //map.push(["skip", 0])
    }
    if (criteria.after && criteria.after > " ") {
        map.push(["after", criteria.after])
    }
    if (criteria.dropped) {
        map.push(["dropped", true])
    }
    if (criteria.redlist) {
        map.push(["redlist", true])
    }
    if (criteria.hab) {
        map.push(["hab", true])
    }
	if (criteria.taxa && criteria.taxa.length > 0) {
		map.push(["taxonid", criteria.taxa.filter(x => x).map(function(x) { return(x.acceptedNameUsageID) }).join(",")])
	}
    if (criteria.datasets && criteria.datasets.length > 0) {
        map.push(["datasetid", criteria.datasets.map(function(x) { return(x.id) }).join(",")])
    }
    if (criteria.nodes && criteria.nodes.length > 0) {
        map.push(["nodeid", criteria.nodes.map(function(x) { return(x.id) }).join(",")])
    }
    if (criteria.institutes && criteria.institutes.length > 0) {
        map.push(["instituteid", criteria.institutes.map(function(x) { return(x.id) }).join(",")])
    }
    if (criteria.areas && criteria.areas.length > 0) {
        map.push(["areaid", criteria.areas.map(function(x) { return(x.id) }).join(",")])
    }
    if (criteria.countries && criteria.countries.length > 0) {
        map.push(["countryid", criteria.countries.map(function(x) { return(x.id) }).join(",")])
    }
    if (criteria.startyear) {
        map.push(["startdate", criteria.startyear + "-01-01"])
    }
    if (criteria.endyear) {
        map.push(["enddate", criteria.endyear + "-12-31"])
    }
	if (criteria.startdate) {
		map.push(["startdate", criteria.startdate])
	}
	if (criteria.enddate) {
		map.push(["enddate", criteria.enddate])
	}
	if (criteria.startdepth) {
		map.push(["startdepth", criteria.startdepth])
	}
	if (criteria.enddepth) {
		map.push(["enddepth", criteria.enddepth])
	}
    if (criteria.geometry) {
        map.push(["geometry", criteria.geometry])
    }
    if (criteria.flags) {
        let exclude = []
        for (let flag in criteria.flags) {
            if (criteria.flags[flag] == "exclude") {
                exclude.push(flag)
            }
        }
        if (exclude.length > 0) {
            map.push(["exclude", exclude.join(",")])
        }
    }
	let q = map.map(c => {
		return c[0] + "=" + c[1]
	}).join("&")
	return q
}

const makeScales = function() {
	return {
		red: {
			colors: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"],
			pointColor: "#cc3300"
		},
		blue: {
			colors: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"],
			pointColor: "#2792BE"
		},
		green: {
			colors: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
			pointColor: "#46AA60"
		},
		bluemono: {
			colors: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
			pointColor: "#4693C4"
		},
		pinkmono: {
			colors: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],
			pointColor: "#DB3A96"
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

const getColorLabels = function(i) {
    if (i == 0) return "1-10";
    if (i == 1) return "11-20";
    if (i == 2) return "21-50";
    if (i == 3) return "51-100";
    if (i == 4) return "101-200";
    if (i == 5) return "201-500";
    if (i == 6) return "501-1000";
    if (i == 7) return ">1000";
    return ""
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

				// todo: shorter

				if (key == "taxonid") {
					params[key] = params[key].split(",")
				}
                if (key == "datasetid") {
                    params[key] = params[key].split(",")
                }
                if (key == "instituteid") {
                    params[key] = params[key].split(",")
                }
                if (key == "nodeid") {
                    params[key] = params[key].split(",")
                }
                if (key == "areaid") {
                    params[key] = params[key].split(",")
                }
                if (key == "countryid") {
                    params[key] = params[key].split(",")
                }
                return params
            }, {})
    } else {
        return null
    }
}

const criteriaFromSpec = function(spec) {
    return {
		taxa: spec.taxa,
        datasets: spec.datasets,
        nodes: spec.nodes,
        institutes: spec.institutes,
        areas: spec.areas,
        countries: spec.countries,
        startyear: spec.startyear,
        endyear: spec.endyear,
		startdate: spec.startdate,
		enddate: spec.enddate,
		startdepth: spec.startdepth,
		enddepth: spec.enddepth,
        geometry: spec.geometry,
        dropped: spec.dropped,
        redlist: spec.redlist,
        hab: spec.hab,
        flags: spec.flags
    }
}

const specFromQuery = function(query) {
    let spec = {
		startdate: query.startdate,
		enddate: query.enddate,
		startdepth: query.startdepth,
		enddepth: query.enddepth,
        geometry: query.geometry,
		download: query.download,
		pointsMode: query.points,
        precision: 3,
        scale: "red",
        opacity: 0.7,
        taxa: [],
        datasets: [],
        nodes: [],
        institutes: [],
		areas: [],
        dropped: query.dropped,
        redlist: query.redlist,
        hab: query.hab,
        flags: {
            "bath_issue": "include"
        }
    }

	let taxonPromises = []
	if (query.taxonid && query.taxonid.length > 0) {
		for (let taxonid of query.taxonid) {
			taxonPromises.push(api.taxon(taxonid))
		}
	}

    let datasetPromises = []
    if (query.datasetid && query.datasetid.length > 0) {
        for (let datasetid of query.datasetid) {
            datasetPromises.push(api.dataset(datasetid))
        }
    }

    let institutePromises = []
    if (query.instituteid && query.instituteid.length > 0) {
        for (let instituteid of query.instituteid) {
            institutePromises.push(api.institute(instituteid))
        }
    }

    let nodePromises = []
    if (query.nodeid && query.nodeid.length > 0) {
        for (let nodeid of query.nodeid) {
            nodePromises.push(api.node(nodeid))
        }
    }

    let areaPromises = []
    if (query.areaid && query.areaid.length > 0) {
        for (let areaid of query.areaid) {
            areaPromises.push(api.area(areaid))
        }
    }

    let countryPromises = []
    if (query.countryid && query.countryid.length > 0) {
        for (let countryid of query.countryid) {
            countryPromises.push(api.country(countryid))
        }
    }

    let promises = []
	promises.push(Promise.all(taxonPromises))
    promises.push(Promise.all(datasetPromises))
    promises.push(Promise.all(nodePromises))
    promises.push(Promise.all(areaPromises))
    promises.push(Promise.all(countryPromises))
    promises.push(Promise.all(institutePromises))

	return Promise.all(promises).then(function(results) {
		spec.taxa = results[0]
        spec.datasets = results[1]
        spec.nodes = results[2]
        spec.areas = results[3]
        spec.countries = results[4]
        spec.institutes = results[5]
        return spec
    })

}

const toast = function(message, options) {
	var defaultOptions = {
		type: "success",
		duration: 3000,
		containerClass: "toastcontainer",
		position: "top-center"
	}
	Object.assign(defaultOptions, options);
	Vue.toasted.show(message, defaultOptions)
}

const enhanceFields = function(record) {
    if ("scientificName" in record && "aphiaID" in record) {
        record["scientificName"] = "<a href=\"" + config.portal + "taxon/" + record["aphiaID"] + "\" target=\"_blank\"/>" + record["scientificName"] + "</a>"
    }
    if ("aphiaID" in record) {
        record["aphiaID"] = "<a href=\"" + config.portal + "taxon/" + record["aphiaID"] + "\" target=\"_blank\"/>" + record["aphiaID"] + "</a>"
    }
    if ("dataset_id" in record) {
        record["dataset_id"] = "<a href=\"" + config.portal + "dataset/" + record["dataset_id"] + "\" target=\"_blank\"/>" + record["dataset_id"] + "</a>"
    }
    if ("node_id" in record) {
        record["node_id"] = "<a href=\"" + config.portal + "node/" + record["node_id"] + "\" target=\"_blank\"/>" + record["node_id"] + "</a>"
    }
}

const orderFields = function(fields) {
    let f = [ "collectionCode", "institutionCode", "maximumDepthInMeters", "minimumDepthInMeters", "decimalLatitude", "decimalLongitude", "date_year", "node_id", "dataset_id", "aphiaID", "scientificName" ]
    fields.sort(function compare(a, b) {
        let ia = f.indexOf(a[0])
        let ib = f.indexOf(b[0])
        return ia > ib ? -1 : 1
    })

}

const generatePopup = function(res) {
	let tables = res.results.map(function(record) {
		let output = "<p><table class=\"table table-condensed\"><thead><tr><th colspan=\"2\">Record " + record.id + "</th></tr></thead><tbody>"
		enhanceFields(record)
        let fields = Object.entries(record)
        orderFields(fields)
        for (let [k, v] of fields) {
		    output = output + "<tr><td>" + k + "</td><td>" + v + "</td></tr>"
		}
		output = output + "</tbody></table></p>"
		return output
	}).join("")
	let preamble = "<p>Found " + res.total + " record"
	if (res.total > 1) {
		preamble = preamble + "s"
	}
	if (res.total > 10) {
		preamble = preamble + ", displaying first 10"
	}
	preamble = preamble + ".</p>"
	return "<div class=\"popupcontainer\"><div class=\"popupcontent\">" + preamble + tables + "</div></div>"
}

const tileUrl = function(criteria) {
	let q = createQuery(criteria)
	let url = config.api + "occurrence/tile/{x}/{y}/{z}?" + q
	return url
}

module.exports = {
    createQuery,
    makeScales,
    getColor,
    extractQuery,
    specFromQuery,
    criteriaFromSpec,
	toast,
	generatePopup,
	tileUrl,
    getColorLabels
}