import { pki } from "node-forge";
import globalVal from "./globalVar";

export default async function fetchPrivateKey(){
    if (globalVal.publicKey === ""){
        var requestOptions = {
          method: "GET",
        };
    
        await fetch("http://localhost:8080/Key", requestOptions)
          .then((response) => response.json())
          .then((result) => globalVal.publicKey = pki.publicKeyFromPem(result["publicKey"]))
          .catch((error) => console.log("error", error));
    }
  }