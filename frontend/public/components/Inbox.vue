<template>
    <div id="inbox" :class="{'focused':viewing}">
        <div id="tab-container">
            <p v-for="tab in tabs" v-bind:key="tab" @click="setTab(tab)" class="clickable">
                {{tab}}
                <span v-if="inbox(tab).length" class="tab-badge">
                    {{inbox(tab).length}}
                </span>
            </p>
        </div>
        <div id="inbox-inner" v-if="viewing == undefined">
            <table v-if="inbox(currTab).length" id="inbox-table">
                <tbody>
                    <tr>
                        <th v-for="header in Object.keys(cols)" v-bind:key="header" @click="changeSort(header)" class="clickable">
                            {{header}}
                            <font-awesome-icon v-if="sortBy == header && sortOrder == 'descending'" icon="caret-down"/>
                            <font-awesome-icon v-if="sortBy == header && sortOrder == 'ascending'" icon="caret-up"/>
                        </th>
                    </tr>
                    <tr v-for="item in inbox(currTab)" v-bind:key="inbox(currTab).indexOf(item)" @click="openInboxItem(item)">
                        <td v-for="col in Object.values(cols)" v-bind:key="col">
                            {{item[col]}}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!inbox(currTab).length">
                No {{currTab.toLowerCase()}} items
            </p>
        </div>
        <div id="estimate-container" v-if="viewing != undefined">
            <TaskFocus v-bind:task="viewing" ref="taskFocus"></TaskFocus>
        </div>
    </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import TaskFocus from '../components/TaskFocus.vue';

    export default {
        components: {
            FontAwesomeIcon,
            TaskFocus
        },
        data() {
            return {
                viewing: undefined,
                tabs: ["New","In Progress","Blocked","Complete"],
                cols: {
                    "Project":"title",
                    "Task":"description",
                    "Requester":"from",
                    "Due Date":"due_date"
                },
                sortBy:"Project",
                sortOrder:"descending",
                currTab: "New"
            }
        },
        methods: {
            inbox: function(status) {
                let sorted = this.$parent.taskList.concat()
                let app = this;
                sorted = sorted.filter(item => item.fields.status == status);
                sorted.sort(function(a, b) {
                    let val = (app.sortOrder == "ascending" ? -1 : 1);
                    let key = app.cols[app.sortBy];

                    if (a[key] > b[key])
                        return 1 * val;
                    if (b[key] > a[key])
                        return -1 * val;
                    else
                        return 0;
                });
                return sorted;
            },
            openInboxItem(item) {
                this.viewing = item;
            },
            changeSort(header){
                if (header == this.sortBy)
                    this.sortOrder = (this.sortOrder == 'ascending' ? 'descending' : 'ascending') 
                else 
                    this.sortBy = header;
            },
            setTab(tab) {
                this.currTab = tab;
                if (this.$refs.taskFocus)
                    this.$refs.taskFocus.closeView();
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../scss/_variables.scss";

    #inbox-inner {
        border: 3px solid $buzz-blue;
        border-radius: 1em;
        padding: 3rem;
    }

    #inbox.focused {
        position: absolute;
        background: white;
        z-index: 100;
        width: 90%;
        height: 90%;
    }

    #tab-container {
        margin: 0;

        p {
            display: inline-block;
            padding: 0.75rem 3rem;;
            margin: 0;
            border-radius: 1rem 1rem 0px 0px;
        }

        p:first-child {
            background: $buzz-grey;
            margin-left: 1rem;
            font-weight: bold;
            color: #445E93;
            text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        }
        p:nth-child(2){
            background: $buzz-light-yellow;
        }
        p:nth-child(3){
            background: $buzz-light-orange;
        }
        p:nth-child(4){
            background: $buzz-light-teal;
        }
    }

    #inbox-table {
        border-collapse: collapse;
        width: 100%;
    }

    #inbox-table td, #inbox-table th {
        border: 1px solid $buzz-grey;
        padding: 8px;
    }

    #inbox-table tr:nth-child(odd){
        background-color: #f2f2f2;
    }

    #inbox-table tr:hover {
        background-color: #ddd;
    }

    #inbox-table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: $buzz-light-grey;
    }

    .tab-badge {
        display: inline-block;
        background: #445E93;
        color: #FFFFFF;
        font-weight: 400;
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 0.75rem;
        text-align: center;

        &.hidden {
            background: none;
            color: transparent;
        }
    }
</style>