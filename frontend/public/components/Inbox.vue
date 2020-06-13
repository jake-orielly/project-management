<template>
    <div id="inbox">
        <div v-if="viewing == undefined">
            <p class="title">Inbox</p>
            <ul>
                <li v-for="item in $parent.inbox" v-bind:key="$parent.inbox.indexOf(item)">
                    <div class="dashboard-card">
                        <p @click="openInboxItem(item)">{{item.description}}: {{item.title}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div id="estimate-container" v-if="viewing != undefined">
            <p>{{viewing.description}}</p>
            <p v-for="field in Object.keys(viewing.fields.fields)" v-bind:key="field">
                {{fromLabel(field) + ': ' + viewing.fields.fields[field]}}
            </p>
            <button @click="setMode('assign')">Re-Assign</button>
            <button @click="setMode('estimate')">Estimate</button>
            <div v-if="mode == 'estimate'">
                <p><input type="number" id="estimate-input"></p>
            </div>
            <p v-if="mode">
                <button @click="confirm">Confirm</button>
            </p>
        </div>
    </div>
</template>

<script>
    import requests from '../services/requests.js';

    export default {
        data() {
            return {
                viewing: undefined,
                mode: undefined
            }
        },
        methods: {
            openInboxItem(item) {
                this.viewing = item;
            },
            setMode(mode) {
                this.mode = mode;
            },
            confirm() {
                let estimateVal = document.getElementById("estimate-input").value;
                requests.submitEstimate(this.$store.state.user,this.viewing.fields.hash,estimateVal).then(
                    () => {
                        this.closeView();
                })
            },
            closeView() {
                this.viewing = undefined;
                this.$parent.updateInbox();
                this.$parent.$refs.taskList.updateTaskList();
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