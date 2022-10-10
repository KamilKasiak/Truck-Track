import React, { useEffect, useState } from 'react';
import TripDetails from '../components/TripDetails';
import TripForm from '../components/TripForm.js';
import './Home.scss';
import { useTripContext } from '../hooks/useTripContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { parseISO, differenceInHours, differenceInMinutes } from 'date-fns';

function Home() {
  const { trips, dispatch } = useTripContext();
  const { user } = useAuthContext();
  // const { tripDataJson, setTripDataJson } = useState([]);
  const [lastTripEndDate, setLastTripEndDate] = useState('');
  const [timeToNow, setTimeToNow] = useState('');
  //let allTrips = JSON.stringify(trips, null, 2 || "");

  // useEffect fire function when a component is rendered. declare [] to make it empty when component is rendered
  useEffect(() => {
    async function fetchTrips() {
      //"/api/tracks" || "http://localhost:4000/api/tracks"
      const response = await fetch('http://localhost:4000/api/tracks', {
        headers: {
          // have to get headers with authorization data token: Bearer + token grabed from user from AuthContext
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        // fire function with case SET_TRIP in TripContext and as payload use all object json declared above as entire array get from server
        dispatch({ type: 'SET_TRIP', payload: json });
      }
    }
    if (user) {
      fetchTrips();
    }
  }, [dispatch, user]);

  const getLastTrip = async () => {
    const date = await trips[0].dateStop;
    if (date) {
      setLastTripEndDate(date);
      currentTimeDiff();
      // const targetDate = parseISO(lastTripEndDate); // your target date
      // const hoursDiff = differenceInHours(targetDate, new Date());
      // const minutesDiff = differenceInMinutes(targetDate, new Date());
      // const subtraction = minutesDiff - hoursDiff * 60;
      // const formattedDate = `${hoursDiff * -1}h:${subtraction * -1}min`;
    } else {
      setTimeToNow('Last trip does not end yet');
    }
  };

  const currentTimeDiff = () => {
    if (lastTripEndDate) {
      const targetDate = parseISO(lastTripEndDate); // your target date
      const hoursDiff = differenceInHours(targetDate, new Date());
      const minutesDiff = differenceInMinutes(targetDate, new Date());
      const subtraction = minutesDiff - hoursDiff * 60;
      const formattedDate = `${hoursDiff * -1}h:${subtraction * -1}min`;
      setTimeToNow('Last trip has ended ' + formattedDate + ' ago');
    } else {
      setTimeToNow('Last trip does not end yet');
    }
  };
  getLastTrip();

  setInterval(function () {
    currentTimeDiff();
  }, 60000);

  return (
    <div className='home'>
      <div className='trip'>
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
        <p className='time-to-now'>{timeToNow}</p>
        {/* map throught the trips only when they are updated */}
        {trips &&
          trips.map((trip) => <TripDetails key={trip._id} trip={trip} />)}
      </div>
      <TripForm />
    </div>
  );
}

export default Home;
