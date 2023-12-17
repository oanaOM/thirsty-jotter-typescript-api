# Thirsty Jotter API

This is Restful API that serves the Thirsty Jotter app. 


## Project dependencies

- express: Fast, un-opinionated, minimalist web framework for Node.js.
- typescript
- xata.io SDK
- dotenv: Zero-dependency module that loads environment variables from a .env file into process.env.
- cors: Express middleware to enable CORS with various options.
- helmet: Express middleware to secure your apps by setting various HTTP headers, which mitigate common attack vectors.

## Environmental variables

- PORT - the port on which the server should start. If not specified, it will default to port no. 4000
- XATA_API_KEY
- XATA_BRANCH


### Endpoints

- `POST /api/login` - authenticates a user. Read more about the authentication mechanism used [here](./src/handlers/authentication/README.md)

- `GET /api/plants` - retrieve all plants
- `GET /api/plants/:id` - retrieve a plant by the id
- `POST /api/plants/:id` - create a plant using the id of the plant
- `PUT /api/plants/:id` - update a plant using the id of the plant
- `DELETE /api/plants/:id` - remove a plant using the id of the plant

### Deploying

To build docker image:

```shell
docker build -t thirsty-jotter-typescript-api .
```


### Testing

- authentication

```bash
curl -i -H "Content-Type:application/json" \
-X POST "http://localhost:7000/api/login" \
-d '{"pass": "123", "user": "goofy"}'
```

### Resources

- https://auth0.com/blog/node-js-and-typescript-tutorial-build-a-crud-api/
- https://retool.com/use-case/admin-panels
- https://github.com/OpenIdentityPlatform/OpenAM/wiki/Stateful-vs-Stateless-Authentication
- https://github.com/vitest-dev/vitest/discussions/4124

TODO

- [] Add integration tests for xata. this might help: https://github.com/xataio/client-ts/blob/main/test/utils/setup.ts#L142
