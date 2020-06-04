## Run the following commands in terminal  
git clone --single-branch --branch development https://github.com/jake-orielly/project-management  
cd project-management\cypress_volume  
npm install  
npm install cypress  


## Edit project-management/cypress_volume/cypress.json
    "baseUrl": "http://vps:8081",
    "integrationFolder":"integration"
(whatever url you want to test against)

## Run in terminal
.\node_modules\.bin\cypress open