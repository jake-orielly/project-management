/*
function retrieveForm(formName) {
	let data = JSON.stringify({title:formName});
    return genericRequest(baseURL + "/retrieve-form", "POST", data)
}

function getUserForms(user) {
    return genericRequest(baseURL + "/forms/" + user, "GET")
}

function postForm(form) {
	let data = JSON.stringify(form);
	return genericRequest(baseURL + "/forms", "POST",data)
}

function submitResponse(form,response) {
	let data = JSON.stringify(response);
	return genericRequest(baseURL + "/responses/" + form, "POST",data)
}

function getResponses(form){
	return genericRequest(baseURL + "/responses/" + form, "GET")
}
*/

import config from '../js/requests.js';

export default {
    components: {
        config
    },
    data () {
        return {
            baseURL: "http://23.254.164.217:5001"
        }
    },
    postLogin(username,password) {
        let data = JSON.stringify({"user":username,"password":password});
        return this.genericRequest(this.baseURL + "/login", "POST",data)
    },
    genericRequest(url,type,body) {
        var request = new XMLHttpRequest();
    
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
            request.open(type, url, true);
            request.send(body);
        });
    }
}