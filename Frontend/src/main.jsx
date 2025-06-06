import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Landing from './pages/Landingpage.jsx'
import LoginPage from './forms/login.jsx'
import SignupPage from './forms/signup.jsx'
import ProfilePage from './pages/Profile.jsx'
import EditProfilePage from './pages/Editprofile.jsx'
import ChangePasswordPage from './pages/Changepass.jsx'
import ProjectCard from './components/Projectcard.jsx'
import {defaultProject} from './components/Projectcard.jsx'
import MainLayout from './pages/Main.jsx'


const router=createBrowserRouter([
  {
    path:"/",
    element:<Landing/>
  },
  {
    path:"/l",
    element:<ProjectCard pjtid="6832ef2592a220b2b61e66d8"/>
  },
  {
    path:"/login",
    element:<LoginPage/>
  },
  {
    path:"/signup",
    element:<SignupPage/>
  },
  {
    path:"/profile",
    element:<ProfilePage/>
  },
  {
    path:"/changepassword",
    element:<ChangePasswordPage/>
  },
  {
    path:"/editprofile",
    element:<EditProfilePage/>
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </StrictMode>,
)