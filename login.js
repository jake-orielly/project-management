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

            if (username == "ann.perkins" && password == "opendoor4")
                window.location.href = "./dashboard.html";
            else
                this.loginStatus = "failed";
        },
    }
})