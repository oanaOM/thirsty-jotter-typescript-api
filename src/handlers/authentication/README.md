# Authentication mechanism

This API is using Bearer authentication as an HTTP authentication scheme. The client needs to send an `Authorization: Bearer <token>` header with a valid token in order to establish a successful connection with the API.

## How it works?

```mermaid
sequenceDiagram
    participant client as Client
    participant server as Server
    participant db as Database

    client->>+server: HTTP request

    alt Authorization token not found
        server->>client: Invalid request
    else Authorization token found
        server->>+db: validate token
        alt Token is invalid
            db->>server: Invalid token
            server->>client: Invalid token
        else Token is valid
            db->>server: Valid token
            server->>-client: Successfully logged in
        end
    end
```
