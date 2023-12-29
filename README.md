# BdFrontend

This project was created with Express backend application framework

## Setting up the Development server

Make sure to create a user to access the database accordingly.
`CREATE USER '<username>'@'%' IDENTIFIED BY '<password>';`
`GRANT ALL ON <username>.* TO '<username>'@'%';`
`ALTER USER '<username>'@'%' IDENTIFIED WITH mysql_native_password BY '<password>';`

Make sure to provide the database server's credentials and IP address in the index.js file at line 7.

## Deploying the Development server

Run `npm init` and then `npm install --save-exact express@4.17.1 cors@2.8.5 mysql@2.18.1` for installing the required dependencies.
For the dev server, navigate to `.\src\index.js` and run `node --watch ".\src\index.js"`. 
The backend application will automatically reload if you change any of the source files.

The APIs can be accessed at the URL "http://localhost:8080/<API_Path>".
