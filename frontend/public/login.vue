<template>
    <div id="login-container">
        <p>Login</p>
        <input type="text" autocomplete="off" placeholder="Username" v-model="username" id="username">
        <br>
        <input type="password" autocomplete="off" placeholder="Password" v-model="password" id="password">
        <br>
        <button @click="login">Log In</button>
        <p :class="[(loginStatus == 'failed' ? 'error' : '')]" id="login-status-text">{{loginStatusText}}</p>
    </div>
</template>

<script>
    import './css/login.css'
    import requests from './services/requests.js';
    export default {
        data () {
            return {
                loginStatus: "",
                username:"",
                password:""
            }
        },
        computed: {
            loginStatusText() {
                let statusMap = {
                    "failed":"Incorrect login credentials."
                };
                return statusMap[this.loginStatus];
            }
        },
        methods: {
            login() {
                requests.postLogin(this.username,this.password).then(
                    response => {
                        let result = JSON.parse(response.responseText).message;
                        if (result == "success") {
                            if (this.username == "ann.perkins")
                                window.location.href = "./dashboard.html";
                            else if (this.username == "leslie.knope")
                                window.location.href = "./my-team.html";
                        }
                        else
                            this.loginStatus = "failed";
                    }
                )
            },
        }
    }
</script>