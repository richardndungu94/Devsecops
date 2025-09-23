# Vulnerable-auth-API
Intentionally-insecure-auth-api
** Disclaimer**: This API is insecure do not use it.It  contains vulnerabilities for cyber security research.
## Vulnerabilities Include
-No input validation
-Sensitive data exposure
-Error leak- Returns rack backend error
-Insecure Direct Object Reference(IDOR)
-Hardcoded and exposed credentials
-Weak passwords

## Tech stack

```
-Node.js
-Mongo
-Docker support-
```
## Learn
user POSTMAN to test the the API in the local environment
Test other vulnerabilities
Edit the code to get more vulns

## How to run
Run the docker image in docker containers
```docker compose up --build```
Run on VS code
```node app.js ```

## The project
This project will help you get to interact with real vulnerable API.
The project contains a source code of an authentication API commented in blocks to allow us have a vulnerable API.

## POSTMAN Link

-[ ] .[link](https://documenter.getpostman.com/view/45175938/2sB3B7Mt8x)

## Postman Images
The images below shows what the API returns

Register

![Alt text](images/register.png)


Login 
![Alt text](images/login.png)



Profile

![Alt text](images/get.png)



