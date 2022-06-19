import { useState, useEffect } from "react";
import { Modal, Dropdown } from "react-bootstrap";
import axios from "axios";

const CLASS = [
    "워로드", "디스트로이어", "버서커", "홀리나이트",
    "배틀마스터", "인파이터", "기공사", "창술사", "스트라이커",
    "서머너", "바드", "아르카나", "소서리스",
    "데빌헌터", "블래스터", "호크아이", "스카우터", "건슬링어",
    "도화가"
];

function addCharacter(cls, level, name) {
    axios.put(process.env.REACT_APP_SERVER + "/characters/add",
    {
        class: cls,
        level: level,
        name: name
    },
    {
        withCredentials: true
    })
    .then((res) => {
        window.location.replace("/");
    })
    .catch((err) => {
        console.log(err);
    });
}

function editCharacter(index, cls, level, name) {
    axios.put(process.env.REACT_APP_SERVER + "/characters/edit",
    {
        index: index,
        newClass: cls,
        newLevel: level,
        newName: name
    }, {
        withCredentials: true
    })
    .then((res) => {
        window.location.replace("/");
    })
    .catch((err) => {
        console.log(err);
    });
}

function deleteCharacter(index) {
    axios.delete(process.env.REACT_APP_SERVER + "/characters",
    {
        data: {
            index: index
        },
        withCredentials: true
    })
    .then((res) => {
        window.location.replace("/");
    })
    .catch((err) => {
        console.log(err);
    });
}

function Characters() {
    const [characterList, setCharacterList] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [inputClass, setInputClass] = useState(null);
    const [inputLevel, setInputLevel] = useState(0);
    const [inputName, setInputName] = useState(null);
    const [errMessage, setErrMessage] = useState(null);

    useEffect(() => {
        // 서버에서 보유 캐릭터 목록을 조회
        axios.get(process.env.REACT_APP_SERVER + "/characters",
        {
            withCredentials: true
        })
        .then((res) => {
            setCharacterList(res.data);
        })
        .catch((err) => {
            if (err) console.log(err);
        });
    }, []);

    return (
        <div className="mt-3 w-25 container" id="characters">
            <p className="fs-1 fw-bold text-center">보유 캐릭터</p>
            <button className="m-1 w-100 btn btn-lg btn-primary">전체 현황 보기</button>
            {
                characterList.map((character, i) => {
                    if (deleteShow) {
                        return (
                            <div key={i} className="w-100 text-center">
                                <button className="m-1 w-75 btn btn-lg btn-secondary">{`${character.name} (${character.level})`}</button>
                                <button className="m-1 btn btn-lg btn-danger" onClick={() => {deleteCharacter(i)}}>삭제</button>
                            </div>
                        )
                    } else if (editShow) {
                        return (
                            <div key={i} className="w-100 text-center">
                                <button className="m-1 w-75 btn btn-lg btn-secondary">{`${character.name} (${character.level})`}</button>
                                <button className="m-1 btn btn-lg btn-primary" onClick={() => {
                                    setEditIndex(i);
                                    setInputClass(character.class);
                                    setInputLevel(character.level);
                                    setInputName(character.name);
                                    setEditModalShow(true);
                                }}>수정</button>
                            </div>
                        )
                    }
                    else {
                        return (
                            <button key={i} className="m-1 w-100 btn btn-lg btn-secondary">{`${character.name} (${character.level})`}</button>
                        )
                    }
                })
            }
            <button className="m-1 w-100 btn btn-lg btn-outline-success" onClick={() => {
                setAddModalShow(true); 
                setInputClass(null);
                setInputLevel(0);
                setInputName(null);
                setErrMessage(null);
            }}>캐릭터 추가</button>
            {
                (editShow || deleteShow) === true ? <button className="m-1 w-100 btn btn-lg btn-outline-secondary" onClick={() => {
                                                        setEditShow(false);
                                                        setDeleteShow(false);
                                                    }}>취소</button>
                                                  : <div className="m-1 w-100">
                                                        <button className="w-50 btn btn-lg btn-outline-primary" onClick={() => {setEditShow(true)}}>수정</button>
                                                        <button className="w-50 btn btn-lg btn-outline-danger" onClick={() => {setDeleteShow(true)}}>삭제</button>
                                                    </div>
                                                    
            }

            <Modal show={addModalShow} onHide={() => {setAddModalShow(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-2 fw-bold">캐릭터 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="m-1" id="inputClass">
                        <Dropdown style={{display: "inline"}}>
                            <Dropdown.Toggle variant="secondary">직업 선택</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    CLASS.map((cls, i) => {
                                        return (
                                            <Dropdown.Item key={i} onClick={() => {setInputClass(cls)}}>{cls}</Dropdown.Item>
                                        )
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <span className="ms-3 fw-bold">{inputClass}</span>
                    </div>
                    <div className="m-1" id="inputLevel">
                        <input type="number" placeholder="아이템 레벨" min="0" onChange={(event) => {setInputLevel(event.target.value)}}></input>
                    </div>
                    <div className="m-1" id="inputName">
                        <input type="text" placeholder="캐릭터명" onChange={(event) => {setInputName(event.target.value)}}></input>
                    </div>
                    {
                        errMessage == null ? null : <div className="m-1" style={{color: "#FF0000"}}>{errMessage}</div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => {setAddModalShow(false)}}>
                        취소
                    </button>
                    <button className="btn btn-primary" onClick={() => {
                        if (inputClass == null || inputLevel === 0 || inputName == null) {
                            setErrMessage("입력값을 확인하세요.");
                        } else {
                            addCharacter(inputClass, inputLevel, inputName);
                            setAddModalShow(false);
                        }
                    }}>추가</button>
                </Modal.Footer>
            </Modal>

            <Modal show={editModalShow} onHide={() => {setEditModalShow(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-2 fw-bold">캐릭터 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="m-1" id="inputClass">
                        <Dropdown style={{display: "inline"}}>
                            <Dropdown.Toggle variant="secondary">직업 선택</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    CLASS.map((cls, i) => {
                                        return (
                                            <Dropdown.Item key={i} onClick={() => {setInputClass(cls)}}>{cls}</Dropdown.Item>
                                        )
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <span className="ms-3 fw-bold">{inputClass}</span>
                    </div>
                    <div className="m-1" id="inputLevel">
                        <input type="number" placeholder="아이템 레벨" min="0" value={inputLevel} onChange={(event) => {setInputLevel(event.target.value)}}></input>
                    </div>
                    <div className="m-1" id="inputName">
                        <input type="text" placeholder="캐릭터명" value={inputName} onChange={(event) => {setInputName(event.target.value)}}></input>
                    </div>
                    {
                        errMessage == null ? null : <div className="m-1" style={{color: "#FF0000"}}>{errMessage}</div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => {setEditModalShow(false)}}>
                        취소
                    </button>
                    <button className="btn btn-primary" onClick={() => {
                        if (inputClass == null || inputLevel === 0 || inputName == null) {
                            setErrMessage("입력값을 확인하세요.");
                        } else {
                            editCharacter(editIndex, inputClass, inputLevel, inputName);
                            setEditModalShow(false);
                        }
                    }}>수정</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Characters;