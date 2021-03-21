:page_facing_up: Resource Viewer Microservice
=============================================

A microservice to preview resources and embed them in your web application.


Requirements
------------

* Node.js
* NPM
* Environment which meets the requirements of
  [node-gyp](https://github.com/nodejs/node-gyp)


Setup
-----

You'll need to install Node.js and its package manager NPM. Run `npm install` in
the project root to install all dependencies. Then run `npm run build` to
transpile the TypeScript sources.

To start the service run `npm start` on port 3000. A configuration file will be
dumped every time the service starts. Make your desired changes to the file and
restart the service. To validate the configuration check against the JSON Schema
in `src/config/schema.json`.

### Generic PDF.js Viewer

In case you haven't already check out the PDF.js Git submodule with
`git submodule update --init --recursive`.

Build the minified version of the PDF.js generic viewer next:

```shell
cd src/r/pdfjs
npm install
npx gulp minified
cd -
```


Usage
-----

The service is supposed to be embedded in an `iframe`. Point the `src` attribute
value to one of the preview endpoints.

* `/preview/native?url=...` uses the browser default to display the resource
  provided in the URL.
* `/preview/pdf?url=...` uses PDF.js to display PDF documents.

Currently, the resource proxy supports the schemes: `http`, `https` and `file`.
The file proxy uses the `storage/` folder as root, but you can configure the
storage root to be your desired location.

### Secured Resources

In case your documents are stored on a separate service you probably want to
secure them. To authorize the proxy to forward those documents you must provide
credentials in the `config.json`.

```json
{
  ...
  "proxy": {
    "auth": {
      "basic": [
        {
          "hostname": "localhost",
          "port": "8080",
          "username": "john",
          "password": "password1234"
        }
      ],
      "bearer": [
        {
          "hostname": "localhost",
          "port": "8081",
          "access_token": "AbCdEf123456"
        }
      ]
    }
  }
  ...
}
```


Development
-----------

Run `npm run dev` to start nodemon and watch for file changes in the `src/`
directory.

Configurations for IntelliJ are stored in `.idea/runConfigurations/` and are
listed automatically. For VS Code there is a debug launch configurations in the
`.vscode/` directory.


Configuration
-------------

The project provides a few defaults to get the service to run. These defaults
are getting dumped into the `config.json` file each time the service starts as
mentioned above. However, the service loads configurations hierarchical. As soon
as the config file exists and is valid configuration is loaded and merged into
the default values. In addition, the service can be fully configured using
environment variables. They'll take the second highest order in the hierarchy,
if present. The Highest order is taken by Docker secrets.

1. Defaults
2. `config.json`
3. Environment Variables
4. Docker Secrets

---

| Environment Variable  | config.json                       | Docker Secret                         | Data Type             | Default Value                             | Example Value                      | Description                                                                                                                 |
| --------------------- | --------------------------------- | ------------------------------------- | --------------------- | ----------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| PORT                  | _port_                            |                                       | _`string`_,_`number`_ | `3000`                                    | `3000`                             | The port on which the service will be accessed.                                                                             |
| NODE_ENV              | _environment_                     |                                       | _`string`_            | `development`                             | `development`,`production`         | Affects the logging behavior. `production` is less verbose.                                                                 |
| SERVER_CONTEXT_PATH   | _server.contextPath_              |                                       | _`string`_            |                                           | `/viewer`                          | The prefix path the service will be served on.                                                                              |
| SERVER_STORAGE_ROOT   | _server.storageRoot_              |                                       | _`string`_            | `${PWD}/storage`                          | `/var/webdav`                      | The path to your stored documents.                                                                                          |
| VIEWER_PDF_ENTRYPOINT | _resources.pdf.viewer.entrypoint_ |                                       | _`string`_            | `/r/pdfjs/build/minified/web/viewer.html` | `/r/custom/index.html`             | The path from which the PDF.js viewer is mounted.                                                                           |
| VIEWER_PDF_OPTIONS    | _resources.pdf.viewer.options_    |                                       | _`string`_            |                                           | `webgl=true&locale=en_US`          | Query string to configure the PDF.js viewer.                                                                                |
| PROXY_AUTH_BASIC      | _proxy.auth.basic_                | `/var/run/secretes/proxy_auth_basic`  | _`string`_            |                                           | `john:password1234@localhost:8080` | A `|`-separated URI-like connection string which authenticates the proxy to load secured resources from the given location. |
| PROXY_AUTH_BEARER     | _proxy.auth.bearer_               | `/var/run/secretes/proxy_auth_bearer` | _`string`_            |                                           | `AbCdEf123456@localhost:8081`      | A `|`-separated URI-like connection string which authenticates the proxy to load secured resources from the given location. |

**Note:** The value in VIEWER_PDF_OPTIONS has no effect unless you're using a
custom PDF.js build.


Deployment
----------

The [setup](#setup) section contains the necessary steps to deploy the app. Make
sure to pass or set `NODE_ENV=production` before the service goes live.

### Behind A Reverse Proxy

The service doesn't secure its endpoints, so it'll probably sit behind a reverse
proxy that takes care of authentication.

It's recommended to configure the reverse proxy to serve the service on a
context path. Consult the [example](/example/README.md) for more information.

### Docker

The project provides a Dockerfile as well as an example how to integrate the
service into a stack. A prebuilt image is available at
[Docker Hub](https://hub.docker.com/r/vinado/preview-service).

The easiest way to spin up the service with Docker is using Docker Compose:

```yaml
version: '3'
service:
  viewer:
    image: vinado/preview-service
    ports:
      - "3000:3000"
    volumes:
      - ./config.json:/opt/viewer/config.json
```


License
-------

MIT - [Vinado](https://vinado.de) - Built with :heart: in Dresden
