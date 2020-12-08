<template>
    <div>
        <input 
            class="binary-input" 
            type="radio" 
            :data-label="toLabel(field.label)" 
            :id="field.label + '-0'" 
            :name="field.label" 
            :value="0"
        >
        <label 
            :for="field.label + '-0'"
        >
            {{field.options[0]}}
        </label>
        <input 
            class="binary-input" 
            type="radio" 
            :data-label="toLabel(field.label)" 
            :id="field.label + '-1'" 
            :name="field.label" 
            :value="1"
        >
        <label 
            :for="field.label + '-1'"
        >
            {{field.options[1]}}
        </label>
    </div>
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