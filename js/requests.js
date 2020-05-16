function getForm(form) {
    return genericRequest("http://vps:5000/get-form/" + form)
}

function getUserForms(user) {
    return genericRequest("http://vps:5000/get-user-forms/" + user)
}

function genericRequest(url) {
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
        request.open("GET", url, true);
        request.send();
	});
}