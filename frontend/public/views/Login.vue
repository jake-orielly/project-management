<template>
    <div id="login-container">
        <div id="login-inner">
            <p>Login</p>
            <form v-on:submit="login">    
                <input type="text" name="email" autocomplete="off" placeholder="Username" v-model="username" id="username"/><br>    
                <input type="password" name="password" autocomplete="off" placeholder="Password" v-model="password" id="password"/><br>    
                <input type="submit" value="Login" />    
            </form>
            <p :class="[(loginStatus == 'failed' ? 'error' : '')]" id="login-status-text">{{loginStatusText}}</p>
        </div>
    </div>
</template>

<script>
    import requests from '../services/requests.js';

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
            login(e) {
                e.preventDefault()
                requests.postLogin(this.username,this.password).then(
                    response => {
                        let result = JSON.parse(response.responseText).message;
                        if (result == "success") {
                            this.$store.commit("setUser",this.username)
                            this.$router.push('/dashboard')
                        }
                        else
                            this.loginStatus = "failed";
                    }
                ).catch((errors) => {    
                    this.loginStatus = "failed";
                }) 
            },
        }
    }
</script>

<style lang="scss" scoped>
    #login-container {
        text-align: center;
    }

    $primary-color: #2C666E;

    input {
        margin: 0.5em;
    }

    .error {
        color: #d91e27;
    }

    #login-inner {
        display: inline-block;
        border: 4px solid $primary-color;
        margin-top: 15%;
        border-radius: 1em;
        padding: 3em 1em 0;

        p {
            text-decoration: underline;
        }

        button {
            margin-top: 2rem;
        }
    }

    #login-container, #login-container * {
        font-size: 1.5rem;
    }

    #login-status-text {
        min-height: 1.5rem;
    }
</style>