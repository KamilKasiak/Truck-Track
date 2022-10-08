import React, { useState } from 'react';
import { useTripContext } from '../hooks/useTripContext';
import './TripDetails.scss';
import { formatDistanceToNow, formatDistanceStrict } from 'date-fns';
import Zoom from '@mui/material/Zoom';
import { useAuthContext } from '../hooks/useAuthContext';

const TripDetails = ({ trip }) => {
  const { user } = useAuthContext();
  const [isExpanded, setExpanded] = useState(false);
  const { dispatch } = useTripContext();
  const [stateUpdate, setState] = useState({
    dateStop: '',
    milageStop: '',
  });
  const { dateStop, milageStop } = { stateUpdate };
  const [isParagraphClicked, setParagraphClicked] = useState(false);
  const [isMilageClicked, setMilageClicked] = useState(false);
  const [error, setError] = useState(null);
  const tripLength = trip.milageStop - trip.milageStart;
  const date = new Date(trip.dateStart).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  const date1 = new Date(trip.dateStop).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const handleDeleteClick = async () => {
    if (!user) {
      return;
    }
    //"/api/tracks/" + trip._id || "http://localhost:4000/api/tracks/" + trip._id
    const response = await fetch(
      'http://localhost:4000/api/tracks/' + trip._id,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    // waiting for response from server then get json from it
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_TRIP', payload: json });
    } else {
      console.log("Can't delete file");
    }
  };

  const handleUpdate = (e) => {
    setState({
      ...stateUpdate,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    } else {
      setState({
        ...stateUpdate,
        [e.target.name]: e.target.value,
      });
    }
    const milageStop = trip.milageStop;
    const currentDate = stateUpdate.dateStop;
    const tripUpdate = { ...stateUpdate, currentDate, milageStop };

    //"/api/tracks/" + trip._id || "http://localhost:4000/api/tracks/" + trip._id
    const response = await fetch(
      'http://localhost:4000/api/tracks/' + trip._id,
      {
        method: 'PATCH',
        body: JSON.stringify(tripUpdate),
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      console.log(trip);
    }
    if (response.ok) {
      setError(null);
      setParagraphClicked(false);
      dispatch({ type: 'SET_TRIP', payload: json });
      console.log('Update sucesfull' + trip);
    }
    window.location.reload();
  };

  const handleUpdateMilage = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    } else {
      setState({
        ...stateUpdate,
        [e.target.name]: e.target.value,
      });
    }
    const dateStop = trip.dateStop;
    const currentMillage = stateUpdate.milageStop;
    const tripMilageUpdate = { ...stateUpdate, dateStop, currentMillage };

    //"/api/tracks/" + trip._id || "http://localhost:4000/api/tracks/" + trip._id
    const response = await fetch(
      'http://localhost:4000/api/tracks/' + trip._id,
      {
        method: 'PATCH',
        body: JSON.stringify(tripMilageUpdate),
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      console.log(trip);
    }
    if (response.ok) {
      setError(null);
      setMilageClicked(false);
      dispatch({ type: 'SET_TRIP', payload: json });
      console.log('Update sucesfull' + trip);
    }
    window.location.reload();
  };

  const timeDiff = formatDistanceStrict(
    new Date(trip.dateStop),
    new Date(trip.dateStart),
    {
      unit: 'hour',
      roundingMethod: 'ceil',
    }
  );

  const onMouseClick = () => {
    if (!isExpanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  const onParagraphClick = () => {
    if (!isParagraphClicked) {
      setParagraphClicked(true);
    } else {
      setParagraphClicked(false);
    }
  };

  const onMilageClick = () => {
    if (!isMilageClicked) {
      setMilageClicked(true);
    } else {
      setMilageClicked(false);
    }
  };

  return (
    <div className='trip-details'>
      <h4 onClick={onMouseClick}>{` ${trip.title} ‣‣‣ ${trip.cityTwo}`}</h4>
      {isExpanded ? (
        <p>
          <strong>Start date: </strong> {date}
        </p>
      ) : (
        ''
      )}
      {isExpanded ? (
        <p onClick={onParagraphClick}>
          <strong>End date: </strong>{' '}
          {trip.dateStop ? date1 : 'Click to update'}
        </p>
      ) : (
        ''
      )}
      {isParagraphClicked && !trip.dateStop ? (
        <form onSubmit={handleUpdateSubmit}>
          <input
            name='dateStop'
            className='endDateInput'
            type='datetime-local'
            onChange={handleUpdate}
            value={stateUpdate.dateStop}
          />
          <Zoom in={isParagraphClicked}>
            <button className='updateButton'>Update</button>
          </Zoom>
        </form>
      ) : null}

      {isExpanded && trip.dateStop ? (
        <p>
          <strong>Work length: </strong> {trip.dateStop ? timeDiff : 'On going'}
        </p>
      ) : null}
      {isExpanded ? (
        <p onClick={onMilageClick}>
          <strong>Trip Length: </strong>{' '}
          {trip.milageStart && trip.milageStop
            ? `${tripLength} KM`
            : `Click to update`}
        </p>
      ) : null}
      {isMilageClicked && !trip.milageStop ? (
        <form name='milageStop' onSubmit={handleUpdateMilage}>
          <p>{`Milage at start: ${trip.milageStart} KM`}</p>
          <input
            name='milageStop'
            className='endDateInput'
            type='number'
            onChange={handleUpdate}
            value={stateUpdate.milageStop}
            placeholder='KM end'
          />
          <Zoom in={isMilageClicked}>
            <button className='updateButton'>Update</button>
          </Zoom>
        </form>
      ) : null}
      {isMilageClicked && trip.milageStop ? (
        <p>
          {`Milage at start: ${trip.milageStart} KM`} <br />{' '}
          {`Milage at end: ${trip.milageStop} KM`}{' '}
        </p>
      ) : (
        ''
      )}

      <Zoom in={isExpanded}>
        <span className='material-symbols-outlined' onClick={handleDeleteClick}>
          delete
        </span>
      </Zoom>
      {isExpanded ? (
        <p>
          {formatDistanceToNow(new Date(trip.createdAt), { addSuffix: true })}
        </p>
      ) : null}
      {error && <div className='error'>{error}</div>}
    </div>
  );
};

export default TripDetails;
