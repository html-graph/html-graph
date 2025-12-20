## Development

```
// install packeges
npm install

// start development server
npm run start

// run unit tests on files modification
npm run test:watch

// run unit tests with code coverage calculation
npx jest --coverage
```

or

```
docker compose up
```

Open `http://localhost:3100`

## Development with Docker

1. [optional] Create `.env` file and set default variables:

```
SERVER_PORT=3100 # (3100 by default) // development server port
E2E_SERVER_PORT=3101 # (3101 by default) // end-to-end tests ui server
HOST_USER_ID=1000 # (1000 by default) host user id to fix file permissions issue
HOST_GROUP_ID=1000 # (1000 by default) host group id to fix file permissions issue
```

2. `docker compose up [--build]` - to run development container [and rebuild]. Press `Ctrl+C` to stop container.

3. `docker compose exec html-graph zsh` - to enter container shell (to install packages and so on)

```
npm install {some package}

npm run test:watch

npx jest --coverage
...
```

4. `docker compose down [--volumes]` - to stop detached container [and clear volumes]

5. `docker compose -f idle.docker-compose.yml up` - to start idle container for manual actions

6. `docker compose -f e2e.docker-compose.yml up` - to start container for end-to-end testing, then open http://localhost:3101

7. `docker compose exec html-graph-e2e zsh` - enter e2e tests container

## Release next version

```
npm login
npm run release-next-version:patch // next patch version
npm run release-next-version:minor // next minor version
npm run release-next-version:major // next major version
```

## Create dependency graph

```
npm run make-deps-graph
```

`./deps-graph/deps-graph.dot` will contain dependency graph in GraphViz format. It can be opened by software such as `xdot`.
