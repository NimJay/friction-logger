# Friction Logger Front-end

This directory contains the front-end Preact app of Friction Logger.

## Run/Develop On Your Machine

To develop on your own machine.

1. You will need to first run `npm install` (once) to install dependencies.

2. Then, every time you want to start working on the code, run `npm run dev`. This will run a development server at [localhost:8081](http://localhost:8081). Changes you make to this Preact app's source code will trigger a rebuild automatically.

## Deploying To Production

When we want to deploy this Preact app to production, we need to:
1. Inside `back-end-api.js`, set `SERVER_URL` to `'https://nimjay-starter-project.uc.r.appspot.com'`.
2. Run `npm run build` from this folder (`front-end/`). This will create a `front-end-build/` folder containing a minified Preact app.
3. Remove the old build: `rm -r ../back-end/front-end-build`.
4. Move the generated `front-end-build/` folder into `back-end/`: `mv front-end-build ../back-end`
5. From the `back-end/` folder, run `gcloud app deploy`.

## Other

- This Preact app was generated using [preact-cli](https://github.com/developit/preact-cli/blob/master/README.md): `preact create default front-end`

- This Preact project doesn't implement any tests but, normally, test would be run using: `npm run test`

- If you would like to test the minified build of this Preact app locally, use: `npm run serve`
