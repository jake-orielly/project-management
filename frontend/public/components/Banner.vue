<template>
    <div id="topbar">
        <img src="../images/logo.png" id="logo-img">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/my-forms">My Forms</router-link>
        <router-link to="/my-team">My Team</router-link>
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
</style>