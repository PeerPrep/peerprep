# Assignment 2

Clone the repository to your local machine: git clone -b assignment-2 git@github.com:CS3219-AY2324S1/ay2324s1-course-assessment-g21.git

## Third-party installations

- [Node.js](https://nodejs.org) v18.17.1 and an appropriate package manager (we recommend [yarn](yarnpkg.com))
- [Postgres](https://www.postgresql.org/download/) v14.9
- [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) v7.0

## Database instructions

In this assignment we use both Postgres and MongoDB. Be sure to start both database services so that they are running. The `.env` examples above have been written with the default port.

### Postgres database and user creation

Note that while MongoDB is more flexible, Postgres needs an explicit creation command for the database and the users involved before being able to access them. Once installed, use `psql` or a similar interface to access and do the following:

```sql
CREATE database peerprep;
CREATE USER peerprep WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE peerprep TO peerprep;
ALTER USER peerprep WITH SUPERUSER;
```

This gives rise to the `POSTGRES_URL=postgres://USERNAME:PASSWORD@localhost/peerprep` variable used in the user service `.env`. Replace `USERNAME` and `PASSWORD` with the appropriate values.

## Environment Variables

Note that usually these values are kept secret, but since all of these keys have been made for test environments, we are not concerned about security. We have committed the following test-env files in assignment submissions for your convenience.

- `./frontend/.env`
- `./users/.env`
- `./questions/.env`
- `./firebase-auth/service-account.json`

If you face any issues / if you have non-standard installations or config for any service, please modify these files appropriately.

## Running

Clone the repository to your local machine: `git clone -b assignment-2 git@github.com:CS3219-AY2324S1/ay2324s1-course-assessment-g21.git`

In each of the `users`, `questions` and `frontend`, start the project with any node package manager like so:

```sh
yarn install
yarn dev
```

Once you have navigated to the frontend (likely at [`http://localhost:3000/`](http://localhost:3000/)), you may start by logging in and exploring the application.
