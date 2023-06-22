import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RecoilRoot } from 'recoil';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import IndexPage from './pages/IndexPage';



const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
]);




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);



