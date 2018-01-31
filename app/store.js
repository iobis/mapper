import L from "leaflet"
import api from "./api"
import util from "./util"
import config from "./config"

export const store = {
	state: {
		layers: [],
		mapmode: true,
        data: [],
		pageindex: 0,
		after: [ -1 ],
		selectedLayer: null,
		wkt: null,
		baseLayer: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
		show: true,
        downloads: [],
        currentView: "layers-component"
    },
    group: new L.FeatureGroup(),
    baseGroup: new L.featureGroup(),
	scales: util.makeScales(),
    populate: function() {
        let query = util.extractQuery(window.location.href)
        if (query) {
            util.specFromQuery(query).then(spec => {
                this.addLayer(spec)
				if (spec.download) {
                	this.addDownload(spec)
				}
            })
        }
    },
	addLayer: function(spec) {
		let self = this
		let criteria = util.criteriaFromSpec(spec)
		api.geo(criteria, spec.precision).then(function(response) {
            if (spec.scale == "custom") {
		        spec.colors = [ spec.customColor ]
            } else {
                spec.colors = self.scales[spec.scale].colors
            }
            let layer = L.geoJSON(response, {
				style: function (feature) {
					return {
						fillColor: util.getColor(feature.properties.n, spec.colors),
						weight: 0,
						fillOpacity: spec.opacity
					}
				}
			})
			layer.addTo(self.group)
			spec.layer = layer
			spec.count = null
			spec.pointsmode = false
			spec.size = config.pagesize
			self.state.layers.push(spec)
			api.count(criteria).then(function(response) {
				spec.count = response
			})
		})
        let q = util.createQuery(criteria)
        window.history.pushState("", "", "?" + q)
        this.state.currentView = "layers-component"
        util.toast("Layer added")
	},
	togglePoints: function(layer) {
		let self = this
		if (layer.pointsmode) {
			layer.pointsLayer.removeFrom(this.group)
			layer.layer.addTo(this.group)
		} else {
			layer.layer.removeFrom(this.group)
			if (!layer.pointsLayer) {
				let criteria = util.criteriaFromSpec(layer)
				api.geoPoints(criteria).then(function(response) {
					let color
					if (layer.colors.length > 1) {
						color = layer.colors[5]
					} else {
						color = layer.colors[0]
					}
					let pointsLayer = L.geoJSON(response, {
						pointToLayer: function (feature, latlng) {
							return new L.CircleMarker(latlng, {
								radius: 4,
								fillOpacity: 1,
								opacity: 1,
								color: "white",
								fillColor: color,
								weight: 1.5,
								clickable: true
							})
						}
					})
					pointsLayer.addTo(self.group)
					layer.pointsLayer = pointsLayer
				})
			} else {
				layer.pointsLayer.addTo(self.group)
			}
		}
		layer.pointsmode = !layer.pointsmode
	},
    removeLayer: function(layer) {
        layer.layer.removeFrom(this.group)
		if (layer.pointsLayer) {
			layer.pointsLayer.removeFrom(this.group)
		}
        let i = this.state.layers.indexOf(layer)
        this.state.layers.splice(i, 1)
    },
	reset: function() {
		this.state.after = [ -1 ]
		this.state.pageindex = 0
	},
    viewData: function(layer) {
		this.reset()
		this.state.selectedLayer = layer
        this.state.mapmode = false
		this.state.show = false
		this.fetch()
    },
	fetch: function() {
		let self = this
		this.state.selectedLayer.after = this.state.after.slice(-1)[0]
		api.fetch(this.state.selectedLayer).then(function(response) {
			self.state.data = response.results
		})
	},
    showMap: function() {
		this.state.show = true
        this.state.mapmode = true
    },
	nextPage: function() {
		this.state.pageindex += 1
		this.state.after.push(this.state.data.slice(-1)[0].id)
		this.fetch()
	},
	previousPage: function() {
		this.state.pageindex -= 1
		this.state.after.pop()
		this.fetch()
	},
    updateBase: function() {
	    this.baseGroup.clearLayers()
        L.tileLayer(this.state.baseLayer).addTo(this.baseGroup)
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
            self.state.downloads.push(download)

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

        this.state.currentView = "downloads-component"
		util.toast("Download added")

	}
}