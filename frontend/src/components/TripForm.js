import { useState } from "react"
import { useTripContext } from "../hooks/useTripContext"
import { useAuthContext } from "../hooks/useAuthContext"


const TripForm = () => {
    const { dispatch } = useTripContext()
    const { user } = useAuthContext()
    const [title, setTitle] = useState("")
    const [cityTwo, setCityTwo] = useState("")
    const [dateStart, setStart] = useState("")
    const [dateStop, setStop] = useState("")
    const [milageStart, setMilageStart] = useState("")
    const [milageStop, setMilageStop] = useState("")
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async(e) => {
        //prevent to reload page on submit
        e.preventDefault()
        if(!user) {
            setError("You must be logged in")
            return
        }

        const trip = {title, cityTwo, dateStart, dateStop, milageStart, milageStop}

        const response = await fetch("http://localhost:4000/api/tracks" || "/api/tracks", {
            method: "POST",
            body: JSON.stringify(trip),
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(!response.ok) { 
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if(response.ok) {
            setTitle("")
            setStart("")
            setStop("")
            setCityTwo("")
            setMilageStart("")
            setMilageStop("")
            setError(null)
            setEmptyFields([])
            console.log("New trip added", json)
            dispatch({type: "CREATE_TRIP", payload: json})
        }
    }

    // use colons when return a template
    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Trip</h3>

            <div className="cities">
            <input className={emptyFields.includes("title") ? "error cityOne" : "cityOne"}
            type="text"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
            placeholder="From"
            />
             <input className={emptyFields.includes("cityTwo") ? "error cityTwo" : "cityTwo"}
            type="text"
            onChange={(event) => setCityTwo(event.target.value)}
            value={cityTwo}
            placeholder="To"
            />
            </div>

            <label>Starting time</label>
            <input className={emptyFields.includes("dateStart") ? "error" : ""}
            type="datetime-local"
            onChange={(event) => setStart(event.target.value)}
            value={dateStart}
            />

            <label>End time</label>
            <input
            type="datetime-local"
            onChange={(event) => setStop(event.target.value)}
            value={dateStop}
            />
            <div className="millage">
            <input className={emptyFields.includes("milageStart") ? "error half" : "half"} 
            type="number" 
            placeholder="KM start"
            onChange={(event) => setMilageStart(event.target.value)}
            value={milageStart}
            />
            <input type="number" 
            className="half" 
            placeholder="KM end"
            onChange={(event) => setMilageStop(event.target.value)}
            value={milageStop}
            />
            </div>

            <button className="tripAddButton">Add Trip</button>
        {error && <div className="error">{error}</div>}
        </form>
    )
}

export default TripForm