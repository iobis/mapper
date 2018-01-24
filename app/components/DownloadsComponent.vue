<template>
    <div>
        <span class="sideheader">Downloads</span>

        <div v-if="sharedState.downloads.length == 0" class="sidepanel"><div class="content"><p class="no-results">No downloads.</p></div></div>

        <div v-for="download in sharedState.downloads" class="sidelayer">

            {{ download }}

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
        methods: {
        }
    }
</script>