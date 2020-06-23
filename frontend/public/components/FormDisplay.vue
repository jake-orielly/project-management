<template>
    <div id="form-preview-modal" v-if="$parent.formPreview">
        <div v-if="preview" @click="closeFormPreview" class="close-container">
            <i class="fa fa-times clickable"></i>
        </div>
        <p class="title">{{$parent.formTitle}}</p>
        <div v-for="field in $parent.fields" class="form-field" v-bind:key="$parent.fields.indexOf(field)">
            <p> 
                {{field.label}}
                <br>
                <span v-if="field.mandatory">*</span>
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
        <div id="submit-container">
            <button v-if="!preview" @click="submitForm">Submit</button>
        </div>
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
                creator: undefined
            }
        },
        methods: {
            closeFormPreview() {
                this.$parent.formPreview = false;
            },
            submitForm() {
                let fields = document.querySelectorAll('input,select');
                let parentField;
                let response = {};
                let formComplete = true;
                response.fields = {}
                for (let i of fields) {
                    parentField = this.$parent.fields.filter(field => this.toLabel(field.label) == i.dataset.label)[0];
                    if (parentField.mandatory == true && !i.value) {
                        formComplete = false;
                        i.classList.add("incomplete-field");
                        alert("Some mandatory fields incomplete")
                    }
                    if (["description","due_date"].indexOf(i.dataset.label) != -1)
                        response[i.dataset.label] = i.value;
                    else
                        response.fields[i.dataset.label] = i.value;
                }
                response.hash = Math.random().toString(36).substring(2, 15);
                response.history =[
                    {
                        event:"Request Submitted",
                        user:this.$store.state.user,
                        time:String(new Date())
                    }
                ];
                if (formComplete) {
                    response["time"] = String(new Date());
                    requests.submitResponse(this.$parent.currForm,this.$parent.user,response);
                    this.$parent.formPreview = false;
                    this.$parent.currForm = "";
                }
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

    .incomplete-field {
        border: 1px solid black;
        box-shadow: 2px 2px 8px 0px red;
    }

    #submit-container {
        text-align: center;
    }
</style>