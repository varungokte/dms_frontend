import { useEffect } from "react";
import useGlobalContext from "../../GlobalContext";
import { PriorityIterate } from "./BasicComponents/Priority";

function Dashboard() {

    const { isLoggedIn } = useGlobalContext();

    /* useEffect(()=>{
    fetch("http://192.168.1.2:3000/api/v1/allAPI/data").then((res:any)=>{
        console.log(res)
        res.json().then((obj:any)=>{
            console.log(obj)
        })
    })
    },[])
     */

    console.log(PriorityIterate())
    return (
        <div>This is the Dashboard {isLoggedIn() ? <>Logged In</> : <>Logged Out</>}</div>
    )
}

export default Dashboard;