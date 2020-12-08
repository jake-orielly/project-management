<template>
    <input :data-label="toLabel(field.label)" type="range" 
                :min="field.slider.min" 
                :max="field.slider.max" 
                :value="field.slider.initial" 
                :step="field.slider.step" 
                class="slider" id="myRange">
</template>

<script>
    export default {
        props: {
            field: {
                type: Object,
                required: true
            }
        },
        methods: {
            toLabel(s) {
                return s.replace(/ /g,'_').toLowerCase();
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>