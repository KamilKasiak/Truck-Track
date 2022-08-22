import { useState } from "react"
import { useTripContext } from "../hooks/useTripContext";
import { formatDistanceToNow, formatDistanceStrict} from "date-fns"
import Zoom from '@mui/material/Zoom';


const TripDetails = ({ trip }) => {
    const [isExpanded, setExpanded] = useState(false)
    const { dispatch } = useTripContext()
    const [dateStop, setStop] = useState("")
    const [isParagraphClicked, setParagraphClicked] = useState(false)
    const [error, setError] = useState(null)
    const id = trip._id

    const date = new Date(trip.dateStart).toLocaleDateString(
        'en-gb',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
      );

    const date1 = new Date(trip.dateStop).toLocaleDateString(
      'en-gb',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    );

    
    const handleDeleteClick = async () => {
      
      const response = await fetch("http://localhost:4000/api/tracks/" + trip._id, {
        method: "DELETE"
      })
      // waiting for response from server then get json from it
      const json = await response.json()

      if(response.ok){
          dispatch({type: "DELETE_TRIP", payload: json})
      }
    }

    const handleUpdateSubmit = async (e) => {
      //e.preventDefault()
      const tripUpdate  = { dateStop }
      
      const response = await fetch("http://localhost:4000/api/tracks/" + trip._id, {
        method: "PATCH",
          body: JSON.stringify(tripUpdate),
          headers: {
              "content-type": "application/json"
          }
      })
        const json = await response.json()

      if(!response.ok) {
        setError(json.error)
        console.log(trip)
      }
      if(response.ok) {
        setError(null)
        setParagraphClicked(false)
        dispatch({type: "SET_TRIP", payload: json})
        console.log("Update sucesfull" + trip)
      }
    }

    const timeDiff = formatDistanceStrict(new Date(trip.dateStop), new Date(trip.dateStart), {
      unit: 'hour',
      roundingMethod: 'ceil'
    })

    const onMouseClick = () => {
      if(!isExpanded) {
        setExpanded(true)
      } else {
        setExpanded(false)
      }
    }

    const onParagraphClick = () => {
      if(!isParagraphClicked) {
        setParagraphClicked(true)
      } else {
        setParagraphClicked(false)
      }
    }
    

  return (
      <div className="trip-details">
          <h4 onClick={onMouseClick}>{` ${trip.title} ‣‣‣ ${trip.cityTwo}`}</h4>
          {isExpanded ? <p><strong>Start date: </strong> {date}</p> : null }
          {isExpanded ? <p onClick={onParagraphClick} ><strong>End date: </strong> {trip.dateStop ? date1 : "Click to update"}</p> : null }
          {isParagraphClicked && !trip.dateStop ? 
            <form onSubmit={handleUpdateSubmit}><input
                type="datetime-local"
                onChange={(event) => 
                setStop(event.target.value) }
                value={dateStop}
                
                
                />
            <button>update</button> 
            </form> : null}
    
          {isExpanded ? <p><strong>Work length: </strong> {trip.dateStop ? timeDiff : "On going"}</p>: null }
        
          <Zoom in = {isExpanded}>
          <span className="material-symbols-outlined" onClick={handleDeleteClick} >delete</span>
          </Zoom>
          {isExpanded ? <p>{formatDistanceToNow(new Date( trip.createdAt ), { addSuffix: true } )}</p> : null }
          {error && <div className="error">{error}</div>}
      </div>
  )
}

export default TripDetails