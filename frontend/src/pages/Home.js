import React, { useEffect, useState } from "react";
import TripDetails from "../components/TripDetails";
import TripForm from "../components/TripForm.js";
import { useTripContext } from "../hooks/useTripContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const { trips, dispatch } = useTripContext();
  const { user } = useAuthContext();
  const { tripDataJson, setTripDataJson } = useState([]);
  //let allTrips = JSON.stringify(trips, null, 2 || "");

  // useEffect fire function when a component is rendered. declare [] to make it empty when component is rendered
  useEffect(() => {
    async function fetchTrips() {
      //"/api/tracks" || "http://localhost:4000/api/tracks"
      const response = await fetch("http://localhost:4000/api/tracks", {
        headers: {
          // have to get headers with authorization data token: Bearer + token grabed from user from AuthContext
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        // fire function with case SET_TRIP in TripContext and as payload use all object json declared above as entire array get from server
        dispatch({ type: "SET_TRIP", payload: json });
      }
    }
    if (user) {
      fetchTrips();
    }
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="trip">
        <div>
          {/* <button
            onClick={(allTrips) => {
              setTripDataJson(allTrips);
            }}
          >
            get Trips
          </button>
          <pre>{tripDataJson}</pre> */}
        </div>
        {/* map throught the trips only when they are updated */}
        {trips &&
          trips.map((trip) => <TripDetails key={trip._id} trip={trip} />)}
      </div>
      <TripForm />
    </div>
  );
}

export default Home;
