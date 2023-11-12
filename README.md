# Assignment 4

Clone the repository to your local machine: `git clone -b assignment-4 git@github.com:CS3219-AY2324S1/ay2324s1-course-assessment-g21.git`

## Third-party installations

- [Node.js](https://nodejs.org) v18.17.1 and an appropriate package manager (we recommend [yarn](yarnpkg.com))
- [Docker](https://docs.docker.com/get-docker/)

## Environment Variables

Note that usually these values are kept secret, but since all of these keys have been made for test environments, we are not concerned about security. We have committed the following test-env files in assignment submissions for your convenience.

- `./.env`
- `./frontend/.env`
- `./firebase-auth/service-account.json`

If you face any issues / if you have non-standard installations or config for any service, please modify these files appropriately.

## Running

In the `frontend`, start the project with any node package manager like so:

```sh
yarn install
yarn dev
```

Run users and question service from root directory with the following commands:

```sh
docker compose -f docker-compose.yml up -d
```

Once you have navigated to the frontend (likely at [`http://localhost:3000/`](http://localhost:3000/)), you may start by logging in and exploring the application.

### Giving yourself admin privileges

Note that the admin portal is not accessible until you grant yourself admin privileges. You may carry out the steps here to grant yourself admin access.

:warning: Note that this step must be done only after all the services are up and you have successfully logged into the frontend using Google or Github.

Run the following commands in the terminal one after another:

```sql
docker exec -it peerprep-postgres bash
psql -U peerprep
UPDATE profiles SET role='admin';
```

This will give every user admin privileges. Note that this is only for testing purposes.
