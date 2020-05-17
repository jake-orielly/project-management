var app = new Vue({
    el: '#app',
    data: {
        forms: [],
    },
    methods: {
        getForms(user) {
            getUserForms(user).then(
                response => {
                    let responseData = JSON.parse(response.responseText).data;
                    let reponseForms = JSON.parse(responseData);
                    for (let formName in reponseForms)
                        this.forms.push({name:formName,formId:reponseForms[formName]});
                }
            )
        },
        requestForm(formId) {
            getForm(formId).then(
                response => {
                    console.log(response);
                }
            )
        }
    }
})