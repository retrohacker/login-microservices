Registration Microservice
=========================

Simply set this service up by running `make`.

Check `GET /v1/user`, if you get a 401 then redirect to `GET /auth/google`.

You can build off of this when rapidly developing applications, simply update the NGinx config in `proxy` to add your own microservices.

# Deps


Must set the following environment variables in `auth.env`:

```text
APP_HOST=http://localtest.me:3000
APP_ROUTE=/auth
APP_REDIRECT=/
APP_PORT=3000
PGHOST=db
PGPORT=5432
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=dbpassword
REDIS_PORT=6379
REDIS_URL=session
REDIS_SECRET=redispassword
```

You also need `db.env`:

```text
POSTGRES_PASSWORD=dbpassword
```


You also need to create a file `auth/creds.json` with the following structure:

```json
{
  "google" : {
    "id":"...",
    "secret":"..."
  }
}
```

You will need to setup a developer account at google and make sure you have a oauth service setup that forwards traffic to localtest.me

When a user logs in, an oauth entry will be created in the database and a session key containing the user's id will be stored in Redis.
