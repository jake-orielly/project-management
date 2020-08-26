<template>
    <div id="topbar">
        <img src="../images/logo.svg" id="logo-img">
        <router-link to="/dashboard" :class="{'active': active == 'dashboard'}">Dashboard</router-link>
        <router-link to="/my-forms" :class="{'active': active == 'my-forms'}">My Forms</router-link>
        <router-link to="/team-workload" :class="{'active': active == 'team-workload'}">Team Workload</router-link>
        <router-link to="/team-management" :class="{'active': active == 'team-management'}">Team Management</router-link>
        <img src="../images/avatar.png" id="avatar-img">
        <p id="user-name">{{$store.state.user}}</p>
    </div>
</template>

<script>
    export default {
        props: {
            active: {
                type: String,
                required: true
            },
        },
        methods: {
            setTab: function(newTab) {
                this.$parent.currTab = newTab;
            },
        }
    }
</script>

<style lang="scss" scoped>
    a {
        font-size: 1.15rem;
        color: #313638;
        margin: 1rem;
        display: inline-block;
        text-decoration: none;
        padding: 1rem;
        box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.25);
    }

    #logo-img, #avatar-img {
        height: 3rem;
    }

    #user-name, #avatar-img {
        float: right;
    }

    #topbar #user-name {
        font-size: 1.15rem;
        text-decoration: none;
        margin-right: 1rem;
    }

    #logo-img {
        float: left;
        margin-right: 2em;
        padding: 5px;
        height: 2.5rem;
        padding: 0.75rem;
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

    .active {
        font-weight: bold;
        color: #445E93;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
</style>