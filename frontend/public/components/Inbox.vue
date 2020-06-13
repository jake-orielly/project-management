<template>
    <div id="inbox">
        <div v-if="estimating == undefined">
            <p class="title">Inbox</p>
            <ul>
                <li v-for="item in $parent.inbox" v-bind:key="$parent.inbox.indexOf(item)">
                    <div class="dashboard-card">
                        <p @click="openInboxItem(item)">{{item.description}}: {{item.title}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div id="estimate-container" v-if="estimating != undefined">
            <p>{{estimating.description}}</p>
            <p v-for="field in Object.keys(estimating.fields.fields)" v-bind:key="field">
                {{fromLabel(field) + ': ' + estimating.fields.fields[field]}}
            </p>
            <p><input type="number" id="estimate-input"></p>
            <button @click="submitEstimate">Submit</button>
        </div>
    </div>
</template>

<script>
    import requests from '../services/requests.js';

    export default {
        data() {
            return {
                estimating: undefined,
            }
        },
        methods: {
            openInboxItem(item) {
                this.estimating = item;
            },
            submitEstimate() {
                let estimateVal = document.getElementById("estimate-input").value;
                requests.submitEstimate(this.$store.state.user,this.estimating.fields.hash,estimateVal).then(
                    () => {
                        this.estimating = undefined;
                        this.$parent.updateInbox();
                        this.$parent.$refs.taskList.updateTaskList();
                })
            },
            fromLabel(s) {
                s = s.replace(/_/g,' ')
                s = s.split(' ');
                for (let i = 0; i < s.length; i++)
                    s[i] = s[i].substr(0,1).toUpperCase() + s[i].substr(1)
                return s.join(' ');
            }
        }
    }
</script>