<template>
    <div id="response-list" v-if="showingResponse">
        <div class="close-responses clickable" @click="closeResponses">
            <i class="fa fa-times"></i>
        </div>
        <p class="title" id="component-title">
            Form Responses
        </p>
        <i class="fa fa-filter clickable"></i>
        <div id="filter-input-container">
            <input type="text" id="filter-input">
            <button @click="applyFilter">Apply</button>
        </div>
        <br>
        <div id="filter-tags-container"> 
            <div v-for="filter in filters" v-bind:key="filter" class="filter-tag">
                {{filter}}
                <span class="clickable" @click="removeFilter(filter)">
                    <i class="fa fa-times"></i>
                </span>
            </div>
        </div>
        <div v-if="!responses.length" class="no-responses">
            This form has no responses yet.
        </div>
        <table v-if="responses.length">
            <thead>
                <tr>
                    <th v-for="field in fields" v-bind:key="field" class="clickable" @click="setSort(field)">
                        {{prettify(field)}}
                        <img v-if="sort == field && sortOrder == 'ascending'" class="sort-img" src="../images/sort-down.png">
                        <img v-if="sort == field && sortOrder == 'descending'" class="sort-img" src="../images/sort-up.png">       
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="response in filteredResponses" v-bind:key="response.hash">
                    <td v-for="field in fields" v-bind:key="response.hash + '-' + field">
                        {{getData(response,field)}}
                    </td>
                </tr>
            </tbody>
        </table>
        <div id="chart-container">
            <PieChart v-bind:filteredResponses="filteredResponses"></PieChart>
        </div>
        <div id="response-count-container">
            {{'Showing ' + filteredResponses.length + ' of ' + responses.length + ' responses'}}
        </div>
        <button class="clickable" @click="exportToCSV">
            Export to CSV
        </button>
    </div>
</template>

<script>
    import requests from '../services/requests.js';
    import Chart from '../components/Chart.vue';
    import PieChart from '../components/PieChart.vue';
    
    export default {
        components: {
            Chart,
            PieChart
        },
        data() {
            return {
                responses: [],
                fields: [],
                sort: undefined,
                sortOrder: undefined,
                showingResponse: false,
                filters: [],
            }
        },
        computed: {
            filteredResponses: function () {
                let filteredResponses = this.responses;

                for (let f of this.filters)
                    filteredResponses = this.evalFilter(filteredResponses,f);

                return filteredResponses;
            }
        },
        methods: {
            evalFilter(responses,filterText) {
                filterText = filterText.toLowerCase();
                let filterSplit = filterText.split(" ");

                let columnInd = 0;
                let column = filterSplit[0];

                for (let i = 1; i < filterSplit.length; i++) {
                    if (this.fields.indexOf(column) != -1)
                        break
                    if (columnInd + 2 > filterSplit.length)
                        return responses;
                    columnInd = i;
                    column += "_" + filterSplit[columnInd];
                }
                
                let operator = filterSplit[columnInd + 1];
                let argument = filterSplit[columnInd + 2];
                
                let containsOperators = ["contains"];
                let equalsOperators = ["is"];

                if (containsOperators.indexOf(operator) != -1)
                    return responses.filter(r => ("" + this.getData(r,column)).toLowerCase().indexOf(argument) != -1);
                else if (equalsOperators.indexOf(operator) != -1)
                    return responses.filter(r => ("" + this.getData(r,column)).toLowerCase() == argument);
                else if (operator == "not")
                    return responses.filter(r => ("" + this.getData(r,column)).toLowerCase() != argument);
                else if (operator == ">")
                    return responses.filter(r => this.getData(r,column) > argument);
                else if (operator == ">=")
                    return responses.filter(r => this.getData(r,column) >= argument);
                else if (operator == "<")
                    return responses.filter(r => this.getData(r,column) < argument);
                else if (operator == "<=")
                    return responses.filter(r => this.getData(r,column) <= argument);
            },
            loadForm(formName) {
                requests.getResponses(formName,this.$store.state.user).then(
                    response => {
                        let responseText = JSON.parse(response.responseText);
                        this.responses = responseText;
                        if (this.responses.length) {
                            this.fields = ["description","due_date"].concat(Object.keys(responseText[0].fields));
                            this.setSort("due_date");
                        }
                        this.showingResponse = true;
                    }
                )
            },
            getData(response,field) {
                field = field.replace(/ /g,'_');
                if (field == "due_date")
                    return this.formatDate(response[field])
                else if (field == "description")
                    return response[field]
                else {
                    if (isNaN(parseInt(response.fields[field])))
                        return response.fields[field]
                    else
                        return parseInt(response.fields[field])
                }
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
            },
            closeResponses() {
                this.showingResponse = false;
                this.responses = undefined;
                this.field = undefined;
            },
            applyFilter() {
                let filterText = document.getElementById("filter-input").value;
                this.filters.push(filterText);
                document.getElementById("filter-input").value = "";
            },
            removeFilter(filter) {
                let filterIndex = this.filters.indexOf(filter);
                this.filters.splice(filterIndex,1);
            },
            formatDate(date) {
                let dateSplit = date.split('-');
                return dateSplit[1] + "-" + dateSplit[2] + "-" + dateSplit[0];
            },
            exportToCSV() {
                let csvString = "";
                csvString += this.fields.join(',') + "\n";
                for (let response of this.filteredResponses) {
                    csvString += response.description + ",";
                    csvString += response.due_date + ",";
                    csvString += Object.values(response.fields).join(",");
                    csvString += "\n";
                }

                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvString));
                element.setAttribute('download', 'data.csv');

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
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

    .no-responses {
        text-align: center;
    }

    .close-responses {
        text-align: right;
        font-size: 1.25rem;
    }

    #component-title, .fa-filter, #filter-input-container, #filter-tags-container {
        display: inline-block;
    }

    .fa-filter, #filter-input-container {
        margin-left: 1rem;
    }

    #filter-input-container {
        input {
            width: 20rem;
        }
    }

    .filter-tag {
        display: inline-block;
        margin: 0.75rem;
        padding: 0.5rem;
        border: 2px solid #2C666E;
        box-shadow: 1px 1px 6px 0px #0006;
        border-radius: 0.5rem;
    }

    #response-count-container {
        margin-top: 2rem;
    }

    table {
        display: inline-block;
    }

    #chart-container {
        display: inline-block;
        width: 30%;
    }
</style>