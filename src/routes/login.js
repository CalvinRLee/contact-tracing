import {useNavigate} from "react-router-dom"
import {useEffect} from 'react';
import globalVal from "../components/globalVar";
import fetchPrivateKey from "../components/fetchPrivateKey";

export default function Login() {
  const navigate = useNavigate();

  //get public key from server on the very first load of website
  useEffect(() => {   
    localStorage.setItem("isAuthenticated", false)
    fetchPrivateKey()
  },[]);

  async function authenticate()
  {
    let isValid = false
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user: globalVal.publicKey.encrypt(document.getElementById("User").value),
        password: globalVal.publicKey.encrypt(document.getElementById("Password").value)
      })
    };
    await fetch("http://localhost:8080/User", requestOptions)
      .then((response) => response.json())
      .then((result) => isValid = result.success)
      .catch((error) => console.log("error", error));

    return isValid;
  }
  
  async function handleSubmit(event)
  {
    event.preventDefault();
      if(await authenticate()){
        localStorage.setItem("isAuthenticated", true)
        alert("Login successful")
        navigate("/dashboard");
      }
      else{
        
          alert("Username or Password was incorrect")
      }
  }
    return (
      <>
        <div id="sidebar">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" required id="User"/>
            </label>
            <label>
                Password:
                <input type="text" name="password" required id="Password"/>
            </label>
            <input type="submit" value="Login" />
          </form>
        </div>
        <div id="detail"></div>
      </>
    );
  }