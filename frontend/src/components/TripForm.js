import { useState } from 'react';
import './TripForm.scss';
import { useTripContext } from '../hooks/useTripContext';
import { useAuthContext } from '../hooks/useAuthContext';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

const TripForm = ({
  totalTripsCount,
  totalWorkTime,
  totalLength,
  firstTripDate,
}) => {
  const { dispatch } = useTripContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState('');
  const [cityTwo, setCityTwo] = useState('');
  const [dateStart, setStart] = useState('');
  const [dateStop, setStop] = useState('');
  const [milageStart, setMilageStart] = useState('');
  const [milageStop, setMilageStop] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [value, setValue] = useState(dayjs());
  const [valueStop, setValueStop] = useState(dayjs());
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChangeStart = (newValue) => {
    setValue(newValue);
    setStart(newValue);
  };
  const handleChangeStop = (newValue) => {
    setValueStop(newValue);
    setStop(newValue);
  };

  const handleSubmit = async (e) => {
    //prevent to reload page on submit
    e.preventDefault();
    if (!user) {
      setError('You must be logged in');
      return;
    }
    const trip = {
      title,
      cityTwo,
      dateStart,
      dateStop,
      milageStart,
      milageStop,
    };
    //"/api/tracks" || "http://localhost:4000/api/tracks"
    const response = await fetch('http://localhost:4000/api/tracks', {
      method: 'POST',
      body: JSON.stringify(trip),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle('');
      setStart('');
      setStop('');
      setCityTwo('');
      setMilageStart('');
      setMilageStop('');
      setError(null);
      setEmptyFields([]);
      setValue(dayjs());
      console.log('New trip added', json);
      dispatch({ type: 'CREATE_TRIP', payload: json });
    }
  };

  // use colons when return a template
  return (
    <div className='add-trip-container'>
      <div className='expandButton'>
        <Fab
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          <AddIcon />
        </Fab>
      </div>
      <Zoom in={!isExpanded}>
        <div className={!isExpanded ? 'driver-stats' : 'hide'}>
          <h3>Driver's profile</h3>
          <p>
            Total number of routes:{' '}
            <span className='info'>{totalTripsCount}</span>
          </p>
          <p>
            Total tracked work time is{' '}
            <span className='info'>{totalWorkTime}</span>
          </p>
          <p>
            Total distance traveled:{' '}
            <span className='info'>{totalLength}km</span>
          </p>
          <p>
            First tracked trip started at:{' '}
            <span className='info'>{firstTripDate}</span>
          </p>
        </div>
      </Zoom>

      <Zoom in={isExpanded}>
        <form
          className={isExpanded ? 'create' : 'hide'}
          onSubmit={handleSubmit}
        >
          <div className='cities'>
            <input
              className={
                emptyFields.includes('title') ? 'error cityOne' : 'cityOne'
              }
              type='text'
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              placeholder='From'
            />
            <input
              className={
                emptyFields.includes('cityTwo') ? 'error cityTwo' : 'cityTwo'
              }
              type='text'
              onChange={(event) => setCityTwo(event.target.value)}
              value={cityTwo}
              placeholder='To'
            />
          </div>
          <div className='date-picker-container'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3}>
                <MobileDateTimePicker
                  value={value}
                  // className={
                  //   emptyFields.includes('dateStart')
                  //     ? 'error date-picker'
                  //     : 'date-picker'
                  // }
                  onChange={handleChangeStart}
                  label='Start Time'
                  onError={console.log}
                  minDate={dayjs('2018-01-01T00:00')}
                  inputFormat='DD/MM/YYYY HH:mm'
                  renderInput={(params) => (
                    <TextField
                      sx={
                        emptyFields.includes('dateStart')
                          ? {
                              svg: { color: '#fff' },
                              input: {
                                color: '#fff',
                                textShadow: '0px 0px 4px black',
                                backgroundColor: '#e7195a',
                                opacity: '0.5',
                                padding: '14px 5px 5px 10px',
                              },
                              label: {
                                color: '#fff',
                                fontSize: '1rem',
                                top: '9px',
                              },
                            }
                          : {
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
                            }
                      }
                      {...params}
                    />
                  )}
                />
              </Stack>

              <Stack spacing={3}>
                <MobileDateTimePicker
                  value={valueStop}
                  onChange={handleChangeStop}
                  label='End Time'
                  onError={console.log}
                  minDate={dayjs('2018-01-01T00:00')}
                  inputFormat='DD/MM/YYYY HH:mm'
                  renderInput={(params) => (
                    <TextField
                      sx={{
                        svg: { color: '#fff', shrink: true },
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
                      }}
                      {...params}
                    />
                  )}
                />
              </Stack>
            </LocalizationProvider>
          </div>
          <div className='millage'>
            <input
              className={
                emptyFields.includes('milageStart') ? 'error half' : 'half'
              }
              type='number'
              placeholder='KM start'
              onChange={(event) => setMilageStart(event.target.value)}
              value={milageStart}
            />
            <input
              type='number'
              className='half'
              placeholder='KM end'
              onChange={(event) => setMilageStop(event.target.value)}
              value={milageStop}
            />
          </div>

          <button className='tripAddButton'>Add Trip</button>
          {error && <div className='error'>{error}</div>}
        </form>
      </Zoom>
    </div>
  );
};

export default TripForm;
