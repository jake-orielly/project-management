<template>
    <div id="form-preview-modal" v-if="$parent.formPreview">
        <div @click="closeFormPreview">
            <i class="fa fa-times"></i>
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
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
            closeFormPreview() {
                this.$parent.formPreview = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .form-preview-close {
        font-size:2rem;
        color:#2C666E;
    }
</style>