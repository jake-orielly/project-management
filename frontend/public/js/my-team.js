var app = new Vue({
    el: '#app',
    data: {
        forms: [],
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
        getForms(user) {
            getUserForms(user).then(
                response => {
                    let responseData = JSON.parse(response.responseText).data;
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
            let response = {};
            for (let i of fields) {
                response[i.dataset.label] = i.value;
            }
            console.log(response)
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
        toLabel(s) {
            return s.replace(/ /g,'_').toLowerCase();
        }
    }
})