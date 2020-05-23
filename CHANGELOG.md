# Changelog
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
  * added basic and bearer auth express middleware
  * filled out User models auth functionality
  * added auth routes
  * added better User model unit tests
  * added auth route integration tests
* 0.1.5 -- task model
  * added mock-user and mock-test for use in testing  
  * added mock-util for cleaning up the DB
  * db module now implents lists using hash maps
  * all tests were refactored to use the new mocking modules
  * the task model has full crud
  * the task model has been unit tested

## Todo Roadmap
* 0.1.6 -- task routes
* 0.1.7 -- randtask routes
* 0.1.8 -- error routes
* 0.1.9 -- refactor
* 0.1.10 -- dockerize
* 0.1.11 -- continuous deployment
* 1.0.0 -- GET JOB

## GOALS
### REQUIREMENTS
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
### DEV OPS
* Deploy the application on AWS or GCP, or Azure
* Make the app buildable as a container
* Make a Docker Compose file for the app
* Write a basic helm chart to deploy the app in Kubernetes (if you do this, you can skip the previous task)
* How would you handle the storage of secrets in the deployment process?

###FULL-STACK CHALLENGES
* Use React to build the web client
* Store the application state in redux
* Use redux-saga
* Have a theme and use JSS in each component
* If client is offline, store the sent tasks and send them once online



