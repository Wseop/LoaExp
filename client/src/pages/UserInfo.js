import { useEffect, useState } from "react";
import axios from "axios";

function deleteUser() {
    axios.delete(process.env.REACT_APP_SERVER + "/user",
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
    })
}

function UserInfo() {
    return (
        <div className="mt-2 container text-center">
            <p className="fs-1">사용자 아이디</p>
            <p className="fs-2">{sessionStorage.getItem("userId")}</p>
            <button className="mt-5 btn btn-lg btn-danger" onClick={deleteUser}>회원 탈퇴</button>
        </div>
    )
}

export default UserInfo;