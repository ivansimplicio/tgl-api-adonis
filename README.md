# tgl-api-adonis
## step by step to run the project

1) To install all dependencies, run: `npm install`
2) Before running the project you will need to create two networks in Docker: `docker network create tgl` & `docker network create tgl-api`
3) And also set the environment variables in the `.env` file
4) To run the test scripts just run: `npm test`
5) To upload and run the MySQL application and database on Docker: `docker-compose up`
6) After running the previous command, it will also be necessary to run the migrations and seeders: `npm run startdb`
7) And to run the scheduler, run: `npm run scheduler`
8) Finally, to have access to all the endpoints available in the API, just download the file located at `_data/workspace-tgl-api-adonis.json` and import it into Insomnia.
