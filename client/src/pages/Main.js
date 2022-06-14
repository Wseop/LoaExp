import { useEffect, useState } from "react";

import User from "../components/User.js";
import Summary from "../components/Summary.js";

function Main() {
    return (
        <div>
            {
                sessionStorage.getItem("userId") === null ? <User /> : <Summary />
            }
        </div>
    )
}

export default Main;