import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const { signup, error, isLoading} = useSignup()

    const handleSubmit = async (event) => {
        event.preventDefault()
       
        await signup(email, password)
       
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>
            <label>Email:</label>
            <input 
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                placeholder="Enter email"
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                placeholder="Enter Password"
            />
            <label>Confirm Password:</label>
            <input
                type="password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                value={confirmPassword}
                className={password!==confirmPassword ? "error" : null}
                placeholder="Confirm Password"   
            />
            
            <button className="loginButton" disabled= {isLoading}>Sign Up</button>
            {password !== confirmPassword ? <div className="error"><p>Passwords doesn't match</p></div> : null}

            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Signup