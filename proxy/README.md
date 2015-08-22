proxy
=====

Handles proxying all incoming requests to public facing microservices. Also serves any static content.

# Structure

### `nginx.conf`

Configuration file for proxy

### `static`

Contains all static assets that will be served. The routes can be managed inside of `nginx.conf`
