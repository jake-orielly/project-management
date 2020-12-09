<template>
    <div id="form-container">
        <div id="form-content" v-if="!$parent.formSaved">
            <input placeholder="Form Title" type="text" id="form-title" autocomplete="off" v-model="$parent.formTitle">
            <font-awesome-icon icon="eye" @click="openFormPreview" class="eye-icon clickable"/>
            <font-awesome-icon icon="save" @click="saveForm" class="save-icon clickable"/>
            <div v-if="!$parent.fields.length" class="no-content-div">
                <p> Your form currently has no content </p>
            </div>
            <div v-for="field in $parent.fields" class="field-card" v-bind:key="$parent.fields.indexOf(field)"
            draggable 
            @dragstart='onDrag(field)' 
            @dragenter='onDragEnter($event)' 
            @dragover.prevent 
            @dragenter.prevent>
                <div class="field-card-inner">
                    <input class="field-label" v-model="field.label" @input="resizeInput(field)">
                    <span class="field-type">{{"(" + $parent.caps(field.type) + ")"}}</span>
                    <font-awesome-icon icon="bars" class="clickable"/>
                    <font-awesome-icon v-if="!field.recordField" @click="makeRecordField(field)" icon="unlock" class="clickable"/>
                    <font-awesome-icon v-if="field.recordField" icon="lock"/>
                    <font-awesome-icon icon="times" @click="deleteField(field)" class="close-icon clickable"/>
                    <ul v-for="(option, index) in field.options" v-bind:key="option">
                        <li>
                            <input v-model="field.options[index]">
                        </li>
                    </ul>
                    <ul v-for="property in (field.slider ? Object.keys(field.slider) : [])" v-bind:key="field.label + property">
                        <li>
                            {{$parent.caps(property) + ": "}}
                            <input v-model="field.slider[property]">
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import requests from '../services/requests.js';

    export default {
        components: {
            FontAwesomeIcon
        },
        data() {
            return {
            }
        },
        methods: {
            openFormPreview() {
                this.$parent.formPreview = true;
            },
            saveForm() {
                let form = {};
                form.title = this.$parent.formTitle;
                form.fields = this.$parent.fields.slice();
                form.record_fields = this.$parent.recordFields;
                
                requests.retrieveForm(
                    {"title":this.$parent.formTitle},
                    this.$store.state.user
                ).then(
                    response => {
                        if (!JSON.parse(response.responseText).length) {
                            requests.postForm(form,this.$store.state.user).then(
                                () => {
                                    this.$parent.formSaved = true;
                                    this.$parent.$refs.FormList.updateFormList("mine"); 
                                }
                            );
                        }
                        else {
                            requests.patchForm(form,this.$store.state.user).then(
                                () => {
                                    this.$parent.formSaved = true;
                                }
                            );
                        }
                        this.$parent.recordFields = [];
                    }
                )
            },
            onDrag(item) {
                for (let i = 0; i < this.$parent.fields.length; i++)
                    if (this.$parent.fields[i] == item) {
                        this.draggingPos = i;
                        this.draggingField = this.$parent.fields[i];
                        break;
                    }
            },
            onDragEnter(event) {
                let targetInner, targetLabel, targetPos;
                // Get the value of the input element we're dragging to
                if (event.target.classList.contains("field-card"))
                    targetInner = event.target.getElementsByClassName("field-card-inner")[0];
                else {
                    targetInner = event.target;

                    // If click and drag has unusual bugs it's probably this
                    while (!targetInner.classList.contains("field-card-inner"))
                        targetInner = targetInner.parentElement;
                }
                targetLabel = targetInner.getElementsByTagName("input")[0].value;

                // Find it's position in fields
                for (let i = 0; i < this.$parent.fields.length; i++)
                    if (this.$parent.fields[i].label == targetLabel) {
                        targetPos = i;
                        break;
                    }
                
                if (targetPos != this.draggingPos) {
                    this.$parent.fields.splice(this.draggingPos,1);
                    this.$parent.fields = this.$parent.fields.slice(0,targetPos).concat([this.draggingField]).concat(this.$parent.fields.slice(targetPos));
                    this.draggingPos = targetPos;
                }
            },
            resizeInput(field) {
                let fieldIndex = this.$parent.fields.indexOf(field);
                let inputs = document.getElementsByClassName("field-label");
                let currInput = inputs[fieldIndex];
                currInput.style.width = (field.label.length * 0.95 + 2) + "ch";
            },
            deleteField(field) {
                this.$parent.fields.splice(this.$parent.fields.indexOf(field),1);
            },
            makeRecordField(field) {
                let confirmation = confirm("Create a new record field based on " + field.label + "?")
                if (confirmation) {
                    requests.createRecordField({
                        label:field.label,
                        type:field.type,
                        id:field.id
                    }).then(
                        () => {
                            this.$parent.recordFields.push(field.id);
                            field.recordField = true;
                        }
                    )
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../scss/_variables.scss";

#form-content {
    display: inline-block;
    position: relative;
    border: 3px solid $buzz-blue;
    border-radius: 1rem;
    padding: 2rem;
    overflow-y:auto;
    min-width:80%;
    min-height:30%;
    max-height: 60%;
}

.no-content-div {
    margin: 2rem;
    font-size: 1.5rem;
}

.close-icon {
    display: inline-block;
}

.field-card-inner *{
    margin-right: 0.5em;
}

.field-label {
    margin-right: 0;
}

.save-icon {
    position: absolute;
    right: 3rem;
    font-size: 2rem;
}

.eye-icon {
    position: absolute;
    right: 5.5rem;
}

.eye-icon, .save-icon {
    font-size:2rem; 
    color:$buzz-black;
}
</style>