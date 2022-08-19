import { useEffect} from "react"
import TripDetails from "../components/TripDetails"
import TripForm from "../components/TripForm.js"
import { useTripContext } from "../hooks/useTripContext"


const Home = () => {
    const {trips, dispatch} = useTripContext()

    // useEffect fire function when a component is rendered. declare [] to make it empty when component is rendered
    useEffect(() => {
        const fetchTrips = async () => {
            const response = await fetch("http://localhost:4000/api/tracks")
            const json = await response.json()

            if(response.ok) {
                // fire function with case SET_TRIP in TripContext and as payload use all object json declared above as entire array get from server
                dispatch({type: "SET_TRIP", payload: json})
            }
        }

        fetchTrips()
    }, [dispatch])

    return (
        <div className="home">
            <div className="trip">
            {/* map throught the trips only when they are updated */}
                {trips && trips.map((trip) => (
                    <TripDetails key={trip._id} trip={trip} />
                ))}
            </div>
            <TripForm />
        </div>
    )
   
}

export default Home