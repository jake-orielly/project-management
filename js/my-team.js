var app = new Vue({
    el: '#app',
    data: {
        forms: [],
<<<<<<< HEAD
        formPreview: false,
        currForm: "",
    },
    methods: {
        toggleForms(user) {
            if (this.forms.length == 0)
                this.getForms(user)
            else
                this.forms = []
        },
=======
    },
    methods: {
>>>>>>> 53e381ce67521172c2fbe9e14c6caf7bf206d7f2
        getForms(user) {
            getUserForms(user).then(
                response => {
                    let responseData = JSON.parse(response.responseText).data;
<<<<<<< HEAD
                    for (let form of responseData) {
                        this.forms.push({name:JSON.parse(form).title});
                    }
                }
            )
        },
        requestForm(formName) {
            this.currForm = formName;
            retrieveForm(formName).then(
                response => {
                    let responseText = JSON.parse(response.responseText);
                    let form = JSON.parse(responseText.data);
                    this.formTitle = form.title;
                    this.fields = form.fields;
                    this.openFormPreview()
                }
            )
        },
        submitForm() {
            let fields = document.querySelectorAll('input,select');
            let response = [];
            for (let i of fields)
                response.push(i.value);
            submitResponse(this.currForm,response);
            this.formPreview = false;
            this.currForm = "";
        },
        openFormPreview() {
            this.formPreview = true;
        },
        closeFormPreview() {
            this.formPreview = false;
        },
=======
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
>>>>>>> 53e381ce67521172c2fbe9e14c6caf7bf206d7f2
    }
})