<template>
    <div>
        <autocomplete 
            :data-label="toLabel(field.label)"
            :suggestions="field.options" 
            :id="field.label + '-autocomplete'"
            class="db-field-autocomplete"
        ></autocomplete>
    </div>
</template>

<script>
    import Autocomplete from '../../components/Autocomplete.vue';

    export default {
        components: {
            Autocomplete
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