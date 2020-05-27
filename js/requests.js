<<<<<<< HEAD
function retrieveForm(formName) {
	let data = JSON.stringify({title:formName});
    return genericRequest("http://vps:5000/retrieve-form", "POST", data)
}

function getUserForms(user) {
    return genericRequest("http://vps:5000/forms/" + user, "GET")
}

function postLogin(username,password) {
	let data = JSON.stringify({"user":username,"password":password});
	return genericRequest("http://vps:5000/login", "POST",data)
}

function postForm(form) {
	let data = JSON.stringify(form);
	return genericRequest("http://vps:5000/forms", "POST",data)
}

function submitResponse(form,response) {
	let data = JSON.stringify(response);
	return genericRequest("http://vps:5000/responses/" + form, "POST",data)
}

function getResponses(form){
	return genericRequest("http://vps:5000/responses/" + form, "GET")
}
=======
function getForm(form) {
    return genericRequest("http://vps:5000/get-form/" + form, "GET")
}

function getUserForms(user) {
    return genericRequest("http://vps:5000/get-user-forms/" + user, "GET")
}

function login(username,password) {
	return genericRequest("http://vps:5000/login", "POST",
		{
			"user":username,
			"password":password
		}
	)
}

>>>>>>> 53e381ce67521172c2fbe9e14c6caf7bf206d7f2

function genericRequest(url,type,body) {
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