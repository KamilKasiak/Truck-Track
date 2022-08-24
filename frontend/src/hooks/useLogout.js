import { useAuthContext } from "./useAuthContext"
import { useTripContext} from "./useTripContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    //rename to not have collisions with trying get "dispatch function from 2 sources"
    const { dispatch: tripsDispatch } = useTripContext()

    const logout = () => {
        // Remove user from local storage
        localStorage.removeItem("user")

        //update the auth context. No payload because we return user: null
        dispatch({type: "LOGOUT"})
        tripsDispatch({type: "SET_TRIP", payload: null})

    }

    return { logout }
}