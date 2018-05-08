import L from "leaflet"
import api from "./api"
import util from "./util"
import MultiPoint from "./multipoint"
import config from "./config"

let defaultCriteria = function() {
    return {
        taxa: [],
        datasets: [],
        areas: [],
        timeValues: [ null, null ],
        depthValues: [ null, null ],
        selectedScale: "red",
        startYear: 1900,
        currentYear: (new Date()).getFullYear(),
        customColor: "#cc3300",
        opacity: 0.7,
        wkt: null
    }
}

export const store = {
    layers: [],
    mapMode: true,
    dataTable: {
        data: [],
        pageIndex: 0,
        after: [ -1 ]
    },
    checklistTable: {
        data: [],
        pageIndex: 0,
        skip: 0
    },
    datasetTable: {
        data: [],
        pageIndex: 0,
        skip: 0
    },
    criteria: defaultCriteria(),
    selectedLayer: null,
    editLayer: null,
    baseLayer: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    show: true,
    downloads: [],
    currentView: "criteria-component",
    statistics: null,
    group: new L.FeatureGroup(),
	map: null,
    baseGroup: new L.featureGroup(),
	scales: util.makeScales(),
    populate: function() {
        let query = util.extractQuery(window.location.href)
        if (query) {
            util.specFromQuery(query).then(spec => {
				if (spec.download) {
                	this.addDownload(spec)
                    this.addLayer(spec, false, false)
                    util.toast("Layer added")
				} else {
                    this.addLayer(spec, true, false)
                    util.toast("Layer added")
                }
            })
        }
    },
    resetCriteria: function() {
        Object.assign(this.criteria, defaultCriteria())
    },
    loadCriteria: function(layer) {
        this.criteria.taxa = layer.taxa
        this.criteria.datasets = layer.datasets
        this.criteria.areas = layer.datasets
        this.editLayer = layer
    },
	addGridLayer: function(spec) {
		let self = this
		if (spec.pointsLayer) {
			spec.pointsLayer.removeFrom(this.group)
		}
		if (spec.gridLayer) {
			spec.gridLayer.addTo(this.group)
		} else {
			let criteria = util.criteriaFromSpec(spec)
			api.geo(criteria, spec.precision).then(function(response) {
				spec.gridLayer = L.geoJSON(response, {
					style: function (feature) {
						return {
							fillColor: util.getColor(feature.properties.n, spec.colors),
							weight: 0,
							fillOpacity: spec.opacity
						}
					}
				})
				spec.gridLayer.addTo(self.group)
				spec.size = config.dataTable.pageSize
			})
			let q = util.createQuery(criteria)
			window.history.pushState("", "", "?" + q)
		}
	},
	addPointsLayer: function(layer) {
		let self = this
		if (layer.gridLayer) {
			layer.gridLayer.removeFrom(this.group)
		}
		if (layer.pointsLayer) {
			layer.pointsLayer.addTo(self.group)
		} else {
			let criteria = util.criteriaFromSpec(layer)
			let url = util.tileUrl(criteria)
			let color
			if (layer.pointColor) {
				color = layer.pointColor
			} else if (layer.colors.length > 1) {
				color = layer.colors[5]
			} else {
				color = layer.colors[0]
			}
			layer.pointsLayer = new MultiPoint(url, {
				fill: color,
                updateWhenZooming: false,
				radius: 3.5,
				onTileCounted: function(count) {
					if (count >= 10000) {
						self.pointsExceeded()
					}
				},
				onClick: function(e) {
					let [lng, lat] = e
					let criteria = util.criteriaFromSpec(layer)
					api.geoPoint(criteria, lng, lat, self.map.getZoom()).then(function(res) {
						L.popup({
							maxWidth: 500
						}).setLatLng({ lat: lat, lng: lng}).setContent(util.generatePopup(res)).openOn(self.map)
					})
				}
			})
			layer.pointsLayer.addTo(self.group)
		}
	},
    addLayerTemp: function() {
        let spec = {
            taxa: JSON.parse(JSON.stringify(this.criteria.taxa)),
            datasets: JSON.parse(JSON.stringify(this.criteria.datasets)),
            areas: JSON.parse(JSON.stringify(this.criteria.areas)),
            startyear: this.criteria.timeValues[0],
            endyear: this.criteria.timeValues[1],
            startdepth: this.criteria.depthValues[0],
            enddepth: this.criteria.depthValues[1],
            precision: 3,
            geometry: this.criteria.wkt,
            opacity: this.criteria.opacity,
            scale: this.criteria.selectedScale,
            customColor: this.criteria.customColor,
            count: null
        }
        this.addLayer(spec)
    },
	addLayer: function(layer, navigate = false, edit = true) {
		let self = this
        if (this.editLayer) {
		    this.removeLayer(this.editLayer)
        }
        if (edit) {
		    this.editLayer = layer
        }
		if (layer.scale == "custom") {
			layer.colors = [ layer.customColor ]
		} else {
			layer.colors = this.scales[layer.scale].colors
			if (this.scales[layer.scale].pointColor) {
				layer.pointColor = this.scales[layer.scale].pointColor
			}
		}
		if (layer.pointsMode) {
			this.addPointsLayer(layer)
		} else {
			this.addGridLayer(layer)
		}
		let criteria = util.criteriaFromSpec(layer)
		api.count(criteria).then(function(response) {
			layer.count = response
			self.layers.push(layer)
			if (navigate) {
                self.currentView = "layers-component"
            }
		})
	},
    saveLayer: function() {
	    this.editLayer = null
        this.currentView = "layers-component"
        util.toast("Layer saved")
    },
	pointsExceeded: function() {
		let self = this
		if (!this.pointToast) {
			util.toast("Tile exceeded maximum of 10,000 locations, try narrowing down data selection", {
				type: "error",
				duration: 2000
			})
		}
		this.pointToast = true
		setTimeout(function() {
			self.pointToast = false
		}, 3000)
	},
	togglePoints: function(layer) {
		if (layer.pointsMode) {
			this.addGridLayer(layer)
		} else {
			this.addPointsLayer(layer)
		}
		layer.pointsMode = !layer.pointsMode
	},
    clearLayer: function() {
	    if (this.editLayer != null) {
            this.removeLayer(this.editLayer)
            this.editLayer = null
        }
    },
    removeLayer: function(layer) {
        if (layer.gridLayer) {
            layer.gridLayer.removeFrom(this.group)
        }
        if (layer.pointsLayer) {
            layer.pointsLayer.removeFrom(this.group)
        }
        let i = this.layers.indexOf(layer)
        this.layers.splice(i, 1)
    },
	reset: function() {
        // todo: combine reset functionality
		this.dataTable.after = [ -1 ]
        this.dataTable.pageIndex = 0
        this.checklistTable.pageIndex = 0
        this.checklistTable.skip = 0
        this.datasetTable.pageIndex = 0
        this.datasetTable.skip = 0
	},
    viewData: function(layer) {
		this.reset()
		this.selectedLayer = layer
        this.mapMode = false
		this.show = false
        this.fetch()
        this.fetchChecklist()
        this.fetchDatasets()
		this.fetchStatistics()
    },
    fetch: function() {
        let self = this
        this.selectedLayer.after = this.dataTable.after.slice(-1)[0]
        api.fetch(this.selectedLayer).then(function(response) {
            self.dataTable.data = response.results
        })
    },
	fetchChecklist: function() {
		let self = this
		this.selectedLayer.skip = this.checklistTable.skip
		api.fetchChecklist(this.selectedLayer).then(function(response) {
			self.checklistTable.data = response.results
		})
	},
	fetchStatistics: function() {
		let self = this
		api.fetchStatistics(this.selectedLayer).then(function(response) {
			self.statistics = response
		})
	},
    fetchDatasets: function() {
        let self = this
        this.selectedLayer.skip = this.datasetTable.skip // todo: better way?
        api.fetchDatasets(this.selectedLayer).then(function(response) {
            self.datasetTable.data = response.results
        })
    },
    showMap: function() {
		this.show = true
        this.mapMode = true
    },
	// todo: combine pagination functionality
    nextPageData: function() {
        this.dataTable.pageIndex += 1
        this.dataTable.after.push(this.dataTable.data.slice(-1)[0].id)
        this.fetch()
    },
    previousPageData: function() {
        this.dataTable.pageIndex -= 1
        this.dataTable.after.pop()
        this.fetch()
    },
	nextPageChecklist: function() {
		this.checklistTable.pageIndex += 1
		this.checklistTable.skip += config.checklistTable.pageSize
		this.fetchChecklist()
	},
	previousPageChecklist: function() {
		this.checklistTable.pageIndex -= 1
		this.checklistTable.skip -= config.checklistTable.pageSize
		this.fetchChecklist()
	},
	nextPageDataset: function() {
		this.datasetTable.pageIndex += 1
		this.datasetTable.skip += config.datasetTable.pageSize
		this.fetchDatasets()
	},
	previousPageDataset: function() {
		this.datasetTable.pageIndex -= 1
		this.datasetTable.skip -= config.datasetTable.pageSize
		this.fetchDatasets()
	},
    updateBase: function() {
	    this.baseGroup.clearLayers()
        L.tileLayer(this.baseLayer).addTo(this.baseGroup)
    },
    updateDownloadStatus(download, status){
        if (status.total) {
            download.total = status.total
        }
        if (status.records) {
            download.records = status.records
        }
        if (status.status == "busy") {
        } else if (status.status == "ready") {
            download.ready = true
        } else if (status == "unknown") {
            download.ready = true
            download.error = true
        }
    },
    addDownload: function(layer) {
        let self = this
        let criteria = util.criteriaFromSpec(layer)

        api.download(criteria).then(function(response) {
            let hash = response.hash

            let download = {
                criteria: criteria,
                hash: hash,
                records: null,
                total: null,
                ready: false,
                error: false
            }
            self.downloads.push(download)

            api.downloadStatus(hash).then(function(status) {
                self.updateDownloadStatus(download, status)
                if (!download.ready) {
                    let iid = setInterval(function() {
                        api.downloadStatus(hash).then(function(status) {
                            self.updateDownloadStatus(download, status)
                            if (download.ready) {
                                clearInterval(iid)
								util.toast("Download finished")
                            }
                        })
                    }, 2000)
                } else {
					util.toast("Download finished")
				}
            })
        })
        this.currentView = "downloads-component"
		util.toast("Download added")

	}
}