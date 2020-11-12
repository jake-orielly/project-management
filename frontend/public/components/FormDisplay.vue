<template>
    <div id="form-preview-modal" v-if="$parent.formPreview">
        <div class="close-icon-container">
            <font-awesome-icon icon="times" 
            v-if="preview" @click="closeFormPreview"
            class="clickable close-icon"/>
        </div>
        <p class="title">{{$parent.formTitle}}</p>
        <div v-for="field in $parent.fields" class="form-field" v-bind:key="$parent.fields.indexOf(field)">
            <p> 
                {{field.label}}
                <span v-if="field.mandatory">*</span>
                <br>
                <input v-if="field.type == 'text'" :data-label="toLabel(field.label)" type="text">
                <input v-if="field.type == 'number'" :data-label="toLabel(field.label)" type="number">
                <textarea v-if="field.type == 'text (long)'" :data-label="toLabel(field.label)" type="number"></textarea>
                <input v-if="field.type == 'date'" :data-label="toLabel(field.label)" type="date">
                <Binary v-if="field.type == 'binary'" :field="field" />
                <Dropdown v-if="field.type == 'dropdown'" :field="field" />
                <Slider v-if="field.type == 'slider'" :field="field" />
            </p>
        </div>
        <div id="submit-container">
            <button v-if="!preview" @click="submitForm">Submit</button>
        </div>
    </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import requests from '../services/requests.js';
    import Binary from './field-displays/BinaryDisplay';
    import Dropdown from './field-displays/DropdownDisplay';
    import Slider from './field-displays/SliderDisplay';
    

    export default {
        components: {
            FontAwesomeIcon,
            Binary,
            Dropdown,
            Slider
        },
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
                    if (i.classList.value.indexOf("binary-input") != -1) {
                        if (i.checked)
                            response.fields[i.dataset.label] = i.value;
                    }
                    else if (["description"].indexOf(i.dataset.label) != -1)
                        response[i.dataset.label] = i.value;
                    else
                        response.fields[i.dataset.label] = i.value;
                }
                console.log(response)
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
    @import "../scss/_variables.scss";

    .close-icon-container {
        text-align: right;
    }

    .close-icon {
        margin-right: 2rem;
        font-size: 2rem;
        color:$buzz-black;
    }

    .incomplete-field {
        border: 1px solid black;
        box-shadow: 2px 2px 8px 0px red;
    }

    #submit-container {
        text-align: center;
    }
</style>