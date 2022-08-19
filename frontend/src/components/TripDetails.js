import { useState } from "react"
import { useTripContext } from "../hooks/useTripContext";
import { formatDistanceToNow, formatDistanceStrict} from "date-fns"
import Zoom from '@mui/material/Zoom';


const TripDetails = ({ trip }) => {
 const [isExpanded, setExpanded] = useState(false)
  const { dispatch } = useTripContext()
 
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

  return (
      <div className="trip-details">
          <h4 onClick={onMouseClick}>{` ${trip.title} ‣‣‣ ${trip.cityTwo}`}</h4>
          {isExpanded ? <p><strong>Start date: </strong> {date}</p> : null }
          {isExpanded ? <p><strong>End date: </strong> {trip.dateStop ? date1 : ""}</p> : null }
          {isExpanded ? <p><strong>Work length: </strong> {trip.dateStop ? timeDiff : "On going"}</p> : null }
          <Zoom in = {isExpanded}>
          <span className="material-symbols-outlined" onClick={handleDeleteClick}>delete</span>
          </Zoom>
          {isExpanded ? <p>{formatDistanceToNow(new Date( trip.createdAt ), { addSuffix: true } )}</p> : null }

      </div>
  )
}

export default TripDetails