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
  const [lastTripEndDate, setLastTripEndDate] = useState('');
  const [timeToNow, setTimeToNow] = useState('');
  const [totalTripsCount, setTotalTripsCount] = useState('');
  const [firstTripDate, setFirstTripDate] = useState('');
  const [totalWorkTime, setTotalWorkTime] = useState('');
  const [totalLength, setTotalLength] = useState('');

  // useEffect fire function when a component is rendered. declare [] to make it empty when component is rendered
  useEffect(() => {
    async function fetchTrips() {
      //"/api/tracks" || "http://localhost:4000/api/tracks"
      const response = await fetch('/api/tracks', {
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
    } else {
      setTimeToNow('Last trip does not end yet');
    }
  };

  const getDriverStats = async () => {
    const totalTripsCount = await trips.length;
    setTotalTripsCount(totalTripsCount);
    if (totalTripsCount > 0) {
      const firstTripDate = await trips[trips.length - 1].dateStart;
      const date = new Date(firstTripDate).toLocaleDateString('en-gb', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
      setFirstTripDate(date);

      let minutesDiff = 0;
      let totalLength = 0;
      for (let i = 0; i < trips.length; i++) {
        if (trips[i].dateStop) {
          let minutes = differenceInMinutes(
            new Date(trips[i].dateStart),
            new Date(trips[i].dateStop)
          );
          const parseMinutes = parseInt(minutes * -1);
          minutesDiff = minutesDiff + parseMinutes;
        }

        if (trips[i].milageStop) {
          let tripLength = trips[i].milageStop - trips[i].milageStart;
          totalLength += tripLength;
        }
      }
      const hoursDiff = Math.floor(minutesDiff / 60);
      const minute = minutesDiff % 60;
      let formattedDate = `${hoursDiff}h:${minute}min`;
      setTotalWorkTime(formattedDate);
      setTotalLength(totalLength);
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
  getDriverStats();

  setInterval(function () {
    currentTimeDiff();
  }, 60000);

  return (
    <div className='home'>
      <div className='trip'>
        <p className='time-to-now'>{timeToNow}</p>
        {/* map throught the trips only when they are updated */}
        {trips &&
          trips.map((trip) => <TripDetails key={trip._id} trip={trip} />)}
      </div>
      <TripForm
        totalTripsCount={totalTripsCount}
        totalWorkTime={totalWorkTime}
        totalLength={totalLength}
        firstTripDate={firstTripDate}
      />
    </div>
  );
}

export default Home;
