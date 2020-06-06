<template>
    <div id="form-preview-modal" v-if="$parent.formPreview">
        <div @click="closeFormPreview" class="close-container">
            <i class="fa fa-times clickable"></i>
        </div>
        <p class="title">{{$parent.formTitle}}</p>
        <div v-for="field in $parent.fields" class="form-field" v-bind:key="field.label">
            <p> {{field.label}}
                <input v-if="field.type == 'text'" type="text">
                <input v-if="field.type == 'number'" type="number">
                <textarea v-if="field.type == 'text (long)'" type="number"></textarea>
                <input v-if="field.type == 'date'" type="date">
                <select v-if="field.type == 'dropdown'">
                    <option v-for="option in field.options" value="option" v-bind:key="option">{{option}}</option>
                </select>
                <input v-if="field.type == 'slider'" type="range" 
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
                for (let i of fields) {
                    response[i.dataset.label] = i.value;
                }
                requests.submitResponse(this.currForm,response);
                this.formPreview = false;
                this.currForm = "";
            },
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