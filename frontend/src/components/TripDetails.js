import React, { useState } from 'react';
import { useTripContext } from '../hooks/useTripContext';
import './TripDetails.scss';
import { formatDistanceToNow, formatDistanceStrict } from 'date-fns';
import Zoom from '@mui/material/Zoom';
import { useAuthContext } from '../hooks/useAuthContext';
import dayjs from 'dayjs';
import { parseISO, differenceInHours, differenceInMinutes } from 'date-fns';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

const TripDetails = ({ trip }) => {
  const { user } = useAuthContext();
  const [isExpanded, setExpanded] = useState(false);
  const { dispatch } = useTripContext();
  const [stateUpdate, setState] = useState({
    milageStop: '',
  });

  const [dateStop, setDateStop] = useState('');
  const [isParagraphClicked, setParagraphClicked] = useState(false);
  const [isMilageClicked, setMilageClicked] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(dayjs());
  const [timeToNow, setTimeToNow] = useState('');
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
    const response = await fetch('/api/tracks/' + trip._id, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    // waiting for response from server then get json from it
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_TRIP', payload: json });
    } else {
      console.log("Can't delete file");
    }
  };

  const handleUpdateDate = (newValue) => {
    setValue(newValue);
    setDateStop(newValue);
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
    }
    // else {
    //   setState({
    //     ...stateUpdate,
    //     [e.target.name]: e.target.value,
    //   });
    // }
    const milageStop = trip.milageStop;
    // const currentDate = stateUpdate.dateStop;
    // const tripUpdate = { ...stateUpdate, currentDate, milageStop };
    const tripUpdate = { dateStop, milageStop };

    //"/api/tracks/" + trip._id || "http://localhost:4000/api/tracks/" + trip._id
    const response = await fetch('/api/tracks/' + trip._id, {
      method: 'PATCH',
      body: JSON.stringify(tripUpdate),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
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
    }
    // else {
    //   setState({
    //     ...stateUpdate,
    //     [e.target.name]: e.target.value,
    //   });
    // }
    const dateStop = trip.dateStop;
    const currentMillage = stateUpdate.milageStop;
    const tripMilageUpdate = { ...stateUpdate, dateStop, currentMillage };
    // const tripMilageUpdate = { dateStop, currentMillage };

    //"/api/tracks/" + trip._id || "http://localhost:4000/api/tracks/" + trip._id
    const response = await fetch('/api/tracks/' + trip._id, {
      method: 'PATCH',
      body: JSON.stringify(tripMilageUpdate),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
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

  // const targetDate = parseISO(lastTripEndDate); // your target date
  const hoursDiff = differenceInHours(
    new Date(trip.dateStart),
    new Date(trip.dateStop)
  );
  const minutesDiff = differenceInMinutes(
    new Date(trip.dateStart),
    new Date(trip.dateStop)
  );
  const subtraction = minutesDiff - hoursDiff * 60;
  const formattedDate = `${hoursDiff * -1}h:${subtraction * -1}min`;

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
              <MobileDateTimePicker
                value={value}
                onChange={handleUpdateDate}
                label='End Time'
                onError={console.log}
                minDate={dayjs('2018-01-01T00:00')}
                inputFormat='DD/MM/YYYY HH:mm'
                renderInput={(params) => (
                  <TextField
                    name='dateStop'
                    sx={{
                      svg: { color: '#fff' },
                      input: {
                        color: '#fff',
                        textShadow: '0px 0px 4px black',
                        backgroundColor: '#333',
                        opacity: '0.5',
                        padding: '14px 5px 5px 10px',
                      },
                      label: {
                        color: '#fff',
                        fontSize: '1rem',
                        top: '9px',
                      },
                      width: 'fit-content',
                      border: ' 1px solid #ddd',
                      borderRadius: '4px',
                      marginTop: '10px',
                      marginBottom: '20px',
                    }}
                    {...params}
                  />
                )}
              />
            </Stack>
          </LocalizationProvider>
          {/* <input
            name='dateStop'
            className='endDateInput'
            type='datetime-local'
            onChange={handleUpdate}
            value={stateUpdate.dateStop}
          /> */}
          <Zoom in={isParagraphClicked}>
            <button className='updateButton'>Update</button>
          </Zoom>
        </form>
      ) : null}

      {isExpanded && trip.dateStop ? (
        <p>
          <strong>Work length: </strong>{' '}
          {trip.dateStop ? formattedDate : 'On going'}
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
