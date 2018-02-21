<template>
    <div>
        <div class="sideheader">Options</div>
        <div class="sidesubheader">Base layer</div>

        <div class="sidepanel">
            <div class="panelcontent">
                <input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" id="gray"><label for="gray" class="radiolabel">Esri.WorldGrayCanvas</label>
                <br/><input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}" id="ocean"><label for="ocean" class="radiolabel">Esri.OceanBasemap</label>
                <br/><input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png" id="positron"><label for="positron" class="radiolabel">CartoDB.PositronNoLabels</label>
                <br/><input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png" id="dark"><label for="dark" class="radiolabel">CartoDB.DarkMatterNoLabels</label>
                <br/><input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" id="osm"><label for="osm" class="radiolabel">OpenStreetMap.BlackAndwhite</label>
                <br/><input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" id="osmmapnik"><label for="osmmapnik" class="radiolabel">OpenStreetMap.Mapnik</label>
                <br/><input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" id="esri"><label for="esri" class="radiolabel">Esri.WorldImagery</label>
            </div>
        </div>
    </div>
</template>

<script>
    import { store } from "../store"

    export default {
        data() {
            return {
                sharedState: store.state
            }
        },
        watch: {
            "sharedState.baseLayer": function() {
                store.updateBase()
            }
        },
        methods: {
        }
    }
</script>