# Assignment 3

Key skills:

- Authentication state management with JWT/session tokens
- Using OAuth or such 3rd party authorization protocol/services.

In this assignment we have utilised Firebase's authentication-as-a-service and integrated with GitHub and Google OAuth protocols. Our users will have a seamless, permissioned access with session management.

Clone the repository to your local machine: `git clone -b assignment-3 git@github.com:CS3219-AY2324S1/ay2324s1-course-assessment-g21.git`

## Third-party installations

- [Node.js](https://nodejs.org) v18.17.1 and an appropriate package manager (we recommend [yarn](yarnpkg.com))
- [Postgres](https://www.postgresql.org/download/) v14.9
- [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) v7.0

We also recommend [Postman](https://www.postman.com/) for easy access to the backend, but you may use any means you wish to test the backend. Be sure to extract the firebase token from your `auth` headers in the frontend before attempting this. This can be done by looking at the `firebase-token` header in the network tab of your browser's developer tools. You may then use this token in Postman to check if a normal user can access the admin routes in the backend.

## Database instructions

In this assignment we use both Postgres and MongoDB. Be sure to start both database services so that they are running. The `.env` examples above have been written with the default port.

### MongoDB database

The MongoDB collections is created automatically when the application is run.

:warning: Please ensure that your local MongoDB does not have a collection named `questions` before running the application.

### Postgres database and user creation

:warning: Please ensure that your local Postgres does not have a database named `peerprep` before running the application.

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

In each of the `users`, `questions` and `frontend`, start the project with any node package manager like so:

```sh
yarn install
yarn dev
```

Once you have navigated to the frontend (likely at [`http://localhost:3000/`](http://localhost:3000/)), you may start by logging in and exploring the application.

### Giving yourself admin privileges

Note that the admin portal is not accessible until you grant yourself admin privileges. You may carry out the steps here to grant yourself admin access.

:warning: Note that this step must be done only after all the services are up and you have successfully logged into the frontend using Google or Github.

```sh
# Password is the one you set in the CREATE USER command above
psql -U peerprep
```

```sql
-- Get your UID and promote yourself to an admin
SELECT * from profiles;
UPDATE profiles SET role='admin' WHERE uid='YOUR_UID';

-- Or promote all users to admins:
UPDATE profiles SET role='admin';
```
