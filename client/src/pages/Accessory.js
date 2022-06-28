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
            <button className="btn btn-warning" onClick={() => {props.setSelect(0)}}>조회</button>
            <button className="btn btn-primary" onClick={() => {props.setSelect(1)}}>추가</button>
            <button className="btn btn-success" onClick={() => {props.setSelect(2)}}>수정</button>
            <button className="btn btn-danger" onClick={() => {props.setSelect(3)}}>삭제</button>
        </div>
    )
}

function Statistics() {
    return (
        <div className="mt-3">

        </div>
    )
}

function AddAccessory() {
    const [inputGrade, setInputGrade] = useState(null);
    const [inputPart, setInputPart] = useState(null);
    const [inputQual, setInputQual] = useState(null);
    const [inputAbility1, setInputAbility1] = useState(null);
    const [inputAbility2, setInputAbility2] = useState(null);
    const [inputEngrave1, setInputEngrave1] = useState(null);
    const [inputEngrave2, setInputEngrave2] = useState(null);
    const [inputFrom, setInputFrom] = useState(null);
    const [message, setMessage] = useState(null);
    let formData = new FormData();

    const addOne = () => {
        if (inputGrade == null || inputPart == null || inputQual == null || inputAbility1 == null || inputEngrave1 == null || inputEngrave2 == null || inputFrom == null) {
            setMessage("입력값을 확인하세요.");
        } else if (inputPart === "목걸이" && inputAbility2 == null) {
            setMessage("입력값을 확인하세요.");
        } else if (Number(inputQual) < 0 || Number(inputQual) > 100) {
            setMessage("입력값을 확인하세요.");
        } else {
            axios.post(process.env.REACT_APP_SERVER + "/accessory", 
            {
                grade: inputGrade,
                part: inputPart,
                quality: inputQual,
                ability1: inputAbility1,
                ability2: inputAbility2,
                engrave1: inputEngrave1,
                engrave2: inputEngrave2,
                from: inputFrom
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
    const addFile = () => {
        axios.post(process.env.REACT_APP_SERVER + "/accessory/html", formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        })
        .then((res) => {
            window.location.replace("/accessory");
        })
        .catch((err) => {
            setMessage("확장자를 확인하세요.");
        })
    }

    return (
        <div className="mt-3">
            <p className="m-1 fw-bold text-start">[ 직접 추가 ]</p>
            <div className="input-group">
                <input placeholder="등급" type="text" className="form-control" list="gradeList" onChange={(event) => {setInputGrade(event.target.value)}}/>
                <input placeholder="부위" type="text" className="form-control" list="partList" onChange={(event) => {setInputPart(event.target.value)}}/>
                <input placeholder="품질" type="number" className="form-control" onChange={(event) => {setInputQual(event.target.value)}} />
                <input placeholder="특성1" type="text" className="form-control" list="abilityList" onChange={(event) => {setInputAbility1(event.target.value)}}/>
                {
                    inputPart === "목걸이" ? <input placeholder="특성2" type="text" className="form-control" list="abilityList" onChange={(event) => {setInputAbility2(event.target.value)}}/>
                                            : <input placeholder="특성2" type="text" className="form-control" list="abilityList" disabled />
                }
                <input placeholder="각인1" type="text" className="form-control" list="engraveList" onChange={(event) => {setInputEngrave1(event.target.value)}}/>
                <input placeholder="각인2" type="text" className="form-control" list="engraveList" onChange={(event) => {setInputEngrave2(event.target.value)}}/>
                <input placeholder="획득처" type="text" className="form-control" list="fromList" onChange={(event) => {setInputFrom(event.target.value)}}/>
                <button className="btn btn-outline-primary" onClick={() => {addOne()}}>추가</button>
                
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

            <div className="m-2"></div>
            <p className="m-1 fw-bold text-start">[ html 파일로 추가 ]</p>
            <div className="input-group">
                <input type="file" accept=".html" className="form-control" onChange={(event) => {formData.append("html", event.target.files[0])}}/>
                <button className="btn btn-outline-primary" onClick={() => {addFile()}}>추가</button>
            </div>

            {
                message == null ? null : <div className="mt-3 fw-bold" style={{color: "#FF0000"}}>{message}</div>
            }
        </div>
    )
}

function EditAccessory() {
    const [accessories, setAccessories] = useState([]);
    const [message, setMessage] = useState(null);

    const edit = (_id, newData) => {
        if (newData.grade === "" || newData.part === "" || newData.quality === "" || newData.ability1 === "" || newData.engrave1 === "" || newData.engrave2 === "" || 
            newData.from === "") {
            setMessage("입력값을 확인하세요.");
        } else if (newData.part === "목걸이" && newData.ability2 === "") {
            setMessage("입력값을 확인하세요.");
        } else if (newData.part !== "목걸이" && (newData.ability2 === "" || newData.ability2 != null)) {
            setMessage("입력값을 확인하세요.");
        } else if (Number(newData.quality) < 0 || Number(newData.quality) > 100) {
            setMessage("입력값을 확인하세요.");
        } else {
            axios.put(process.env.REACT_APP_SERVER + "/accessory",
            {
                _id: _id,
                grade: newData.grade,
                part: newData.part,
                quality: newData.quality,
                ability1: newData.ability1,
                ability2: newData.ability2,
                engrave1: newData.engrave1,
                engrave2: newData.engrave2,
                from: newData.from
            },
            {
                withCredentials: true
            })
            .then((res) => {
                window.location.replace("/accessory");
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };

    useEffect(() => {
        axios.get(process.env.REACT_APP_SERVER + "/accessory",
        {
            withCredentials: true
        })
        .then((res) => {
            setAccessories(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <div className="mt-3">
            {
                message == null ? null : <div className="mt-3 fw-bold" style={{color: "#FF0000"}}>{message}</div>
            }
            {
                accessories.map((accessory, i) => {
                    return (
                        <div key={i} className="input-group">
                            <input placeholder="등급" type="text" className="form-control" list="gradeList" defaultValue={accessory.grade} 
                                   onChange={(event) => {accessory.grade = event.target.value}} />
                            <input placeholder="부위" type="text" className="form-control" list="partList" defaultValue={accessory.part}
                                   onChange={(event) => {accessory.part = event.target.value}} />
                            <input placeholder="품질" type="number" className="form-control" defaultValue={accessory.quality} 
                                   onChange={(event) => {accessory.quality = event.target.value}} />
                            <input placeholder="특성1" type="text" className="form-control" list="abilityList" defaultValue={accessory.ability1} 
                                   onChange={(event) => {accessory.ability1 = event.target.value}} />
                            <input placeholder="특성2" type="text" className="form-control" list="abilityList" defaultValue={accessory.ability2} 
                                   onChange={(event) => {accessory.ability2 = event.target.value}} />
                            <input placeholder="각인1" type="text" className="form-control" list="engraveList" defaultValue={accessory.engrave1}
                                   onChange={(event) => {accessory.engrave1 = event.target.value}} />
                            <input placeholder="각인2" type="text" className="form-control" list="engraveList" defaultValue={accessory.engrave2} 
                                   onChange={(event) => {accessory.engrave2 = event.target.value}} />
                            <input placeholder="획득처" type="text" className="form-control" list="fromList" defaultValue={accessory.from}
                                   onChange={(event) => {accessory.from = event.target.value}} />
                            <button className="btn btn-outline-primary" onClick={() => {edit(accessory._id, accessory)}}>수정</button>
                        </div>
                    )
                })
            }

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
    )
}

function DeleteAccessory() {
    const [accessories, setAccessories] = useState([]);

    const del = (_id) => {
        axios.delete(process.env.REACT_APP_SERVER + "/accessory", 
        {
            data: {
                _id: _id
            },
            withCredentials: true
        })
        .then((res) => {
            window.location.replace("/accessory");
        })
        .catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        axios.get(process.env.REACT_APP_SERVER + "/accessory", 
        {
            withCredentials: true
        })
        .then((res) => {
            setAccessories(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, []);

    return (
        <div className="mt-3">
            {
                accessories.map((accessory, i) => {
                    return (
                        <div key={i} className="input-group">
                            <input placeholder="등급" type="text" className="form-control" list="gradeList" defaultValue={accessory.grade} disabled />
                            <input placeholder="부위" type="text" className="form-control" list="partList" defaultValue={accessory.part} disabled />
                            <input placeholder="품질" type="number" className="form-control" defaultValue={accessory.quality} disabled />
                            <input placeholder="특성1" type="text" className="form-control" list="abilityList" defaultValue={accessory.ability1} disabled />
                            <input placeholder="특성2" type="text" className="form-control" list="abilityList" defaultValue={accessory.ability2} disabled />
                            <input placeholder="각인1" type="text" className="form-control" list="engraveList" defaultValue={accessory.engrave1} disabled />
                            <input placeholder="각인2" type="text" className="form-control" list="engraveList" defaultValue={accessory.engrave2} disabled />
                            <input placeholder="획득처" type="text" className="form-control" list="fromList" defaultValue={accessory.from} disabled />
                            <button className="btn btn-outline-danger" onClick={() => {del(accessory._id)}}>삭제</button>
                        </div>
                    )
                })
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
                    select === 0 ? <Statistics /> :
                    select === 1 ? <AddAccessory /> : 
                    select === 2 ? <EditAccessory /> : 
                    select === 3 ? <DeleteAccessory /> : null
                }
            </div>
        )
    }
}

export default Accessory;