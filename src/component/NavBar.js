import { useRecoilState } from "recoil";
import { jwtState, userEmailState } from "..";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const [jwt, setJwt] = useRecoilState(jwtState);
  const [userEmail, setUserEmail] = useRecoilState(userEmailState);
  console.log("loadOnStart...");

  if (sessionStorage.getItem("authToken"))
    setJwt(sessionStorage.getItem("authToken"));

  if (sessionStorage.getItem("authUserEmail"))
    setUserEmail(sessionStorage.getItem("authUserEmail"));

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-right">
      <div className="container-fluid">
        <a className="navbar-brand" onClick={() => navigate("/home")}>
          <i className="fab fa-twitter"></i>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              TWITTER
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav flex-grow-1 pe-3">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/home"
                >
                  <i className="fas fa-home me-2"></i>
                  TWITTER
                </a>
              </li>
              {!jwt && (
                <li className="nav-item">
                  <a className="nav-link" href="/flow/login">
                    로그인
                  </a>
                  <a className="nav-link" href="/flow/signup">
                    회원가입
                  </a>
                </li>
              )}
              {jwt && (
                <div className="dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-bars me-2"></i>
                    메뉴
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/settings/profile">
                        개인정보수정
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="/settings/deactivate"
                      >
                        계정비활성화
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
