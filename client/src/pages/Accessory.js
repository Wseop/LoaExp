import { useEffect, useState } from "react";
import axios from "axios";

import User from "../components/User.js";
import accessory from "../assets/accessory.json";

const category = accessory.category;
const grade = accessory.grade;
const part = accessory.part;
const ability = accessory.ability;
const engrave = accessory.engrave;
const from = accessory.from;

function Menu(props) {
    return (
        <div className="container" id="menu-accessory">
            <button className="btn btn-primary" onClick={() => {props.setSelect(1)}}>추가</button>
            <button className="btn btn-success" onClick={() => {props.setSelect(2)}}>수정</button>
            <button className="btn btn-danger" onClick={() => {props.setSelect(3)}}>삭제</button>
        </div>
    )
}

function AddAccessory() {
    const [selectGrade, setSelectGrade] = useState(null);
    const [selectPart, setSelectPart] = useState(null);
    const [selectQual, setSelectQual] = useState(null);
    const [selectAbility1, setSelectAbility1] = useState(null);
    const [selectAbility2, setSelectAbility2] = useState(null);
    const [selectEngrave1, setSelectEngrave1] = useState(null);
    const [selectEngrave2, setSelectEngrave2] = useState(null);
    const [selectFrom, setSelectFrom] = useState(null);
    const [message, setMessage] = useState(null);

    const add = () => {
        if (selectGrade == null || selectPart == null || selectQual == null || selectAbility1 == null || selectEngrave1 == null || selectEngrave2 == null || selectFrom == null) {
            setMessage("입력값을 확인하세요.");
        } else if (selectPart === "목걸이" && selectAbility2 == null) {
            setMessage("입력값을 확인하세요.");
        } else if (Number(selectQual) < 0 || Number(selectQual) > 100) {
            setMessage("입력값을 확인하세요.");
        } else {
            axios.post(process.env.REACT_APP_SERVER + "/accessory", 
            {
                grade: selectGrade,
                part: selectPart,
                quality: selectQual,
                ability1: selectAbility1,
                ability2: selectAbility2,
                engrave1: selectEngrave1,
                engrave2: selectEngrave2,
                from: selectFrom
            },
            {
                withCredentials: true
            })
            .then((res) => {
                window.location.replace("/accessory");
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    return (
        <div className="mt-3">
            <div className="input-group">
                <input placeholder="등급" type="text" className="form-control" list="gradeList" onChange={(event) => {setSelectGrade(event.target.value)}}/>
                <input placeholder="부위" type="text" className="form-control" list="partList" onChange={(event) => {setSelectPart(event.target.value)}}/>
                <input placeholder="품질" type="number" className="form-control" onChange={(event) => {setSelectQual(event.target.value)}} />
                <input placeholder="특성1" type="text" className="form-control" list="abilityList" onChange={(event) => {setSelectAbility1(event.target.value)}}/>
                {
                    selectPart === "목걸이" ? <input placeholder="특성2" type="text" className="form-control" list="abilityList" onChange={(event) => {setSelectAbility2(event.target.value)}}/>
                                            : <input placeholder="특성2" type="text" className="form-control" list="abilityList" disabled />
                }
                <input placeholder="각인1" type="text" className="form-control" list="engraveList" onChange={(event) => {setSelectEngrave1(event.target.value)}}/>
                <input placeholder="각인2" type="text" className="form-control" list="engraveList" onChange={(event) => {setSelectEngrave2(event.target.value)}}/>
                <input placeholder="획득처" type="text" className="form-control" list="fromList" onChange={(event) => {setSelectFrom(event.target.value)}}/>
                <button className="btn btn-outline-primary" onClick={() => {add()}}>추가</button>
                
                <datalist id="gradeList">
                    {
                        grade.map((v, i) => {
                            return (
                                <option key={i} value={v} />
                            )
                        })
                    }
                </datalist>
                <datalist id="partList">
                    {
                        part.map((v, i) => {
                            return (
                                <option key={i} value={v} />
                            )
                        })
                    }
                </datalist>
                <datalist id="abilityList">
                    {
                        ability.map((v, i) => {
                            return (
                                <option key={i} value={v} />
                            )
                        })
                    }
                </datalist>
                <datalist id="engraveList">
                    {
                        engrave.map((v, i) => {
                            return (
                                <option key={i} value={v} />
                            )
                        })
                    }
                </datalist>
                <datalist id="fromList">
                    {
                        from.map((v, i) => {
                            return (
                                <option key={i} value={v} />
                            )
                        })
                    }
                </datalist>
            </div>
            {
                message == null ? null : <div className="mt-3 fw-bold" style={{color: "#FF0000"}}>{message}</div>
            }
        </div>
    )
}

function Accessory() {
    const [select, setSelect] = useState(0);

    if (sessionStorage.getItem("userId") == null) {
        return (
            <User />
        )
    } else {
        return (
            <div className="mt-3 container text-center" id="accessory">
                <Menu setSelect={setSelect} />
                {
                    select === 1 ? <AddAccessory /> : null
                }
            </div>
        )
    }
}

export default Accessory;