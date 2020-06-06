<template>
    <div id="topbar">
        <img src="../images/logo.png" id="logo-img">
        <p class="clickable" @click="setTab('dashboard')">Dashboard</p>
        <p class="clickable" @click="setTab('myForms')">My Forms</p>
        <img src="../images/avatar.png" id="avatar-img">
        <p id="user-name">Ann Perkins</p>
    </div>
</template>

<script>
    export default {
        data () {
           
        },
        methods: {
            setTab: function(newTab) {
                this.$parent.currTab = newTab;
            },
        }
    }
</script>