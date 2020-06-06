<template>
    <div id="form-container">
        <div id="form-content" v-if="!$parent.formSaved">
            <input placeholder="Form Title" type="text" id="form-title" autocomplete="off" v-model="$parent.formTitle">
            <div @click="openFormPreview">
                <i class="fa fa-eye eye-icon clickable" style="font-size:2rem; color:#2C666E;"></i>
            </div>
            <div @click="saveForm">
                <i class="fa fa-save save-icon clickable" style="font-size:2rem; color:#2C666E;"></i>
            </div>
            <p v-if="$parent.fields.length == 0">Add some content to your form!</p>
            <div v-for="field in $parent.fields" class="field-card" v-bind:key="$parent.fields.indexOf(field)"
            draggable 
            @dragstart='onDrag(field)' 
            @dragenter='onDragEnter($event)' 
            @dragover.prevent 
            @dragenter.prevent>
                <div class="field-card-inner">
                    <input class="field-label" v-model="field.label" @input="resizeInput(field)">
                    <span class="field-type">{{"(" + $parent.caps(field.type) + ")"}}</span>
                    <i class="fa fa-bars clickable"></i>
                    <div class="close-container" @click="deleteField(field)">
                        <i class="fa fa-times clickable"></i>
                    </div>
                    <ul v-for="option in field.options" v-bind:key="option">
                        <li>{{option}}</li>
                    </ul>
                    <ul v-for="property in (field.slider ? Object.keys(field.slider) : [])" v-bind:key="field.label + property">
                        <li>{{$parent.caps(property) + ": " + field.slider[property]}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="$parent.formSaved">
            <p>Your form has been saved to the database.</p>
        </div>
    </div>
</template>

<script>
    import requests from '../services/requests.js';

    export default {
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
                requests.postForm(form).then(
                    () => {
                        this.$parent.formSaved = true;
                    }
                );
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
        }
    }
</script>

<style lang="scss" scoped>
    .close-container {
        display: inline-block;
    }

    .field-card-inner *{
        margin-right: 0.5em;
    }

    .field-label {
        margin-right: 0;
    }
</style>