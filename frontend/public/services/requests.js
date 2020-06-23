import config from '../js/config.js';

export default {
    components: {
        'config': config
    },
    retrieveForm(inputData,user) {
        let bodyData = JSON.stringify(inputData);
        return this.genericRequest("/retrieve-form" + "?user=" + user, "POST", bodyData)
    },
    getUserTeam(user) {
        return this.genericRequest("/team/" + user, "GET")
    },
    getUserForms(user,scope) {
        return this.genericRequest("/forms/" + user + "?scope=" + scope, "GET")
    },
    postForm(form,user) {
        let data;
        form.creator = user;
        form.responses = [];
        data = JSON.stringify(form);
        return this.genericRequest("/forms/" + user, "POST",data)
    },
    patchForm(form,user) {
        let data;
        form.creator = user;
        data = JSON.stringify(form);
        return this.genericRequest("/forms/" + user, "PATCH",data)
    },
    deleteForm(formID,user) {
        let data = JSON.stringify({ id:formID });
        return this.genericRequest("/forms/" + user, "DELETE",data)
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
    assignTask(userFrom,userTo,task,time){
        let data = JSON.stringify({
            userFrom:userFrom,
            userTo:userTo,
            task:task,
            time:time
        });
        return this.genericRequest("/inbox", "PUT",data);
    },
    getResponses(form,user){
        return this.genericRequest("/responses" + "?form_title=" + form + "&user=" + user, "GET")
    },
    submitResponse(form,user,response) {
        let data = JSON.stringify(response);
        return this.genericRequest("/responses" + "?form_title=" + form + "&user=" + user, "POST",data)
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
    },
    returnTask(user,hash,comment) {
        console.log(user,hash,comment)
    }
}