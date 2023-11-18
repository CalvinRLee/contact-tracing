## Introduction
Contact Tracing Protype as assignment for "Secure Software Engineering"-class.
Implemented security features:
- User authentication through login restriction
- Asymmetric Encryption of payload content between client and server
- Encryption using a secret for data storage on the server
- Input sanitization on client side
- Input validation on server side

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `run mock user database`
json-server --watch userDatabase.json --port 8081

### `run backend server`
cd backend_server
node app


"username": "test-user",
"password": "secretpassword"