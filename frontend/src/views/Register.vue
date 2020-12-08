<template>
    <div id="login-container">
        <div id="login-inner">
            <form v-on:submit="registerUser">    
                <input type="text" name="email" autocomplete="off" placeholder="Username" v-model="username" id="username"/><br>    
                <input type="password" name="password" autocomplete="off" placeholder="Password" v-model="password" id="password"/><br>    
                <input type="submit" value="Sign Up" />    
            </form>
            <p :class="[(registrationStatus == 'failed' ? 'error' : '')]" id="registration-status-text">{{registrationStatusText}}</p>
        </div>
    </div>
</template>

<script>
    import requests from '../services/requests.js';

    export default {
        data () {
            return {
                registrationStatus: "",
                username:"",
                password:""
            }
        },
        computed: {
            registrationStatusText() {
                let statusMap = {
                    "failed":"That username is taken."
                };
                return statusMap[this.registrationStatus];
            }
        },
        methods: {
            registerUser(e) {
                e.preventDefault()
                requests.register(this.username,this.password).then(
                    response => {
                        let result = JSON.parse(response.responseText);
                        if (result == "User created") {
                            this.$store.commit("setUser",this.username)
                            this.$router.push('/dashboard')
                        }
                        else
                            this.registrationStatus = "failed";
                    }
                ).catch(() => {    
                    this.registrationStatus = "failed";
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

    #registration-status-text {
        min-height: 1.5rem;
    }

    .sign-up-link {
        color: #2C666E;
    }
</style>