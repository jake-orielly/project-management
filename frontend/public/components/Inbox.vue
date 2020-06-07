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
            <p class="title">Estimate Task</p>
            <p>{{estimating.response.description}}</p>
            <p><input type="number" id="estimate-input"></p>
            <button @click="submitEstimate">Submit</button>
        </div>
    </div>
</template>

<script>
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
                this.$parent.taskList.push(
                    new InboxItem
                    (
                        this.estimating.response.description,
                        'Leslie Knope',
                        new Date(this.estimating.response.due_date),
                        document.getElementById("estimate-input").value
                    ),
                )
                this.$parent.inbox.splice(this.$parent.inbox.indexOf(this.estimating),1);
                this.estimating = undefined;
                this.$parent.updateWorkload();
            },
        }
    }

class InboxItem {
    constructor(description,from,due,estimate) {
        this.description = description;
        this.from = from;
        this.due = due;
        this.estimate = estimate;
        this.danger = false;
    }
}
</script>