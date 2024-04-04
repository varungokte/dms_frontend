import { useEffect } from "react";
import useGlobalContext from "../../GlobalContext";

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

    return (
        <div>This is the Dashboard {isLoggedIn() ? <>Logged In</> : <>Logged Out</>}</div>
    )
}

export default Dashboard;