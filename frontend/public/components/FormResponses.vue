<template>
    <div id="response-list">
        <table>
            <thead>
                <tr>
                    <th v-for="field in fields" v-bind:key="field" class="clickable" @click="setSort(field)">
                        {{prettify(field)}}
                        <img v-if="sort == field && sortOrder == 'ascending'" class="sort-img" src="../images/sort-up.png">
                        <img v-if="sort == field && sortOrder == 'descending'" class="sort-img" src="../images/sort-down.png">       
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="response in responses" v-bind:key="response.hash">
                    <td v-for="field in fields" v-bind:key="response.hash + '-' + field">
                        {{getData(response,field)}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import requests from '../services/requests.js';
    
    export default {
        data() {
            return {
                responses: [],
                fields: [],
                sort: undefined,
                sortOrder: undefined
            }
        },
        mounted() {
            requests.getResponses("Brand Request",this.$store.state.user).then(
                response => {
                    let responseText = JSON.parse(response.responseText);
                    let responseData = JSON.parse(responseText.data)
                    this.responses = responseData;
                    this.fields = ["description","due_date"].concat(Object.keys(responseData[0].fields));
                    this.setSort("due_date")
                }
            )
        },
        methods: {
            getData(response,field) {
                if (field == "due_date" || field == "description")
                    return response[field]
                else
                    return response.fields[field]
            },
            prettify(text) {
                let splitText = text.split('_');
                let result = []
                for (let i of splitText)
                    result.push(i.substr(0,1).toUpperCase() + i.substr(1))
                return result.join(' ');
            },
            setSort(field) {
                let app = this;

                if (this.sort == field && this.sortOrder == 'ascending')
                    this.sortOrder = 'descending';
                else {
                    this.sort = field;
                    this.sortOrder = 'ascending';
                }

                this.responses = this.responses.sort(function(a, b) {
                    let result;

                    if (app.getData(a,app.sort) > app.getData(b,app.sort))
                        result = -1
                    else
                        result = 1

                    if (app.sortOrder == 'descending')
                        result *= -1
                    
                    return result;
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .title {
        text-decoration: underline;
        font-weight: bold;
    }

    #response-list {
        width: 90%;
        margin-left: 2em;
        margin-top: 1em;
        padding: 1rem;
        border: 3px solid #2C666E;
        border-radius: 1rem;
        font-size: 1.15rem;
    }

    th, td {
        padding: 0em 2em;
    }

    .sort-img {
        height: 0.5em;
        margin: 0.15em;
    }
</style>