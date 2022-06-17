import { useEffect, useState } from "react";

import User from "../components/User.js";
import Characters from "../components/Characters.js";

function Main() {
    return (
        <div>
            {
                sessionStorage.getItem("userId") === null ? <User /> : <Characters />
            }
        </div>
    )
}

export default Main;