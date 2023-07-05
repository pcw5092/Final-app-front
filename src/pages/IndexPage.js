import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { jwtState } from "..";
import "../index.css";
import NavBar from '../component/NavBar';

function IndexPage() {
  const jwt = useRecoilValue(jwtState);
  const navigate = useNavigate();

  // =========================================================
  useEffect(() => {
    // window.alert("!!!");
    if (jwt) {
      //navigate("/home");
    }
  }, []);
  // =========================================================

  return (<>
    <NavBar />
    <div className="container">
      <div className="box">
        <div>
          <h1>TWITTER</h1>
        </div>
        <div className="index-links-container">
        </div>
      </div>
    </div>
  </>);
}

export default IndexPage;
