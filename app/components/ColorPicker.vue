<template>
    <div class="input-group colorpicker-component">
        <input type="text" class="form-control" v-bind:value="value" />
        <span class="input-group-addon"><i></i></span>
    </div>
</template>

<script>
export default {
    props: ["value"],
    mounted() {
        let self = this
        $(this.$el).colorpicker({
            color: self.value,
            format: "hex"
        }).on("changeColor", function(e) {
            if (e.value) {
                self.$emit("input", e.value)
            }
        })
    },
    beforeDestroy: function() {
        $(this.$el).colorpicker("hide").colorpicker("destroy")
    }
}
</script>