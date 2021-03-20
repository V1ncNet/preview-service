:page_facing_up: Resource Viewer Microservice
========================================

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


Deployment
----------

The [setup](#setup) section contains the necessary steps to deploy the app. Make
sure to pass or set `NODE_ENV=production` before the service goes live.

### Behind A Reverse Proxy

The service doesn't secure its endpoints, so it'll probably sit behind a reverse
proxy that takes care of authentication.

It's recommended to configure the reverse proxy to serve the service on a
context path. Consult the [example](/example/README.md) for more information.
