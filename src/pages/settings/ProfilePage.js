import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { jwtState } from "../..";
import { REST_SERVER_ADDRESS } from "../../common/constant";
import NavBar from "../../component/NavBar";

function ProfilePage() {
    const [jwt, setJwt] = useRecoilState(jwtState);

    const imageRef = useRef();
    const nameRef = useRef();
    const fileRef = useRef();
    
    // useEffect 특정 상태에 변경이 될때마다 자동 처리되는 함수 등록
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(REST_SERVER_ADDRESS + "/api/v1/user/private", {
                    headers: {
                        Authorization: jwt,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    imageRef.current.src = result.user.profileImage;
                    nameRef.current.value = result.user.name;
                } else {
                    console.error("Error:", response.status);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchUserData();
    }, [jwt]);
    // =============================
    const submitHandle = async (evt) => {
        evt.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", nameRef.current.value);
            if (fileRef.current.files.length !== 0)
                formData.append("profile", fileRef.current.files[0]);

            const response = await fetch(REST_SERVER_ADDRESS + "/api/v1/user/private/info", {
                method: "POST",
                headers: {
                    Authorization: jwt,
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                imageRef.current.src = result.user.profileImage;
                nameRef.current.value = result.user.name;
                window.alert("정보변경이 처리되었습니다.");
                fileRef.current.value = "";
            } else {
                window.alert("정보변경이 실패하였습니다.");
            }
        } catch (error) {
            console.error("Error:", error);
            window.alert("정보변경 중에 오류가 발생하였습니다.");
        }
    };

    const fileChangeHandle = (evt) => {
        const file = fileRef.current.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            imageRef.current.src = reader.result;
        };
    };

    const imgClickHandle = () => {
        fileRef.current.click();
    };

    return (
        <>
            <NavBar />
            <div className="container">
                <div className="box">
                    <div className="profilePage">
                        <h4>#개인정보수정</h4>
                    </div>
                    <form className="profilePage-form" onSubmit={submitHandle}>
                        <div className="profilePage-profileImage">
                            <img ref={imageRef} onClick={imgClickHandle} style={{ cursor: "pointer" }} alt="Profile" />
                            <input type="file" accept="image/*" ref={fileRef} onChange={fileChangeHandle} style={{ display: "none" }} />
                        </div>
                        <div className="profilePage-text">
                            <input type="text" ref={nameRef} />
                        </div>
                        <div className="profilePage-button">
                            <button type="submit">수정</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;

