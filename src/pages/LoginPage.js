import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { jwtState, userEmailState } from "..";
import { REST_SERVER_ADDRESS } from "../common/constant";
import NavBar from '../component/NavBar';

function LoginPage() {
    // 필요한 훅 설정
    const navigate = useNavigate();
    const formRef = useRef();
    const [jwt, setJwt] = useRecoilState(jwtState);
    const [userEmail, setUserEmail] = useRecoilState(userEmailState);

    // 팝업에서 메세지 이벤트 발생시켰을 때 =======================
    window.onmessage = (evt) => {
      console.log(evt.data.type);
      if(evt.data.type ==="kakaoAuth") {
          setJwt(evt.data.jwtToken);
          setUserEmail(evt.data.userEmail);
          navigate("/");
      }
  }

    // 이벤트 처리
    const loginFormHandle = (evt) => {
        evt.preventDefault();
        const email = formRef.current.email.value;
        const password = formRef.current.password.value;
        if(email === "" || password === "") {
             formRef.current.email.focus();
             return;
        }
        //==============================================================
        const xhr = new XMLHttpRequest();
        xhr.open("POST", REST_SERVER_ADDRESS + "/api/v1/user/validate", false);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
        xhr.send("email=" + email + "&password=" + password);
        window.alert(xhr.status);
        if (xhr.status === 200) {
            // window.alert(xhr.responseText);
            const response = JSON.parse(xhr.responseText);
            // window.alert(response.token);
            setJwt(response.token);
            sessionStorage.setItem("authToken", response.token);
            setUserEmail(response.token);
            sessionStorage.setItem("authUserEmail", response.userEmail);
            setUserEmail(response.userEmail)
            navigate("/home");

        } else if(xhr.status===400) {

        } else {

        }
    }

// 카카오 로그인 클릭 이벤트
const kakaoLoginHandle = (evt) =>{ 

  const xhr = new XMLHttpRequest();
  xhr.open("GET", REST_SERVER_ADDRESS + "/api/v1/oauth/kakao", false);
  xhr.send();
//   window.alert(xhr.responseText);
  const url = JSON.parse(xhr.responseText).oauthUri;
  window.open(url, "_blank", "width=400, height=620, popup=1");
}

  return (<>
  <NavBar />
    <div className="container">
      <div className="box">
        <div>
          <h2>Login</h2>
          <hr />
        </div>
        <form onSubmit={loginFormHandle} ref={formRef}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" name="email" className="textBox" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" className="textBox" />
          </div>
          <div className="form-group">
            <button type="submit" className="from-control">
              로그인
            </button>
          </div>
        </form>
        <div className="form-group">
          <button type="button" className="from-control" onClick={kakaoLoginHandle}>
            카카오 로그인
          </button>
        </div>
        <div className="form-group">
          계정이 없으신가요?　<Link to="/flow/signup" style={{ textDecoration: 'none' }}>
              <span style={{ color: 'deepskyblue' }}>Sign Up</span></Link>
        </div>
      </div>
    </div>
    </>);
}

export default LoginPage;
