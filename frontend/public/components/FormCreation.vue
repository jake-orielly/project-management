<template>
    <div id="form-container">
        <div id="form-content" v-if="!$parent.formSaved">
            <input placeholder="Form Title" type="text" id="form-title" autocomplete="off" v-model="$parent.formTitle">
            <i class="fa fa-eye eye-icon clickable" style="font-size:2rem; color:#2C666E;" @click="openFormPreview"></i>
            <i class="fa fa-save save-icon clickable" style="font-size:2rem; color:#2C666E;" @click="saveForm"></i>
            <p v-if="fields.length == 0">Add some content to your form!</p>
            <div v-for="field in fields" class="field-card" v-bind:key="field.label"
            draggable 
            @dragstart='onDrag(field)' 
            @dragenter='onDragEnter($event)' 
            @dragover.prevent 
            @dragenter.prevent>
                <div class="field-card-inner">
                    <input class="field-label" v-model="field.label" @input="resizeInput(field)">
                    <span class="field-type">{{"(" + $parent.caps(field.type) + ")"}}</span>
                    <i class="fa fa-bars clickable"></i>
                    <i class="fa fa-times clickable" @click="deleteField(field)"></i>
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
                fields: this.$parent.fields
            }
        },
        methods: {
            openFormPreview() {
                this.$parent.formPreview = true;
            },
            saveForm() {
                /* eslint-disable */
                console.log(1)
                let form = {};
                form.title = this.formTitle;
                form.fields = this.fields.slice();
                requests.postForm(form).then(
                    () => {
                        this.formSaved = true;
                    }
                );
            },
            onDrag(item) {
                for (let i = 0; i < this.fields.length; i++)
                    if (this.fields[i] == item) {
                        this.draggingPos = i;
                        this.draggingField = this.fields[i];
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
                for (let i = 0; i < this.fields.length; i++)
                    if (this.fields[i].label == targetLabel) {
                        targetPos = i;
                        break;
                    }
                
                if (targetPos != this.draggingPos) {
                    this.fields.splice(this.draggingPos,1);
                    this.fields = this.fields.slice(0,targetPos).concat([this.draggingField]).concat(this.fields.slice(targetPos));
                    this.draggingPos = targetPos;
                }
            },
            resizeInput(field) {
                let fieldIndex = this.fields.indexOf(field);
                let inputs = document.getElementsByClassName("field-label");
                let currInput = inputs[fieldIndex];
                currInput.style.width = (field.label.length * 0.95 + 2) + "ch";
            },
            deleteField(field) {
                this.fields.splice(this.fields.indexOf(field),1);
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>