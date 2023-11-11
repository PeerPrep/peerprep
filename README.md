# Assignment 3

Key skills:

- Authentication state management with JWT/session tokens
- Using OAuth or such 3rd party authorization protocol/services.

In this assignment we have utilised Firebase's authentication-as-a-service and integrated with GitHub and Google OAuth protocols. Our users will have a seamless, permissioned access with session management.

## Third-party installations

- [Node.js](https://nodejs.org)
- [Postgres](https://www.postgresql.org/download/)
- [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)

These steps have been tested out with Postgres 14.9 and MongoDB Community 7.0, but other version should work too.

We strongly recommend upgrading your Node or using `nvm` to have the latest LTS version (Node 18) for evaluating this assignment. We have encountered errors with other versions.

We also recommend [Postman](https://www.postman.com/) for easy access to the backend, but you may use any means you wish to test the backend. Be sure to extract the firebase token from your `auth` headers in the frontend before attempting this.

## Environment Variables

Note that usually these values are kept secret, but since all of these keys have been made to create a test environment, we are not concerned about security. Create the appropriate files as directed:

### `./frontend/.env`

```sh
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAMiTV5yv2D-gvCy2TNEFREZIMUJ3SnYD8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=peerprep-test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=peerprep-test
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=peerprep-test.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=655590321803
NEXT_PUBLIC_FIREBASE_APP_ID=1:655590321803:web:293756d86132bdafddae8e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXSP3K70CN
NEXT_PUBLIC_QUESTIONS_API_URL=http://localhost:4000/api/v1/questions
NEXT_PUBLIC_USERS_API_URL=http://localhost:6969/api/v1/users
```

Note that usually these values are kept secret, but since all the keys above have been made specifically for a test environment, we are not concerned about security.

### `./users/.env`

```sh
BUCKET_NAME=peerprep3219.appspot.com
POSTGRES_URL=postgres://ppuser:pppwd@localhost/peerprep
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### `./questions/.env`

```sh
MONGODB_URL=mongodb://localhost:27017/questions
BUCKET_NAME=peerprep3219.appspot.com
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
USERS_SERVICE_URL=http://localhost:6969
```

### `./*/service-account..json`

In each of the folders `frontend`, `questions` and `users`, add the file `service-account.json` with the following contents.

```json
{
  "type": "service_account",
  "project_id": "peerprep-test",
  "private_key_id": "3a7f69677fabe63fb16358b58a9bab77a79b6e22",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDI/7aXOEK+k/iZ\nGfo4K2WKeV2u8QSuE9RfN9oVff5fgTUHdYNK9KXF+JRAfxqf2ZJkh3hdS4ipvSxp\n1HGZQ+l9Qu4XTpQRABv+9zhhI0NQr/xk/zZzR92lVlDP/UeXqkthnhd4dKo+MId1\nl2JAeOWQaCEyDtGi0pIFnwW9k4K8Myo/hjWwE+wV4SdgY2kjBUprYsv9iAllUELn\nsr8hxXmko6YMtnF0H4GI1cD/z8GLwRsD6Y/ZUBRK8oDQFVdKHe2U5DvPqCfZ1bxb\nDfX+Jx/7+pKeWbAqFJB9s6YSJ1imQzQYuYLip2fLE2BSpUXMvlI8CxTuoxAuXHSM\nEMbMbVMnAgMBAAECggEAPuR4oy+Y/t35IxrURyAZGS+ppzRGNRwCTzsAM8plPkgF\nKkzUZK9RcbU62kWLNKpVGryi5npcjFQjoge19fGgjS/UpRlSzlD88ZY0n3xzszsl\n3ApZZM//ZB0ykyoa7TN9e9GGYYwLuwLfV+Wi+i56EmnqvSmS4gJGa5jbKHsQJMfF\nGArs6w/M0AJKDBvT0+KWHUypPYGQao1/1tBWZmXGGfOIeWJ4V+FsWHzISV6bDQ5d\njcPDJwwWD8HVLd8Y8UuJvU2WP4ydpQ6iAVW+3Cy/kEHcaaMUN3IrhisSzd/DURR0\nppVgOJUmrfXTFHHI6OlRlDJ0D7h2GNGD2SSN96JHdQKBgQD57A9o1o5XZRIkEufa\nsY1+dihZpA8L1I3eqhkEH/FDhViO6iQEOIMK8MvSvzIsmKCLc7Wyy5Ai5WAHAAIj\nkKI2/ErKjv7GA5k+B+AhFL+O6acpFwiDIvGIhq4CKFZ/70AMWMXt37nqMSCsiRw4\nNXCXXeSiujNBQvL5a/jc+LbY1QKBgQDN4xJePjOIRYifPVrmQ7Ju75ttTDYCZsiQ\n8P29/nzDF+BRJGuXxGZMnKGZiP3zrm379xP5e1etL940IbQT1GR2MAsIQwEKlC/i\nTV1a8g+NdrQA/Sb4Ru5DI/AMwNr/8OvmtvgSjK0SGgBFkGLRH4F7WyNXNNLOtclJ\nQbUXAor6CwJ/Q1xcyuUJeITFXvO5ijhQ6sTuGzsc0xN3KYyvMW1qmchXFi4Fhx20\nND6ysRrXay24F94YGxjCwKUSPNDDwtI45pkZj377LGPL6ew1fLUa7GoNpAWRRccl\nUqb6P5qftdvGZ42Fy5eBhJ25MMfD02KT9jhYZ4PITM6+rntrmCNxJQKBgEsnr4XN\naNw+nZ+bMvpJDfJm7rKYFkMMJ/yYq9dV9U72AUE9bTUKUVl395lnI2R3cNiAGb+B\nIcErbw5Smzx91Go8IVrTsqac71nJaeGP6NN32D9gKYCJy+GgVbkiEQ9Kb6JZefaz\neV3ZNe4uxZOWz5oq65yiwK0KOL7QCH2sxPR/AoGBAN+QhUp2XEZjLwlx8pSjwRGn\nUJfhU3eeqhGMF+DOf7BaYUYTEvQVA45gGQQJdiN+ncnrtO35/vLZ43jvOKeu+ens\nc+Tq3i1Sga73ifMazmJShml/NQGch8J0SFA88VnmYXsj8y27gmOJuLT9h+DIlK9L\nTk7APwYR9tLFOY1wVT71\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-737ke@peerprep-test.iam.gserviceaccount.com",
  "client_id": "113117889579042558853",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-737ke%40peerprep-test.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

## Database instructions

In this assignment we use both Postgres and MongoDB. Be sure to start both database services so that they are running. The `.env` examples above have been written with the default port.

### Postgres database and user creation

Note that while MongoDB is more flexible, Postgres needs an explicit creation command for the database and the users involved before being able to access them. Once installed, use `psql` or a similar interface to access and do the following:

```sql
CREATE database peerprep;
CREATE USER ppuser WITH PASSWORD 'pppwd';
GRANT ALL PRIVILEGES ON DATABASE peerprep TO ppuser;
ALTER USER ppuser WITH SUPERUSER;
```

This gives rise to the `POSTGRES_URL=postgres://USERNAME:PASSWORD@localhost/peerprep` variable used in the user service `.env`. Replace `USERNAME` and `PASSWORD` with the appropriate values.

### Giving yourself admin privileges

:warning: Note that this step must be done only after all the services are up and you have successfully logged into the frontend using Google or Github.

```sql
-- Get your UID and promote yourself to an admin
SELECT * from profiles ;
UPDATE profiles SET role='admin' WHERE uid='YOUR_UID';

-- Or promote all users to admins:
UPDATE profiles SET role='admin';
```

## Running

In each of the `users`, `questions` and `frontend`, start the project with any node package manager like so:

```sh
yarn install
yarn dev
```

Once you have navigated to the frontend (likely at [`http://localhost:3000/`](http://localhost:3000/)), you may start by logging in and exploring the application.

Note that the admin portal is not accessible until you grant yourself admin privileges. You may do these while the app runs, simply open a Postgres psql shell and carry out the steps described in an earlier section.
