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