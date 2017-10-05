import Vue from "vue"

Vue.component("color-picker", {
    template: `
        <template>
            <div class="input-group colorpicker-component">
                <input type="text" class="form-control" v-bind:value="value" />
                <span class="input-group-addon"><i></i></span>
            </div>
        </template>
    `,
    props: ["value"],
    mounted() {
        let self = this
        $(this.$el).colorpicker({
            color: self.value
        }).on("changeColor", function(e) {
            console.log("emitting " + e.value)
            self.$emit("input", e.value)
        })
    }
})