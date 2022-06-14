import { Link } from "react-router-dom";
import axios from "axios";

function logout() {
    axios.get(process.env.REACT_APP_SERVER + "/user/logout", 
    {
        withCredentials: true
    })
    .then((res) => {
        if (res.data) {
            sessionStorage.removeItem("userId");
            window.location.replace("/");
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

function Navigation() {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark sticky-top ps-2">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">LoaExp</Link>
                <div className="collapse navbar-collapse justify-content-between" id="navItems">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/temp">temp</Link>
                        </li>
                    </ul>
                    {
                        sessionStorage.getItem("userId") === null ? null : 
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/userInfo">내 정보</Link>
                            </li>
                            <li className="nav-item">
                                <div className="nav-link" onClick={logout} style={{cursor: "pointer"}}>Logout</div>
                            </li>
                        </ul>
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navigation;