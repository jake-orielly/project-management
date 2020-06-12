import config from '../js/config.js';

export default {
    components: {
        'config': config
    },
    retrieveForm(inputData) {
        let bodyData = JSON.stringify(inputData);
        return this.genericRequest("/retrieve-form", "POST", bodyData)
    },
    getUserForms(user) {
        return this.genericRequest("/forms/" + user, "GET")
    },
    postForm(form) {
        let data = JSON.stringify(form);
        return this.genericRequest("/forms", "POST",data)
    },
    getInbox(user) {
        return this.genericRequest("/inbox/" + user, "GET")
    },
    getTasks(user) {
        return this.genericRequest("/tasks/" + user, "GET");
    },
    updateTask(user,task){
        let data = JSON.stringify(task);
        return this.genericRequest("/tasks/" + user, "PATCH",data);
    },
    submitResponse(form,response) {
        let data = JSON.stringify(response);
        return this.genericRequest("/responses" + "?form_title=" + form + "&user=" + "ann.perkins", "POST",data)
    },
    submitEstimate(user,hash,estimate) {
        let data = JSON.stringify({
            hash:hash,
            estimate:estimate,
            time:String(new Date())
        });
        return this.genericRequest("/inbox/" + user, "PATCH",data)
    },
    postLogin(username,password) {
        let data = JSON.stringify({"user":username,"password":password});
        return this.genericRequest("/login", "POST",data)
    },
    getResponses(form){
        return this.genericRequest("/responses/" + form, "GET")
    },
    genericRequest(url,type,body) {
        var request = new XMLHttpRequest();
        const baseUrl = "http://23.254.164.217:" + config.flaskPort();
        return new Promise(function (resolve, reject) {
            request.onreadystatechange = function() {
                if (request.readyState !== 4) return;
                
                if (request.status >= 200 && request.status < 300) {
                    resolve(request);
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
            request.open(type, baseUrl + url, true);
            request.send(body);
        });
    }
}