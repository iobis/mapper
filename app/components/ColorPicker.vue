<template>
    <div class="input-group colorpicker-component">
        <input type="text" class="form-control" v-bind:value="value" />
        <span class="input-group-addon"><i></i></span>
    </div>
</template>

<script>
import _ from "lodash"

export default {
    props: ["value"],
    mounted() {
        let self = this
        $(this.$el).colorpicker({
            color: self.value,
            useAlpha: false,
            format: "hex"
        }).on("colorpickerChange", _.debounce((e) => {
            self.$emit("input", e.value)
        }, 1000))
    },
    beforeDestroy: function() {
        $(this.$el).colorpicker("hide")
        $(this.$el).colorpicker("destroy")
    }
}
</script>