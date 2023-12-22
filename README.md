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

For the xata API keys, you need to have xata CLI installed locally and follow the instructions from their [docs](https://xata.io/docs/getting-started/cli#init).


### Endpoints

You can checkout the API documentation by navigating to `http://localhost:8080/api-docs/`. This documentation is powered by Swagger following the OpenAPI 3.0 specifications.


### Deploying

To build docker image:

```shell
docker build -t thirsty-jotter-typescript-api .
```


### Testing

- authentication

```bash
curl -i -H "Content-Type:application/json" \
-X POST "http://localhost:8080/api/login" \
-d '{"pass": "123", "user": "goofy"}'
```


- user

```bash
curl -i -H "Content-Type:application/json" \
-X POST "http://localhost:8080/api/users/validate" \
-d '{"email": "goofy+3@him.io"}'
```

```bash
curl -i -H "Content-Type:application/json" \
-X POST "http://localhost:8080/api/users/create" \
-d '{ "email": "goofy+30@gmail.io", "password": "goody1234", "first_name": "Goofy", "last_name": "Goofy", "country": "UK"}'
```

### Resources

- https://auth0.com/blog/node-js-and-typescript-tutorial-build-a-crud-api/
- https://retool.com/use-case/admin-panels
- https://github.com/OpenIdentityPlatform/OpenAM/wiki/Stateful-vs-Stateless-Authentication
- https://github.com/vitest-dev/vitest/discussions/4124
- [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)
- [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)

TODO

- [] Add integration tests for xata. this might help: https://github.com/xataio/client-ts/blob/main/test/utils/setup.ts#L142
- [ ] Implement functionality to create new users.
