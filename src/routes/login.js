import {useNavigate} from "react-router-dom"



export default function Login() {
  const navigate = useNavigate();
  function authenticate()
  {
      return true;
  }
  async function handleSubmit(event)
  {
      if(await authenticate()){
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
                <input type="text" name="name" required/>
            </label>
            <label>
                Password:
                <input type="text" name="password" required/>
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div id="detail"></div>
      </>
    );
  }