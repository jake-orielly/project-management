<template>
    <div style="position:relative" v-bind:class="{'open':openSuggestion}">
        <input class="form-control" type="text" v-model="$parent.autocompleteVal"
            @keydown.enter="enter"
            @keydown.down="down"
            @keydown.up="up"  
            @input="change"
        />
        <ul class="dropdown-menu" style="width:100%" v-if="$parent.autocompleteVal">
            <li v-for="(suggestion, index) in matches"
                :key="suggestion.input"
                v-bind:class="{'active': isActive(index)}"
                @click="suggestionClick(index)"
            >
                <p>
                    <span>{{ suggestion.input.substr(0,matches[index].index) }}</span>
                    <span id="selection">{{suggestion.input.substr(matches[index].index,$parent.autocompleteVal.length)}}</span>
                    <span>{{suggestion.input.substr(matches[index].index + $parent.autocompleteVal.length) }}</span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            suggestions: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                open: false,
                current: 0,
                active: "active"
            }
        },
        computed: {
            matches() {
                return this.suggestions.filter(str => {
                    return str.toLowerCase().match(this.$parent.autocompleteVal.toLowerCase());
                }).map(str => {
                    return str.match(this.$parent.autocompleteVal);
                });
            },

            openSuggestion() {
                return this.$parent.autocompleteVal !== "" &&
                    this.matches.length != 0 &&
                    this.open === true;
            }
        },
        methods: {
            enter() {
                this.$parent.autocompleteVal = this.matches[this.current];
                this.open = false;
            },

            up() {
                this.current = Math.abs(this.current - 1)
                this.current %= this.suggestions.length;
            },

            down() {
                this.current++;
                this.current %= this.suggestions.length;
            },

            isActive(index) {
                return index === this.current;
            },

            change() {
                if (this.open == false) {
                    this.open = true;
                    this.current = 0;
                }
            },

            suggestionClick(index) {
                this.$parent.autocompleteVal = this.matches[index];
                this.open = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .input-container, input {
        position: relative;
        font-size: 1.25rem;
    }

    ul {
        width:100%;
    }

    li {
        padding: 0.25rem 0.5rem;
    }

    li p {
        margin: 0;
    }
    
    .active {
        background-color: #445E935A;
    }

    #selection {
        font-weight: bold;
    }
</style>