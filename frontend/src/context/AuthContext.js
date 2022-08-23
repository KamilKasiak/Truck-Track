import { createContext, useReducer, useEffect } from "react"

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN":
            return { user: action.payload }
        case "LOGOUT":
            return { user: null}
        default:
            return state
    }   
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        // initial state as 2nd argument. it is object here
        user:null
    })
    // make a one check when application reloads
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))

        if(user) {
            dispatch({type: "LOGIN", payload: user})
        }
    }, [])

    console.log("Auth context state: ", state)

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}