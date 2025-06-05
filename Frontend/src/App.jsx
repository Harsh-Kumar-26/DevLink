import React from "react";
import './App.jsx'
import { Outlet } from "react-router-dom";
import LogoutButton from "./components/Logout.jsx";
const App=()=>{
  return(
  <LogoutButton/>
  )
}
export default App