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
import MainLayout from './pages/Main.jsx'
import PostProject from './forms/createpjt.jsx'
import MyProjects from './pages/MyProjects.jsx'
import UserProjectsList from './components/Userpjtdata.jsx'
import ClientApplications from './pages/Applications.jsx'
import ClientProjectReviews from './pages/Review.jsx'

const router=createBrowserRouter([
  {
    path:"/",
    element:<Landing/>
  },{
    path:"/l",
    element:<UserProjectsList pjtkey="all"/>
  },
  {
    path:"/review",
    element:<ClientProjectReviews/>
  },
   {
    path:"/myprojects",
    element:<MyProjects/>
  },
  {
    path:"/postproject",
    element:<PostProject/>
  },
  {
    path:"/main",
    element:<MainLayout/>
  },
  {
    path:"/login",
    element:<LoginPage/>
  },
  {
    path:"/capp",
    element:<ClientApplications/>
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