:gear: Preview Service Example
==============================

This example aims to provide a possible setup for a real world application.

---

The Docker Compose file contains declarations for a NGINX webserver, a secured
WebDAV and the viewer service itself. NGINX serves a static `index.html` which
provides an entrypoint into the stack by displaying the viewer in an `iframe`.
The webserver also functions as a reverse proxy for viewer service and WebDAV.


Usage
-----

```shell
docker-compose up -d --build
```

... builds and starts the hole stack. Visit `http://localhost:8080/` afterwards
to watch the result.
