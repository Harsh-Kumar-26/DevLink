import Button from "./Button";
import { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LogoutButton({codn=false,onClick,className}){
    const navigate=useNavigate();
    const [loading,setloading]=useState(false);
    useEffect(()=>{
    async function logout(){
        try{
            if(codn){
                setloading(true);
                await axios.post(`${import.meta.env.VITE_BACKENDURL}/logout`,{},{ withCredentials: true });
                navigate("/");
            }
        }
        catch(err){
            console.error("Could not sign out");
            console.error(err);
        }
        finally{
            setloading(false);
        }
    }
    logout();
},[codn]);
  return (
    <div className="flex justify-center mt-6">
      <Button
        variant="danger"
        onClick={onClick}
        disabled={loading}
        type="button"
        className={className}
      >
        {loading?"Logging Out...":"Logout"}
      </Button>
    </div>
  );
}
