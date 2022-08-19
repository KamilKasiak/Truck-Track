import { TripContext } from "../context/TripContext";
import { useContext } from "react";

export const useTripContext = () => {
    const context = useContext(TripContext)

    if(!context) {
        throw Error("useTripContext must be used inside an TripContextProvider")
    }

    return context
}