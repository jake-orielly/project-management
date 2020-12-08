<template>
    <select :data-label="toLabel(field.label)">
        <option 
            v-for="(option, ind) in field.options" 
            :key="ind + ':' + field.options.indexOf(option)" 
            :value="option"
        >
            {{option}}
        </option>
    </select>
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