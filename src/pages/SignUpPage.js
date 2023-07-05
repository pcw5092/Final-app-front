import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { REST_SERVER_ADDRESS } from "../common/constant";
import NavBar from '../component/NavBar';
const SignUpPage = () => {
  const [availableFlag, setAvailableFlag] = useState(0);

  const formRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const verifyBtnRef = useRef();

  const navigate = useNavigate();

  // 이벤트 처리 코드 ========================================================================
  // 사용자가 이메일 입력란에 값 입력시 , 사용가능여부를 확인하는 API 통신 처리
  const emailChangeHandle = (evt) => {
    if (/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(evt.target.value)) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", `${REST_SERVER_ADDRESS}/api/v1/user/available?email=${formRef.current.email.value}`, false);
      xhr.send();
      if (xhr.status === 200) {
        verifyBtnRef.current.disabled = false;
        setAvailableFlag(1);
      } else {
        verifyBtnRef.current.disabled = true;
        setAvailableFlag(-1);
      }
    } else {
      verifyBtnRef.current.disabled = true;
      setAvailableFlag(0);
    }
  };

  // 사용자가 이메일 인증코드를 요청시 , 메일을 발송시키는 API를 호출
  const verfiyBtnClickHandle = (evt) => {
    console.log("!!!!!");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${REST_SERVER_ADDRESS}/api/v1/user/verify-email`, false);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(`email=${formRef.current.email.value}`);
    console.log(xhr.responseText);
    setAvailableFlag(2);
  };

  // 사용자가 인증코드 입력 후 엔터 눌렀을 때, 코드 검증 처리를 하는 API를 호출
  const codeSubmitHandle = (evt) => {
    if (evt.keyCode !== 13) return;
    evt.preventDefault();
    console.log("!!!!!");
    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", `${REST_SERVER_ADDRESS}/api/v1/user/verify-email`, false);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(`email=${formRef.current.email.value}&code=${evt.target.value}`);
    if (xhr.status === 200) {
      setAvailableFlag(4);
      emailRef.current.readOnly = true;
      verifyBtnRef.current.disabled = true;
    } else {
      const response = JSON.parse(xhr.responseText);
      window.alert(response.cause);
    }
  };

  // 사용자가 회원가입을 눌렀을 때, 신규 유저를 등록하는 API를 호출
  const signupSubmitHandle = (evt) => {
    evt.preventDefault();
    const email = emailRef.current.value;
    const name = formRef.current.name.value;
    const password = passwordRef.current.value;

    if (email === "" || name === "" || password === "" || availableFlag !== 4) {
      window.alert("회원가입에 필요한 절차를 통과하지 못했습니다.");
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${REST_SERVER_ADDRESS}/api/v1/user/join`, false);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(`email=${email}&name=${name}&password=${password}`);
    window.alert(xhr.status);
    if (xhr.status === 201) {
      navigate("/flow/login");
    } else {
      // Handle error
    }
  };

  return (<>
    <NavBar />
    <div className="container">
      <div className="box">
        <div>
          <h1 className="text-center">계정을 생성하세요</h1>
          <hr />
        </div>
        <form ref={formRef} onSubmit={signupSubmitHandle}>
          <div className="form-group">
            <label>이름</label>
            <input className="form-control" type="text" placeholder="이름" name="name" />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="이메일"
                onChange={emailChangeHandle}
                name="email"
                ref={emailRef}
              />
              <button
                className="btn btn-primary"
                type="button"
                ref={verifyBtnRef}
                onClick={verfiyBtnClickHandle}
              >
                이메일 인증
              </button>
            </div>
            {availableFlag === 1 && <div className="message success">사용 가능한 이메일입니다.</div>}
            {availableFlag === -1 && <div className="message error">이미 사용 중인 이메일입니다.</div>}
            {availableFlag === 2 && (
              <div className="form-group">
                <label>이메일 인증번호</label>
                <input className="form-control" type="text" placeholder="인증번호" onKeyDown={codeSubmitHandle} />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input className="form-control" type="password" placeholder="비밀번호" ref={passwordRef} />
          </div>
          <div className="form-group">
            <button className="btn btn-success btn-block" type="submit">
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  </>);
};

export default SignUpPage;
