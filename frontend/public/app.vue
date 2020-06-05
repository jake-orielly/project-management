<template>
    <div id="app">
        <div id="login-container">
            <p>Login</p>
            <input type="text" autocomplete="off" placeholder="Username" id="username">
            <br>
            <input type="password" autocomplete="off" placeholder="Password" id="password">
            <br>
            <button @click="login">Log In</button>
            <p :class="[(loginStatus == 'failed' ? 'error' : '')]" id="login-status-text">{{loginStatusText}}</p>
        </div>
    </div>
</template>

<script src="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet"></script>
<script type="text/javascript" src="./js/config.js"></script>

<script>
    import './css/style.css'
    import './css/login.css'
    import requests from './services/requests.js';
    export default {
        data () {
            return {
                loginStatus: "",
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
                let username = document.getElementById("username").value;
                let password = document.getElementById("password").value;

                requests.postLogin(username,password).then(
                    response => {
                        let result = JSON.parse(response.responseText).message;
                        console.log(result)
                        if (result == "success") {
                            if (username == "ann.perkins")
                                window.location.href = "./dashboard.html";
                            else if (username == "leslie.knope")
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