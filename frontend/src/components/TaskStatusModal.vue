<template>
    <div id="modal-container" v-if="showing">
        <div id="task-status-modal">
            <div 
                class="close-icon-container" 
                @click="closeModal"
            >
                <i class="fa fa-times clickable"></i>
            </div>
            <p id="status-text">
                {{'Set task to ' + status.toLowerCase() + '?'}}
            </p>
            <p id="comment-text">
                Add a comment
            </p>
            <textarea id="comment-content"></textarea>
            <p>
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
                showing: false,
                task: undefined,
                status: undefined
            }
        },
        methods: {
           confirm() {
                let comment = document.getElementById("comment-content").value;
                let event = {
                    event:"Status set to " + this.status,
                    user:this.$store.state.user,
                    time:String(new Date())
                }

                if (comment)
                    event.comment = comment;

                this.task.status = status;
                requests.updateTask(this.$store.state.user,this.task).then(
                    () => {
                        this.$parent.$refs.taskList.updateTaskList();
                    }
                );
                this.closeModal();
           },
           show(task,status) {
               this.$parent.modalTint = true;
               this.showing = true;
               this.task = task;
               this.status = status;
           },
           closeModal() {
               this.$parent.modalTint = false;
               this.showing = false;
           }
        }
    }
</script>

<style lang="scss" scoped>
    #modal-container {
        position: absolute;
        width: 100%;
        text-align: center;
        top: 20%;
        z-index: 3;
    }

    #task-status-modal {
        display: inline-block;
        background-color: white;
        padding: 1rem 2rem;
        border: 3px solid #2C666E;
        border-radius: 1em;
    }

    .close-icon-container {
        font-size: 1.5rem;
        text-align: right;
        color: #2C666E;
    }

    #status-text {
        font-size: 1.25rem;
    }

    #comment-text {
        text-align: left;
    }
</style>