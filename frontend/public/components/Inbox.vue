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
            <p v-for="field in Object.keys(estimating.fields).filter(field => field != 'form_title')" v-bind:key="field">
                {{fromLabel(field) + ': ' + estimating.fields[field]}}
            </p>
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
                        this.estimating.description,
                        'Leslie Knope',
                        new Date(this.estimating.form.due_date),
                        document.getElementById("estimate-input").value
                    ),
                )
                this.$parent.inbox.splice(this.$parent.inbox.indexOf(this.estimating),1);
                this.estimating = undefined;
                this.$parent.updateWorkload();
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