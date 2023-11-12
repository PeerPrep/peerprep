# Assignment 5

- Install Docker for your operating system. You can find the installation instructions [here](https://docs.docker.com/get-docker/).
- Clone the repository by running `git clone -b assignment-5 git@github.com:CS3219-AY2324S1/ay2324s1-course-assessment-g21.git`.

## Environment Variables

Note that usually these values are kept secret, but since all of these keys have been made for test environments, we are not concerned about security. We have committed the following test-env files in assignment submissions for your convenience.

- `./.env`
- `./frontend/.env`
- `./firebase-auth/service-account.json`

If you face any issues / if you have non-standard installations or config for any service, please modify these files appropriately.

- In the root folder, run `docker compose -f docker-compose.yml up -d`.

- Application should be running at [http://localhost](http://localhost).

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

### Before you start testing matching

The questions repository will be empty when you first start the application. You will need to populate it with questions before you can start matching.

To do so, you can grant yourself admin priveleges as described above, and then go to the admin portal at [http://localhost/admin/question](http://localhost/admin/question). You can then add questions to the database.
