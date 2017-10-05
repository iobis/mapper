<template>
    <div>
        <a class="sideheader" data-toggle="collapse" href="#collapse3" aria-expanded="true" aria-controls="collapse3">Options</a>
        <div class="collapse show sidepanel" id="collapse3">
            <div class="content">
                <p>Base layer</p>
                <input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" id="gray"><label for="gray" class="radiolabel">Esri.WorldGrayCanvas</label>
                <br/><input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}" id="ocean"><label for="ocean" class="radiolabel">Esri.OceanBasemap</label>
                <br/><input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png" id="positron"><label for="positron" class="radiolabel">CartoDB.PositronNoLabels</label>
                <br/><input type="radio" name="baselayer" v-model="sharedState.baseLayer" value="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png" id="dark"><label for="dark" class="radiolabel">CartoDB.DarkMatterNoLabels</label>
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