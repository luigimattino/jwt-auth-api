# jwt-auth-api
RESTful API for managing JSON web tokens for secure applications.

# Description
The goal of this API is to manage user authentication with the help of the JWT standard (JSON Web Tokens). In particular, the access token mechanism is used in combination with the refresh token: the access token is a temporary token that is used to access resources. The refresh token is a token that lasts for the log-in session and is used when another one needs to be generated when the access token expires. Through the API it is possible to register a user, authenticate a user, use a refresh token that the client stores and uses when the access token has expired.
There is a collection of postman with which to test the API and its environment for the JWT token store. - L'obbiettivo di questa API è quello di gestire l'autenticazione utente con l'ausilio dello standard JWT (JSON Web Tokens). In particolare si utilizza il meccanismo del token di accesso in combinazione con  il token di refresh: il token di accesso è un token temporaneo che viene utilizzato per l'accesso alle risorse. Il token di refresh è un token che dura per la sessione di log-in e che viene usato quando alla scadenza del token di accesso è necessario generarne un'altro. Mediante le API è possibile registrare un utente, autenticare un utente, usare un token di refresh che il client memorizza ed usa quando il token di accesso è scaduto.
E' presente una collection di postman con cui testare le API e relativo environment per lo store dei token JWT.

## Built With

*   [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP
*   [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication requests
*   [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - A library to help you hash passwords.
*   [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from .env file.
*   [pg](https://github.com/brianc/node-postgres) - node-postgres is a collection of node.js modules for interfacing with your PostgreSQL database.

## Running the application Locally

Make sure you have [Node.js](http://nodejs.org/) and the [PostgreSQL](https://www.postgresql.org/) installed.

```sh
git clone https://luigimattino@github.com/luigimattino/jwt-auth-api.git # or clone your own fork
cd jwt-auth-api
create a [env](#env-file) file.
npm install
npm start
```
This API app should now be running on [localhost:3000](http://localhost:3000/).

## ENV file

Create a .env file and insert your config data
<pre style="font-size:80%;">
ACCESS_64_KEY=<keyword>
REFRESH_64_KEY=<keyword>
DB_USER=<db_user>
DB_PWD=******
</pre>