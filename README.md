TASK-O-MATIC API
===
[![Build Status](https://travis-ci.org/slugbyte/taskomatic-api.svg?branch=master)](https://travis-ci.org/slugbyte/taskomatic-api)

A proof of concept task mangment API.

## SECURITY CONCERNS
Unless this application is protected with an HTTPS connection the requests and responses are subject to man in the middle attacks and snooping.
In production the application should be deployed behind an HTTPS-Proxy server to prevent misuse.

## DEVELOPMENAT SETUP
### Access the source
Run the following commands.
1. `git clone https://github.com/slugbyte/taskomatic-api.git` will download the source
1. `npm install` will install the depependent node modules.
### Setup extenral dependencies 
* Redis server

### Configure the enviroment
* Create a `.env` file in the root directory of this repo based on the following example file.

``` bash
PORT=3000
API_URL='http://localhost:3000'
CORS_ORIGIN='localhost,https://taskomatic.slugbyte.com' # comma seporated list
APP_SECRET='THIS IS PRIVATE KEY USED TO ENCRYPT AUTHENTICATION TOKENS' # In production should use a RSA-KEY
REDIS_URI=""
DEBUG='app:*' # turn on dev logging
```

### Run the development test
The following commands will execute the test suite.
* `npm run test` -- this command will run the test-suit one time.
* `npm run test-watch` -- this command will efictavly continuly  watch for changes to the files in this repo, and automaticly re-run the test-suit after any change.

### Start the server
Run the following command to boot the server.
* `npm run start` -- this command will boot the server.

## MODELS
Below are descriptions of the taskomatic data models.

### USER
Below is a list of the User-Model properties, along with their descriptions.  
* `id`
* `email`
* `username`
* `firstName`
* `lastName`
* `passwordHash`
* `authenticationTokenSeed`

### TASK
Below is a list of the Task-Model properties, along with their descriptions.  
* `id`
* `listID`
* `userID`
* `description`
* `completed`
* `timestamp`

## API Interface 
The Taskomatic API implaments a REST interface. Each endpoint allows an http-client to create, read, update, and delete (CRUD) a model using HTTP the appropiate HTTP methods. 

## AUTH
The `/auth` endpoint is used to manage the CRUD opperations of user model, as well as generate authentiation tokens.

### POST /auth
Create a user and recieve an authentication token.
#### Requirements
* Make a HTTP POST request to `/auth` 
* Set the HTTP header `Content-Type` to `application/json`
* Attach JSON to the body of the request with the following data.
``` json
{
  "email": "example@example.com",
  "username": "example_user",
  "firstName": "Nancy",
  "lastName": "Doe",
  "password": "password1234"
}
```

#### Response
The server will return a json object that contains an authentication token, that can be used to make task requests.
``` json
{
  "authToken": "ZXhhbXBsZSB0b2tlbiBleGFtcGxlIHRva2VuIGV4YW1wbGUgdG9rZW4K",
}
```

### GET /auth
Retrieve an authentication token for an existing user. 
#### Requirements
#### Response

### UPDATE /auth
Update a users credientials.
#### Requirements
#### Response

### DELETE /auth
Delete a user and all of their content.
#### Requirements
#### Response


## TASK 
The `task` endpoint is used to manage the CRUD opperations of the task model.
### POST /task
#### Requirements
#### Response

### GET /task
#### Requirements
#### Response

### GET /task/:id
#### Requirements
#### Response

### UPDATE /task/:id
#### Requirements
#### Response

### DELETE /task/:id
#### Requirements
#### Response

## RANDOM TASK
The `/randtask` endpoint is used to manage the CRUD opperations of the task model, with the added side-effect that it will automaticly be marked as completed after a random interval within 10 seconds.
### POST /randtask
#### Requirements
#### Response

### GET /randtask
#### Requirements
#### Response

### GET /randtask/:id
#### Requirements
#### Response

### UPDATE /randtask/:id
#### Requirements
#### Response

### DELETE /randtask/:id
#### Requirements
#### Response

## Changelog
* 0.1.0 -- init repo
  * added boilerplate files (LISCENSE GITIGNORE PACKAGE.JSON README)
* 0.1.1 -- mvp express server
  * created an express server module
    * added morgan for request logging 
    * added cors functionality
    * added an app wide router and a helloworld route
    * added the ability to start and stop the server
    * all secertes and boot options are configured with ENV vars
  * created an init script to boot the server
  * wrote a few basic integration tests to verify server is working
  * added travisCI to the repo, test checks are now integrated into pull requests
* 0.1.2 -- connect redis
  * created a db client wrapper lib
    * has the ability to start and stop the db client 
    * has promisifyed db request methods
  * added redis to the travis config
  * converted the init script to an executable script
* 0.1.3 -- user model
  * created a user constructor
  * added bcrypt password hashing and compare functionaly
  * created a static createUser factory function to mange the following 
    1. validate input
    2. asyncronously hash password
    3. instanciate a user model
    4. validate user model
    5. store user model in db
  * refactored the db module
    * added methods for working with items
    * added methods for working with lists
    * better validation
    * curry magic to remove duplicate code :)
    * added db module unit tests
* 0.1.4 -- auth routes
  * Added Noe's challenges to readme
  * added a hmac helper module
  * added basic and bearer auth express midleware
  * filled out User models auth functionality
  * added auth routes
  * added better User model unit tests
  * added auth route integration tests

## Todo Roadmap
* 0.1.5 -- task model
* 0.1.6 -- task routes
* 0.1.7 -- randtask routes
* 0.1.8 -- error routes
* 0.1.9 -- refactor
* 0.1.10 -- dockerize
* 0.1.11 -- continuous depoyment
* 1.0.0 -- GET JOB

## GOALS
* REQUIREMENTS
  * Build a task management API.
  * A user is able to submit a task through an endpoint.
  * The backend will consume the task (a random timer delay).
  * Through another endpoint, the user can check the status of the task.
* CHALLENGES
  * ? A task is first created as draft with a 24h life time, it needs to be confirmed to be added to the task queue.
  * ? Use Redis for the previous challenge
  * Assign a creator to each task. Have one endpoint to create a user (name/email), and one to get all the tasks for a given email
  * Once a task has been consumed, notify its creator by email
  * Create an authentication procedure between the client and the server using a HMAC signature
    * TODO: make middleware that will add a HMAC header using the users Auth token, so they can decyrpt the token in the browser to verify
  * --Make the backend in Typescript--
* DEV OPS
  * Deploy the application on AWS or GCP, or Azure
  * Make the app buildable as a container
  * Make a Docker Compose file for the app
  * Write a basic helm chart to deploy the app in Kubernetes (if you do this, you can skip the previous task)
  * How would you handle the storage of secrets in the deployment process?
* FULL-STACK CHALLENGES
  * Use React to build the web client
  * Store the application state in redux
  * Use redux-saga
  * Have a theme and use JSS in each component
  * If client is offline, store the sent tasks and send them once online




