import { useState } from "react";
import axios from "axios";

function Signup(props) {
    const signup = (event) => {
        event.preventDefault();

        if (event.target.id.value.length === 0) {
            props.setMessage("아이디를 입력해주세요.");
        } else if (event.target.pw.value.length === 0) {
            props.setMessage("비밀번호를 입력해주세요.");
        } else if (event.target.pw.value !== event.target.pwCheck.value) {
            props.setMessage("비밀번호를 확인해주세요.");
        } else {
            axios.post(process.env.REACT_APP_SERVER + "/user/signup",
            {
                id: event.target.id.value,
                pw: event.target.pw.value
            },
            {
                withCredentials: true
            })
            .then((res) => {
                if (res.data) {
                    props.setMessage("회원가입이 완료되었습니다. 로그인해주세요.");
                    props.setLoginState(true);
                } else {
                    props.setMessage("이미 존재하는 아이디입니다.");
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    return (
        <form onSubmit={signup}>
            <div>
                <label className="form-label">아이디</label>
                <input type="text" className="form-control" name="id" />
            </div>
            <div>
                <label className="mt-2 form-label">비밀번호</label>
                <input type="password" className="form-control" name="pw" />
            </div>
            <div>
                <label className="mt-2 form-label">비밀번호 확인</label>
                <input type="password" className="form-control" name="pwCheck" />
            </div>
            <div>
                <button type="submit" className="mt-2 btn btn-primary w-100">회원가입</button>
            </div>
        </form>
    )
}

function Login(props) {
    const login = (event) => {
        event.preventDefault();

        if (event.target.id.value.length === 0 || event.target.pw.value.length === 0) {
            props.setMessage("아이디 및 비밀번호를 확인하세요.");
        } else {
            axios.post(process.env.REACT_APP_SERVER + "/user/login", 
            {
                id: event.target.id.value,
                pw: event.target.pw.value
            }, 
            {
                withCredentials: true
            })
            .then((res) => {
                if (res.data === false) {
                    props.setMessage("아이디 및 비밀번호를 확인하세요.")
                } else {
                    sessionStorage.setItem("userId", res.data);
                    window.location.replace("/");
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    return (
        <form onSubmit={login}>
            <div>
                <label className="form-label">아이디</label>
                <input type="text" className="form-control" name="id" />
            </div>
            <div>
                <label className="mt-2 form-label">비밀번호</label>
                <input type="password" className="form-control" name="pw" />
            </div>
            <div>
                <button type="submit" className="mt-2 btn btn-primary w-100">로그인</button>
            </div>
        </form>
    )
}

function User() {
    const [loginState, setLoginState] = useState(true);
    const [message, setMessage] = useState(null);

    return (
        <div className="mt-3 container" style={{width: "500px"}}>
            <div className="mb-2 btn-group w-100" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" />
                <label className="btn btn-outline-secondary" htmlFor="btnradio1" onClick={() => {setLoginState(true)}}>로그인</label>

                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" />
                <label className="btn btn-outline-secondary" htmlFor="btnradio2" onClick={() => {setLoginState(false)}}>회원가입</label>
            </div>
            {
                loginState === true ? <Login setMessage={setMessage} /> : <Signup setMessage={setMessage} setLoginState={setLoginState} />
            }
            {
                message === null ? null : <div className="mt-2 text-center" style={{color: "#FF0000"}}>{message}</div>
            }
        </div>
    )
}

export default User;