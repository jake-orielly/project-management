<template>
    <div id="topbar">
        <img src="../images/logo.svg" id="logo-img">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/my-forms">My Forms</router-link>
        <router-link to="/team-workload">Team Workload</router-link>
        <router-link to="/team-management">Team Management</router-link>
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

<style lang="scss" scoped>
    a {
        color: black;
        margin: 1rem;
        display: inline-block;
    }

    #logo-img {
        float: left;
        margin-right: 2em;
        padding: 5px;
    }

    #topbar {
        padding: 0.5rem;
        margin-bottom: 1rem;
    }

    #topbar p {
        display: inline-block;
        margin-top: 1em;
        margin-right: 2rem;
        margin-bottom: 0.5em;
        text-decoration: underline;
    }

</style>