Auth Microservice
====

A simple microservice that handles all authentication

# Structure

### `auth`

Contains all code related to oauth providers

### `db`

Contains all postgresql specific code

### `controller`

Glue code wiring auth endpoints to the db

### `models`

Defines the structure of data within the app. Also contains the postgresql definitions of that data.

### `session`

All infomration for connecting to redis.
