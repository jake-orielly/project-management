<template>
    <div id="form-preview-modal" v-if="$parent.formPreview">
        <div v-if="preview" @click="closeFormPreview" class="close-container">
            <i class="fa fa-times clickable"></i>
        </div>
        <p class="title">{{$parent.formTitle}}</p>
        <div v-for="field in $parent.fields" class="form-field" v-bind:key="$parent.fields.indexOf(field)">
            <p> 
                {{field.label}}
                <input v-if="field.type == 'text'" :data-label="toLabel(field.label)" type="text">
                <input v-if="field.type == 'number'" :data-label="toLabel(field.label)" type="number">
                <textarea v-if="field.type == 'text (long)'" :data-label="toLabel(field.label)" type="number"></textarea>
                <input v-if="field.type == 'date'" :data-label="toLabel(field.label)" type="date">
                <select v-if="field.type == 'dropdown'" :data-label="toLabel(field.label)">
                    <option v-for="option in field.options" v-bind:key="$parent.fields.indexOf(field) + ':' + field.options.indexOf(option)" :value="option">{{option}}</option>
                </select>
                <input v-if="field.type == 'slider'" :data-label="toLabel(field.label)" type="range" 
                    :min="field.slider.min" 
                    :max="field.slider.max" 
                    :value="field.slider.initial" 
                    :step="field.slider.step" 
                    class="slider" id="myRange">
            </p>
        </div>
        <button v-if="!preview" @click="submitForm">Submit</button>
    </div>
</template>

<script>
    import requests from '../services/requests.js';

    export default {
        props: {
            preview: {
                type: Boolean,
                required: true
            },
        },
        data() {
            return {
            }
        },
        methods: {
            closeFormPreview() {
                this.$parent.formPreview = false;
            },
            submitForm() {
                let fields = document.querySelectorAll('input,select');
                let response = {};
                for (let i of fields)
                    response[i.dataset.label] = i.value;
                response["time"] = String(new Date());
                requests.submitResponse(this.$parent.currForm,response);
                this.$parent.formPreview = false;
                this.$parent.currForm = "";
            },
            toLabel(s) {
                return s.replace(/ /g,'_').toLowerCase();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .close-container {
        text-align: right;
        margin-right: 2rem;
        font-size: 2rem;
        color:#2C666E;
    }
</style>