<template>
    <div id="topbar">
        <img src="../images/logo.png" id="logo-img">
        <p class="clickable" @click="setTab('dashboard')">Dashboard</p>
        <p class="clickable" @click="setTab('myForms')">My Forms</p>
        <p class="clickable" @click="setTab('myTeam')">My Team</p>
        <img src="../images/avatar.png" id="avatar-img">
        <p id="user-name">{{$store.state.user}}</p>
    </div>
</template>

<script>
    export default {
        methods: {
            setTab: function(newTab) {
                this.$parent.currTab = newTab;
            },
        }
    }
</script>