## Introduction
Contact Tracing Protype as assignment for "Secure Software Engineering"-class.\
Implemented security features:
- User authentication through login restriction
- Asymmetric Encryption of payload content between client and server
- Encryption using a secret for data storage on the server
- Input sanitization on client side
- Fail safe page for access to non existing urls

## Setup Instructions

### Requirements
Node version >= 16.15.0

### Start
`git clone https://github.com/AndiDreeke/contact-tracing.git` \
`cd contact-tracing` \
`npm start` \

Start the mock user database in new command line: \
`json-server --watch userDatabase.json --port 8081` \

Start the mock express server in new command line: \
`cd backend_server`\
`node app`\

### Credentials to access
Username: "test-user",\
Password: "secretpassword"