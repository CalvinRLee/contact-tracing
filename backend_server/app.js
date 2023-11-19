const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const forge = require('node-forge')
const cryptojs = require("crypto-js")
const fs = require('fs');

require('dotenv').config()

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let privateKey
let infectedLocationStore = []//JSON-Array
let userStore = []//JSON-Array

// function used once to initially generate random keypair
/*async function generateEncrytpionKeys(){
    await forge.pki.rsa.generateKeyPair({bits: 2048, workers: 2}, (err, keypair) => {
      pubPem = forge.pki.publicKeyToPem(keypair.publicKey)
      privPem = forge.pki.privateKeyToPem(keypair.privateKey)

      //test if it works
      let message = "Test Message"
      console.log(message)
      let encrypted_message = keypair.publicKey.encrypt(message)
      console.log(encrypted_message)
      let decrypted_message = keypair.privateKey.decrypt(encrypted_message)
      console.log(decrypted_message)
    });
}*/

function decipherSecretEncryption(encryptedText){
    return cryptojs.AES.decrypt(encryptedText, process.env.SECRET).toString(cryptojs.enc.Utf8)
}
function encipherSecretEncryption(plainText){
    return cryptojs.AES.encrypt(plainText, process.env.SECRET).toString()
}
function authenticate(user,password){
    //decrypt message content
    user = privateKey.decrypt(user)
    password = privateKey.decrypt(password)

    for(let i = 0; i < userStore.length; i++) {
        let account = userStore[i];
        if(account.password === password && account.username === user){
            return true
        }
    }
    return false
}
function addNewInfectedLocations(newLocations){
    for(let i = 0; i < newLocations.length; i++) {
        newLocation = newLocations[i]
        infectedLocationStore.push({ 
            location: privateKey.decrypt(newLocation.location), 
            date: privateKey.decrypt(newLocation.date),
            from: privateKey.decrypt(newLocation.from),
            to: privateKey.decrypt(newLocation.to)})
    }
    writeMockDatabase()
}   
//read json file mocking our database
function readMockDatabase(){
    let jsonDatabase = JSON.parse(fs.readFileSync('./serverDatabase.json'))

    userStore = []
    //load existing accounts
    for(let i = 0; i < jsonDatabase.User.length; i++) {
        let account = jsonDatabase.User[i];
        userStore.push({ 
            username: decipherSecretEncryption(account.username), 
            password: decipherSecretEncryption(account.password)})
    }

    infectedLocationStore = []
    //load infected locations
    for(let i = 0; i < jsonDatabase.InfectedLocations.length; i++) {
        let infectedLocation = jsonDatabase.InfectedLocations[i];
        infectedLocationStore.push({ 
            location: decipherSecretEncryption(infectedLocation.location), 
            date: decipherSecretEncryption(infectedLocation.date),
            from: decipherSecretEncryption(infectedLocation.from),
            to: decipherSecretEncryption(infectedLocation.to)})
    }
}
//write json file mocking our database
function writeMockDatabase(){
    encryptedUsers = []
    //encrypt existing accounts
    for(let i = 0; i < userStore.length; i++) {
        let account = userStore[i];
        encryptedUsers.push({ 
            username: encipherSecretEncryption(account.username), 
            password: encipherSecretEncryption(account.password)})
    }

    encryptedLocations=[]
    //encrypt infected locations
    for(let i = 0; i < infectedLocationStore.length; i++) {
        let infectedLocation = infectedLocationStore[i];
        encryptedLocations.push({ 
            location: encipherSecretEncryption(infectedLocation.location), 
            date: encipherSecretEncryption(infectedLocation.date),
            from: encipherSecretEncryption(infectedLocation.from),
            to: encipherSecretEncryption(infectedLocation.to),
            id: i})
    }
    fs.writeFileSync('./serverDatabase.json', JSON.stringify({ InfectedLocations: encryptedLocations, User: encryptedUsers }));
}


//server api routes
app.route('/InfectedLocations')
  .get((req, res) => {
    res.send({ "InfectedLocations": infectedLocationStore })
  })
  .post((req, res) => {
    addNewInfectedLocations(req.body.locations)
    res.send({ "msg": "success" })
  })
app.post('/User', (req, res) => {
    res.send({ "success": authenticate(req.body.user,req.body.password)})
    })
app.get('/Key', (req, res) => {
    res.send({ "publicKey": process.env.PUBLIC_KEY })
})

//on server start
app.listen(process.env.PORT, () => {
    //load private key
    privateKey = forge.pki.privateKeyFromPem(process.env.PRIVATE_KEY)
    //load data
    readMockDatabase()
    console.log('listening on port '+process.env.PORT)
})