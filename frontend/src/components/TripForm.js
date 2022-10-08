import { useState } from 'react';
import './TripForm.scss';
import { useTripContext } from '../hooks/useTripContext';
import { useAuthContext } from '../hooks/useAuthContext';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

const TripForm = () => {
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

  const [dateWithInitialValue, setDateWithInitialValue] = useState(dayjs());

  const handleChangeStart = (newValue) => {
    setValue(newValue);
    setStart(newValue);
  };
  const handleChangeStop = (newValue) => {
    setValue(newValue);
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
      console.log('New trip added', json);
      dispatch({ type: 'CREATE_TRIP', payload: json });
    }
  };

  // use colons when return a template
  return (
    <div className='add-trip-container'>
      <form className='create' onSubmit={handleSubmit}>
        <h3>Add a New Trip</h3>

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
              <DateTimePicker
                className={
                  emptyFields.includes('dateStart')
                    ? 'error date-picker'
                    : 'date-picker'
                }
                label='Starting Time'
                value={value}
                onChange={handleChangeStart}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>

            <Stack spacing={3}>
              <DateTimePicker
                className='date-picker'
                label='Ending Time'
                value={value}
                onChange={handleChangeStop}
                renderInput={(params) => <TextField {...params} />}
              />

              <MobileDateTimePicker
                value={dateWithInitialValue}
                onChange={(newValue) => {
                  setDateWithInitialValue(newValue);
                }}
                label='With error handler'
                onError={console.log}
                minDate={dayjs('2018-01-01T00:00')}
                inputFormat='DD/MM/YYYY HH:mm A'
                renderInput={(params) => (
                  <TextField
                    sx={{
                      svg: { color: '#fff' },
                      input: {
                        color: '#fff',
                        textShadow: '0px 0px 4px black',
                        backgroundColor: '#333',
                        opacity: '0.5',
                      },
                      label: { color: '#fff', fontSize: '1.2rem', top: '5px' },
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
    </div>
  );
};

export default TripForm;
