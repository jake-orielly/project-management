var app = new Vue({
    el: '#app',
    data: {
        loginStatus: "",
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

            postLogin(username,password).then(
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
})