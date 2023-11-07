# Testing

We recommend using our production environment for testing. You can find the production environment at [https://peerprep.sivarn.com](https://peerprep.sivarn.com).

# Testing Locally

## DISCLAIMER: Our executor service can only run on x86_64 architecture. If you are using a different architecture, you will not be able to run the executor locally. However, you can still test the rest of the application.

- Install Docker for your operating system. You can find the installation instructions [here](https://docs.docker.com/get-docker/).
- Clone the repository.
- Run `git submodule update --init` to clone the submodules.
- In the frontend folder, add .env file with the following content:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAMiTV5yv2D-gvCy2TNEFREZIMUJ3SnYD8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=peerprep-test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=peerprep-test
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=peerprep-test.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=655590321803
NEXT_PUBLIC_FIREBASE_APP_ID=1:655590321803:web:293756d86132bdafddae8e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXSP3K70CN
NEXT_PUBLIC_PEERPREP_INNKEEPER_SOCKET_URL=localhost
```

Note that usually these values are kept secret, but since this is a test environment, we are not concerned about security.

- In the root folder, add .env file with the following content:

```
POSTGRES_USER=peerprep
POSTGRES_PASSWORD=somepassword
GOOGLE_APPLICATION_CREDENTIALS=/firebase-auth/service-account.json
MONGODB_URL=mongodb://peerprep-mongo:27017/questions
BUCKET_NAME=peerprep-test.appspot.com
USERS_SERVICE_URL=http://peerprep-users-service:6969
POSTGRES_URL=postgres://peerprep:somepassword@peerprep-postgres/peerprep
INITIALIZATION_VECTOR=vector
ENCRYPTION_KEY=key
```

- In the firebase-auth folder, add service-account.json (file name has to be exact match) file with the following content:

```
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

Note that usually these values are kept secret, but since this is a test environment, we are not concerned about security.

- In the root folder, run `docker compose -f docker-compose.yml up -d`.

- Application should be running at [http://localhost](http://localhost).

# Giving yourself admin privileges

- Login to the application in your browser using Google/Github.
- Run the following commands in your terminal:

```
docker exec -it peerprep-postgres bash
psql -U peerprep
UPDATE profiles SET role='admin';
```

This will give every user admin privileges. Note that this is only for testing purposes.
