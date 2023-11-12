import React, {useEffect, useState} from 'react';


export default function Dashboard() {
  const [infected, setInfected] = useState(false);
  const [infectedLocations, setInfectedLocations] = useState([])
  const [userLocations, setUserLocations] = useState([])
  const [initialLoad, setInitialLoad] = useState(true)

  // trigger on initial load and changes to userLocations
  useEffect(() => {   
    //load data
     if(initialLoad){
      setInitialLoad(false)

      fetchInfectedLocations()
      fetchUserLocations()
     }  
     //evaluate data
     if(userLocations.length > 0 && infectedLocations.length > 0){
      traceContacts()
     }

     //update dashboard indicator if tracing changed the result
    //if(traceContacts != infected){
      //setInfected(prev => !prev)
    //}
  },[userLocations,infectedLocations]);

  //Compare user locations with infected locations
  function traceContacts(){
    // No need to check if its on red anyway
    if(infected){
      return
    }
    for(let i = 0; i < userLocations.length; i++) {
      let userSpot = userLocations[i];
      let userLocation = userSpot.location
      let userDate = Date.parse(userSpot.date)
      let userFrom = Date.parse(userSpot.from)
      let userTo = Date.parse(userSpot.to)

      for(let j = 0; j < infectedLocations.length; j++) {
        let infectedSpot = infectedLocations[j]
        let infectedLocation = infectedSpot.location
        let infectedDate = Date.parse(infectedSpot.date)
        let infectedFrom =  Date.parse(infectedSpot.from)
        let infectedTo =  Date.parse(infectedSpot.to)

        //Check matching location
        if(userLocation == infectedLocation && userDate == infectedDate){
          //Check matching time
          if(userFrom <= infectedTo && userTo >= infectedFrom){
            console.log(userLocation)
            setInfected(true)
            return;
          }
        }      
      }
  }

  }

  //fetch infected locations
  async function fetchInfectedLocations(){
    var requestOptions = {
      method: "GET",
    };

    await fetch("http://localhost:8000/InfectedLocations", requestOptions)
      .then((response) => response.json())
      .then((result) => setInfectedLocations(result))
      .catch((error) => console.log("error", error));
  }

  //fetch user locations
  async function fetchUserLocations(){
    var requestOptions = {
      method: "GET",
    };

    await fetch("http://localhost:8080/Locations", requestOptions)
      .then((response) => response.json())
      .then((result) => setUserLocations(result))
      .catch((error) => console.log("error", error));
  }

  //post new location
  async function addNewLocation(event){
    console.log(event)
    let date = document.getElementById("Date").value
    let from = date+"T18:"+document.getElementById("From").value+".000Z"
    let to = date+"T18:"+document.getElementById("To").value+".000Z"
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        location: document.getElementById("Location").value, 
        date:  date,
        from:  from,
        to:  to })
    };
    await fetch("http://localhost:8080/Locations", requestOptions);
  }

  //post user locations to infected areas
  function reportPositiveTest(){
    for(let i = 0; i < userLocations.length; i++) {
      let userSpot = userLocations[i];
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          location: userSpot.location, 
          date:  userSpot.date,
          from:  userSpot.from,
          to:  userSpot.to })
      };
      fetch("http://localhost:8000/InfectedLocations", requestOptions);
    }
    setInfected(true)
  }

  return(
    <div>
      <h2>Dashboard</h2>
      {infected && <img src={process.env.PUBLIC_URL + '/bad.png'} alt="Logo" />}
      {!infected && <img src={process.env.PUBLIC_URL + '/good.png'} alt="Logo" />}

      <div>
        <h3>Add Location</h3>
        <form onSubmit={addNewLocation}>
          <label>
              Where:
              <input type="text" name="Location" id="Location" required/>
          </label>
          <br />
          <label>
              Date:
              <input type="datetime" placeholder="yyyy-mm-dd" id="Date" required/>
          </label>
          <br />
          <label>
              From:
              <input type="datetime" placeholder="hh:mm" id="From" required/>
          </label>
          <br />
          <label>
              Until:
              <input type="datetime" placeholder="hh:mm" id="To" required/>
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div>
        <h3>Report Positive Result</h3>
        <button onClick={reportPositiveTest}>I got Covid</button>
      </div>
    </div>
  );
}
