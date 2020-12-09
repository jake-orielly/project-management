<template>
    <input type="file" :data-label="toLabel(field.label)" size="50" @change="handleUpload">
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
            },
            handleUpload(e) {
                console.log(e.target.files);
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>