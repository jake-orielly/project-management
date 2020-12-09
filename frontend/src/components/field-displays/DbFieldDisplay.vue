<template>
    <div>
        <AutocompleteInput 
            :data-label="toLabel(field.label)"
            :suggestions="field.options" 
            :id="field.label + '-autocomplete'"
            class="db-field-autocomplete"
        ></AutocompleteInput>
    </div>
</template>

<script>
    import AutocompleteInput from '../../components/AutocompleteInput.vue';

    export default {
        components: {
            AutocompleteInput
        },
        props: {
            field: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                autocompleteVal: ""
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