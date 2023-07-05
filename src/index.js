import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RecoilRoot, atom } from 'recoil';
import './index.css';
import HomePage from './pages/HomePage';
import IndexPage from './pages/IndexPage';
import KakaoCallBackPage from './pages/KakaoCallBackPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DeactivatePage from './pages/settings/DeactivatePage';
import DeactivatedPage from './pages/settings/DeactivatedPage';
import ProfilePage from './pages/settings/ProfilePage';

// =========================================================
export const jwtState = atom(
  { key: "jwtState", default: null }
);
export const userEmailState = atom(
  { key: "userEmailState", default: null }
);
// =========================================================

const router = createBrowserRouter([
  { path: "/", element: <IndexPage />},
  { path: "/flow/login", element: <LoginPage />},
  { path: "/flow/signup", element: <SignUpPage />},
  { path: "/flow/kakao/callback", element: <KakaoCallBackPage />},
  { path: "/home", element: <HomePage />},
  { path: "/settings/profile", element: <ProfilePage /> },
  { path: "/settings/deactivate", element: <DeactivatePage />},
  { path: "/settings/deactivated", element: <DeactivatedPage /> }
]);




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);



