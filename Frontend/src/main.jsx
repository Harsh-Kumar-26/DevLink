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
import ClientApplications from './pages/Applications.jsx'
import ClientProjectReviews from './pages/Review.jsx'
import Status from './pages/Status.jsx'
import ProjectCard from './components/Projectcard.jsx'
import Liveproject from './pages/Ongoing.jsx'
import Pstpjt from './pages/Pastpjt.jsx'
import ProjectCardtwo from './components/Projectcardtwo.jsx'
import TestChat from './pages/Testpage.jsx'
import Cliveproject from './pages/Clilive.jsx'
import ChatPage from './components/Chat.jsx'


const router=createBrowserRouter([
  {
    path:"/",
    element:<Landing/>
  },{
    path:"/pastpjt",
    element:<Pstpjt/>
  },{
    path:"/l",
    element:<ProjectCardtwo/>
  },{
    path:"/clive",
    element:<Cliveproject/>
  },
  {
    path:"/chat",
    element:<ChatPage/>
  }
,{
  path:"/live",
  element:<Liveproject/>
},
  {
    path:"/review",
    element:<ClientProjectReviews/>
  },{
    path:"/status",
    element:<Status/>
  },
  {
    path:"/card",
    element:<ProjectCard/>
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
  <RouterProvider router={router}/>
)
  // <StrictMode>
    {/* <App /> */}
  {/* </StrictMode>, */}