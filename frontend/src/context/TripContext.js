import { createContext, useReducer } from "react";

export const TripContext = createContext();

export const tripReducer = (state, action) => {
    switch (action.type) {
        case "SET_TRIP":
            return {
                trips: action.payload
            }
        case "CREATE_TRIP":
            return {
                trips: [action.payload, ...state.trips]
            }
        case "DELETE_TRIP":
            return {
                trips: state.trips.filter((x) => x._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const TripContextProvider = ( { children }) => {
    const [state, dispatch] = useReducer(tripReducer, {
        trips:null
    })

    


    return (
        <TripContext.Provider value={{...state, dispatch}}>
            { children }
        </TripContext.Provider>
    )
}