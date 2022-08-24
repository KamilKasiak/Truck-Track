import { Link } from "react-router-dom"
import { useLogout } from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';


const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1><LocalShippingOutlinedIcon fontSize= {"large"} /> Truck Track</h1>
                </Link>
                <nav>
                {user && (
                    <div>
                <span>{user.email}</span>
                    <button onClick={() => {logout()}}>Log out</button>
                </div>
                )}
                {!user &&
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup"> Sign up</Link>
                    </div>
                }
                </nav>
            </div>
        </header>
    )
}

export default Navbar