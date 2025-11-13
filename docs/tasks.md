# Tasks to implement

Our application works as set of 3 microservices in /home/e-commerce/
Use ssh statex  "cd e-commerce" to access this directory on prod server.

1. nginx-microservice is used to deploy blue/green applications via script. For example to deploy project /Users/sergiystashok/Documents/GitHub/e-commerce we need to:
    nginx-microservice/scripts/blue-green/deploy.sh e-commerce

2. database-server is PostgreSQL database which is used by application e-commerce

3. Applications are located in /Users/sergiystashok/Documents/GitHub/ (/home/e-commerce on prod. Use ssh statex "ls -la")

Please check how nginx and database are configured.

All env variables are stored within root folder for each project. Use command cat .env to see it
All logs stored under ./logs/ folder
